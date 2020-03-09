import sys
import logging
import rds_config
import pymysql
import json


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
    cur.execute("CREATE TABLE testcomment ( comment_id  varchar(36) NOT NULL, parent_id varchar(36) NOT NULL, "
                " user_id varchar(36) NOT NULL,comment_date varchar(50), content varchar(5000) NOT NULL, "
                "PRIMARY KEY (comment_id))")
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
    if 'Records' in event:
        record = event['Records'][0]['dynamodb']['NewImage']
        if record['type']['S'] == "CommentCreatedEvent":
            addComment(record)
        elif record['type']['S'] == "CommentUpdatedEvent":
            print("Complete me!")
        elif record['type']['S'] == "CommentDeletedEvent":
            print("Complete me!")
        return None
    else:
        if event['httpMethod'] == "GET":
            return respond(None, getComment(event))


def addComment(commentCreatedEvent):
    query = generateCommentSQLQuery(commentCreatedEvent)
    with conn.cursor() as cur:
        cur.execute(query)
        conn.commit()

def getComment(getCommentEvent):
    print("complete get comment event")

def generateCommentSQLQuery(newRecord):
    commentID = newRecord['data']['M']['comment_id']['S']
    parentID = newRecord['data']['M']['parent_id']['S']
    userID = newRecord['data']['M']['user_id']['S']
    commentDate = newRecord['timestamp']['S']
    content = newRecord['data']['M']['content']['S']
    INSERT_STATEMENT = ("INSERT INTO testcomment (comment_id, user_id, parent_id, content, comment_date) VALUES  "
                        "(\"{}\",\"{}\",\"{}\",\"{}\", \"{}\")".format(commentID, userID, parentID, content, commentDate))
    print(INSERT_STATEMENT)
    return(INSERT_STATEMENT)