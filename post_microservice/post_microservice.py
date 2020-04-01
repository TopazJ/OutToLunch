import json
import logging
import pymysql
import rds_config
import re
import sys
import uuid
from boto3.dynamodb.types import TypeDeserializer
from datetime import datetime
from query_generation import *

# variables

#words that will not be searched for if present in a search criteria
commonWords = ['the', 'of', 'and', 'a', 'to', 'in', 'is', 'you', 'that', 'it', 'was', 'for']
#fields that a user cannot update when updating a post
unableToUpdate = ['post_id', 'post_user', 'establishment_id', 'upvote', 'downvote', 'date']

# rds settings

rds_host = rds_config.db_host
name = rds_config.db_username
password = rds_config.db_password
db_name = rds_config.db_name

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# connection to database established so don't have to reopen a connection each time the lambda function is invoked
try:
    conn = pymysql.connect(rds_host, user=name, passwd=password, db=db_name, connect_timeout=5)
except pymysql.MySQLError as e:
    logger.error("Error: unexpected error: could not connect to MySQL instance.")
    logger.error(e)
    sys.exit()

logger.info("SUCCESS: Connection to RDS MySQL instance succeeded")


def respond(err, res=None):
    """A response for the HTTP GET request"""
    return {
        'statusCode': '400' if err else '200',
        'body': err.message if err else json.dumps(res),
        'headers': {
            'Content-Type': 'application/json',
        },
    }

logger.setLevel(logging.WARNING)

def handler(event, context):
    """the lambda_handler, catches GET requests or dynamodb stream and returns a response"""
    response = None
    try:
        if 'Records' in event:
            record = testSerializer(event['Records'][0]['dynamodb']['NewImage'])
            type = record['type']
            if type == "PostCreatedEvent":
                addPost(record)
            elif type == "PostUpdatedEvent":
                updatePost(record)
            elif type == "PostDeletedEvent":
                deletePost(record)
            elif type == "PostVoteEvent":
                votePost(record)
            response = None
        else:
            if event['httpMethod'] == "GET":
                response = respond(None, getPost(event))
    except Exception as error:
        logger.exception(error)
        response = {
            'status': 500,
            'error': {
                'type': type(error).__name__,
                'description': str(error),
            },
        }
    finally:
        return response


def testSerializer(data):
    """formats dynamodb stream into python dict, taken from stack overflow

        Taken directly from stack overflow post
        https://stackoverflow.com/questions/41746735/aws-dynamodb-stream-python-convert-native-format?fbclid=IwAR3hz2KaLDTrVJUvvU8MaLL80iVh0omKkpXkIL6IlesBE1sjNk-6MJtyG_4
    """
    deserializer = TypeDeserializer()
    if isinstance(data, list):
        return [deserializer.deserialize(v) for v in data]
    if isinstance(data, dict):
        try:
            return deserializer.deserialize(data)
        except TypeError:
            return {k: deserializer.deserialize(v) for k, v in data.items()}
    else:
        return data


def getPost(getRequestEvent):
    """retrieves posts based on most recent, establishment, user, search criteria or post_id, returns post user id for validation"""
    path = getRequestEvent['path']
    try:
        pageNumber = int(getRequestEvent['queryStringParameters']['page'])
    except TypeError as err:
        pageNumber = 0
    if 'search' in path:
        return searchPosts(getRequestEvent['queryStringParameters']['search_criteria'], pageNumber)
    elif 'validate' in path:
        thePostId = path.replace('/posts/validate/', '')
        return validateUser(thePostId)
    else:
        query = generateGetPostSQLQuery(getRequestEvent, pageNumber)
        with conn.cursor() as cur:
            cur.execute(query)
            thePosts = cur.fetchall()
            list = []
            for row in thePosts:
                post = convertResults(row)
                list.append(post)
            conn.commit()
        return list


def addPost(postCreatedEvent):
    """adds a new post to the post table after receiving a PostCreatedEvent from dynamodb"""
    query = generatePostSQLQuery(postCreatedEvent)
    with conn.cursor() as cur:
        cur.execute(query)
        conn.commit()


def deletePost(deletePostEvent):
    """sets postcontent to [deleted]"""
    query = generateDeletePostSQLQuery(deletePostEvent)
    with conn.cursor() as cur:
        cur.execute(query)
        conn.commit()


def updatePost(updatePostEvent):
    """updates post fields specified by the PostUpdatedEvent"""
    postId = updatePostEvent["data"]["post_id"]
    with conn.cursor() as cur:
        for key, value in updatePostEvent["data"].items():
            if key not in unableToUpdate:
                query = 'UPDATE post SET {} = \"{}\" WHERE post_id = \"{}\"'.format(key, value, postId)
                cur.execute(query)
        conn.commit()


def votePost(votePostEvent):
    """updates the post upvote and downvote in the post table and ensures user can only have one vote per post

    to ensure 1 vote/post -> if a user has not voted they will be added to a vote table and their vote recorded, if a
    user has already voted if their vote has changed it will adjust in the vote table. vote(-1 = downvote, +1 = upvote)
     Post upvotes and downvotes updated as needed
    """
    userID = votePostEvent["data"]["user_id"]
    postID = votePostEvent["data"]["post_id"]
    vote = int(votePostEvent["data"]["vote"])
    query = ('SELECT * FROM vote WHERE post_id = \"{}\" AND user_id = \"{}\"'.format(postID, userID))
    with conn.cursor() as cur:
        affectedRow = cur.execute(query)
        if affectedRow > 0:
            row = cur.fetchone()
            if vote > 0 and not row[2]:
                query = (
                    'UPDATE vote SET upvote = true, downvote = false WHERE post_id = \"{}\" AND user_id = \"{}\"'.format(
                        postID, userID))
                cur.execute(query)
                query = 'UPDATE post SET upvote = upvote+1, downvote = downvote-1 WHERE post_id = \"{}\"'.format(postID)
                cur.execute(query)
            elif vote < 0 and not row[3]:
                query = (
                    'UPDATE vote SET upvote = false, downvote = true WHERE post_id = \"{}\" AND user_id = \"{}\"'.format(
                        postID, userID))
                cur.execute(query)
                query = 'UPDATE post SET upvote = upvote-1, downvote = downvote+1 WHERE post_id = \"{}\"'.format(postID)
                cur.execute(query)
        else:
            if vote > 0:
                query = (
                    'INSERT INTO vote (user_id, post_id, upvote, downvote) VALUES ( \"{}\",  \"{}\", true, false)'.format(
                        userID, postID))
                cur.execute(query)
                query = 'UPDATE post SET upvote = upvote+1 WHERE post_id = \"{}\"'.format(postID)
                cur.execute(query)
            else:
                query = (
                    'INSERT INTO vote (user_id, post_id, upvote, downvote) VALUES ( \"{}\",  \"{}\", false, true)'.format(
                        userID, postID))
                cur.execute(query)
                query = 'UPDATE post SET downvote = downvote+1 WHERE post_id = \"{}\"'.format(postID)
                cur.execute(query)
        conn.commit()


def convertResults(row):
    """converts database query results into a json"""
    try:
        date = (row[2]).strftime("%Y-%m-%d %H:%M")
    except AttributeError as err:
        logger.exception(err)
        date = "0000-00-00 00:00"
    post = {'post_id': row[0], 'user_id': row[1], 'post_date': date, 'post_content': row[3],
            'post_photo_location': row[4], 'establishment_id': row[5], 'post_rating': row[6],
            'post_subject': row[7], 'upvote': row[8], 'downvote': row[9]}
    return post


def searchPosts(searchCriteria, pageNumber):
    """retrieves posts which contain words from the search criteria in the post content or subject

    used code from geeks for geeks to remove duplicate search entries
    https://www.geeksforgeeks.org/python-removing-duplicate-dicts-in-list/
    """
    searchWords = re.findall(r'\w+', searchCriteria)
    duplicateResults = []
    for word in searchWords:
        if word not in commonWords and len(word) > 1:
            query = (
                'SELECT DISTINCT * FROM post WHERE post_content LIKE \"%{}%\" OR post_subject LIKE \"%{}%\" ORDER BY post_date DESC'.format(
                    word, word))
            with conn.cursor() as cur:
                cur.execute(query)
                thePosts = cur.fetchall()
                for row in thePosts:
                    post = convertResults(row)
                    duplicateResults.append(post)
            conn.commit()
    nonDuplicateResults = [i for n, i in enumerate(duplicateResults) if i not in duplicateResults[n + 1:]]
    return nonDuplicateResults[(sizeOfPage * pageNumber):((sizeOfPage + sizeOfPage * pageNumber) - 1)]


def validateUser(postId):
    """retrieves userId for a particular postId, to be used in front end validation"""
    query = ('SELECT post_user FROM post WHERE post_id =\"{}\"'.format(postId))
    with conn.cursor() as cur:
        cur.execute(query)
        theUserId = cur.fetchone()
    conn.commit()
    return {"user_id": theUserId[0]}