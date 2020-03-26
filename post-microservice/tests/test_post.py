import unittest
from posts.query_generation import generatePostSQLQuery
from posts.query_generation import generateDeletePostSQLQuery
from posts.query_generation import generateGetPostSQLQuery


class testDynamoDBTranslationToMySQL(unittest.TestCase):

    def testPostCreatedWithNullPhoto(self):
        postCreatedEvent = {'event id': {'S': 'testEventId'}, 'data': {'M': {'post_content': {'S': 'testPostContent'}, 'post_id': {'S': 'testPostID'}, 'user_id': {'S': 'testUser'}, 'post_subject': {'S': 'testSubject'}, 'post_photo_location': {'NULL': True}, 'establishment_id': {'S': 'testEstablishmentID'}, 'post_rating': {'N': '5'}}}, 'type': {'S': 'PostCreatedEvent'}, 'timestamp': {'S': 'testTimeStamp'}}
        actual = generatePostSQLQuery(postCreatedEvent)
        expected = 'INSERT INTO post (post_id, post_user, post_date, post_rating, post_subject, post_content, establishment_id) values("testPostID", "testUser", "testTimeStamp", 5, "testSubject", "testPostContent","testEstablishmentID")'
        self.assertEqual(expected, actual)

    def testPostCreatedWithPhoto(self):
        postCreatedEvent = {'event id': {'S': 'testEventId2'}, 'data': {'M': {'post_content': {'S': 'testPostContent'}, 'post_id': {'S': 'testPostID'}, 'user_id': {'S': 'testUser'}, 'post_subject': {'S': 'testSubject'}, 'post_photo_location': {'S': 'IAMNOTNULL'}, 'establishment_id': {'S': 'testEstablishmentID'}, 'post_rating': {'N': '5'}}}, 'type': {'S': 'PostCreatedEvent'}, 'timestamp': {'S': 'testTimeStamp'}}
        actual = generatePostSQLQuery(postCreatedEvent)
        expected = 'INSERT INTO post (post_id, post_user, post_date, post_rating, post_subject, post_content, establishment_id, post_photo_location) values("testPostID", "testUser", "testTimeStamp", 5, "testSubject", "testPostContent","testEstablishmentID", "IAMNOTNULL")'
        self.assertEqual(expected, actual)

    def testPostDeleted(self):
        postDeletedEvent = {'event id': {'S': 'testEventId2'}, 'data': {'M': {'post_content': {'NULL': True}, 'post_id': {'S': 'testPostID'}, 'user_id': {'S': 'testUser'}, 'post_subject': {'S': 'testSubject'}, 'post_photo_location': {'NULL': True}, 'establishment_id': {'S': 'testEstablishmentID'}, 'post_rating': {'NULL': True}}}, 'type': {'S': 'PostDeletedEvent'}, 'timestamp': {'S': 'testTimeStamp'}}
        actual = generateDeletePostSQLQuery(postDeletedEvent)
        expected = 'UPDATE post SET post_content = "[deleted]", post_photo_location = NULL WHERE post_id = testPostID'
        self.assertEqual(expected, actual)

    def testGetRecent(self):
        getRecent = {'resource': '/posts', 'path': '/posts', 'httpMethod': 'GET', 'queryStringParameters': {'page': '0'}, 'multiValueQueryStringParameters': {'page': ['0']}, 'pathParameters': None, 'stageVariables': None, 'requestContext': {'resourceId': 'pr8qvx', 'resourcePath': '/posts', 'httpMethod': 'GET', 'extendedRequestId': 'JB-orE4kvHcFSdQ=', 'requestTime': '07/Mar/2020:17:47:35 +0000', 'path': '/alpha/posts'}, 'body': None, 'isBase64Encoded': False}
        actual = generateGetPostSQLQuery(getRecent)
        expected = 'SELECT * FROM post ORDER BY post_date DESC LIMIT 10 OFFSET 0'
        self.assertEqual(expected, actual)

if __name__ == '__main__':
    unittest.main()