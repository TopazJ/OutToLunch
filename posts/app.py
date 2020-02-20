import sys
import logging
import rds_config
import pymysql
import json
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
    cur.execute("CREATE TABLE post ( post_id  varchar(36) NOT NULL, post_user varchar(36) NOT NULL, post_date TIMESTAMP,"
                "post_content varchar(255) NOT NULL, post_photo_location varchar(255), PRIMARY KEY (post_id))")
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


def handler(event, context):
    operations = {
        'POST': addPost,
        'GET': getPost
    }

    operation = event['httpMethod']
    print(operation)
    if operation in operations:
        payload = event['path'] if operation == 'GET' else json.loads(event['body'])
        return respond(None, operations[operation](payload))


def addPost(postCreatedEvent):
    data = postCreatedEvent['data']
    newUUID = str(uuid.uuid4())
    with conn.cursor() as cur:
        #        query = 'INSERT INTO post (post_id, post_user, post_date, post_content, post_photo_location) values(UUID_TO_BIN(UUID()), "' + data['user_id'] + '", CURDATE(), "' + data['post_content'] + '", "' + data['post_photo_location']+ '")'
        if data['post_photo_location'] is None:
            query = 'INSERT INTO post (post_id, post_user, post_date, post_content) values("' + newUUID + '", "' + data[
                'user_id'] + '", NOW(), "' + data['post_content'] + '")'
        else:
            query = 'INSERT INTO post (post_id, post_user, post_date, post_content, post_photo_location) values("' + newUUID + '", "' + \
                    data['user_id'] + '", NOW(), "' + data['post_content'] + '", "' + data['post_photo_location'] + '")'
        cur.execute(query)
        conn.commit()
        query = 'SELECT * FROM post WHERE post_id = %s'
        cur.execute(query, newUUID)
        result = cur.fetchall()
        post = convertResults(result[0])
        conn.commit()
        return post


def getPost(something):
    if 'login' in something:
        query = 'SELECT * FROM post ORDER BY post_date DESC LIMIT 10'
        with conn.cursor() as cur:
            cur.execute(query)
            thePosts = cur.fetchall()
            list = []
            for row in thePosts:
                post = convertResults(row)
                list.append(post)
            conn.commit()
        return list

    else:
        print('what other types of gets might their be')


def convertResults(row):
    date = (row[2]).strftime("%d-%b-%Y %H:%M:%S.%f")
    post = {'post_id': row[0], 'user_id': row[1], 'post_date': date, 'post_content': row[3],
            'post_photo_location': row[4]}
    return post
