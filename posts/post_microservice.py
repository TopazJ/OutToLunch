import sys
import logging
import rds_config
import pymysql
import json
from query_generation import *
# import boto3
from boto3.dynamodb.types import TypeDeserializer
import uuid
from datetime import datetime

# rds settings

rds_host = rds_config.db_host
name = rds_config.db_username
password = rds_config.db_password
db_name = rds_config.db_name

logger = logging.getLogger()
logger.setLevel(logging.INFO)
try:
    conn = pymysql.connect(rds_host, user=name, passwd=password, db=db_name, connect_timeout=5)
except pymysql.MySQLError as e:
    logger.error("Error: unexpected error: could not connect to MySQL instance.")
    logger.error(e)
    sys.exit()

# only need to create table
'''
with conn.cursor() as cur:
    cur.execute("CREATE TABLE post ( post_id  varchar(36) NOT NULL, post_user varchar(36) NOT NULL, post_date "
                "TIMESTAMP, post_content varchar(5000) NOT NULL, post_photo_location varchar(500),"
                " establishment_id varchar(36) NOT NULL, post_rating INT, post_subject varchar(500),"
                " PRIMARY KEY (post_id))")
'''
logger.info("SUCCESS: Connection to RDS MySQL instance succeeded")


def respond(err, res=None):
    return {
        'statusCode': '400' if err else '200',
        'body': err.message if err else json.dumps(res),
        'headers': {
            'Content-Type': 'application/json',
        },
    }


logger.setLevel(logging.WARNING)


def handler(event, context):
    response = None
    try:
        if 'Records' in event:
            record = testSerializer(event['Records'][0]['dynamodb']['NewImage'])
            if record['type'] == "PostCreatedEvent":
                addPost(record)
            elif record['type'] == "PostUpdatedEvent":
                print("complete me")
                updatePost(record)
            elif record['type'] == "PostDeletedEvent":
                deletePost(record)
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
    deserializer = TypeDeserializer()
    if isinstance(data, list):
        return [deserialize(v) for v in data]
    if isinstance(data, dict):
        try:
            return deserializer.deserialize(data)
        except TypeError:
            return {k: deserializer.deserialize(v) for k, v in data.items()}
    else:
        return data


def getPost(getRequestEvent):
    query = generateGetPostSQLQuery(getRequestEvent)
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
    query = generatePostSQLQuery(postCreatedEvent)
    with conn.cursor() as cur:
        cur.execute(query)
        conn.commit()


def deletePost(deletePostEvent):
    query = generateDeletePostSQLQuery(deletePostEvent)
    with conn.cursor() as cur:
        cur.execute(query)
        conn.commit()


def updatePost(updatePostEvent):
    postId = updatePostEvent["data"]["post_id"]
    with conn.cursor() as cur:
        for key, value in updatePostEvent["data"].items():
            if key != "post_id":
                query = 'UPDATE post SET {} = \"{}\" WHERE post_id = \"{}\"'.format(key, value, postId)
                cur.execute(query)
                conn.commit()


def convertResults(row):
    date = (row[2]).strftime("%Y-%m-%d %H:%M")
    post = {'post_id': row[0], 'user_id': row[1], 'post_date': date, 'post_content': row[3],
            'post_photo_location': row[4], 'establishment_id': row[5]}
    return post

