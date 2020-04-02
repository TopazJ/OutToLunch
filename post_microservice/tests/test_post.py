import unittest
from post_microservice.query_generation import generatePostSQLQuery
from post_microservice.query_generation import generateDeletePostSQLQuery
from post_microservice.query_generation import generateGetPostSQLQuery


class testDynamoDBTranslationToMySQL(unittest.TestCase):

    def testPostCreatedWithNullPhoto(self):
        """tests to see if the sql query for inserting posts is generated correctly when post_photo_location is null"""
        postCreatedEvent = {'event id': 'testEventId', 'data': {'post_content': 'testPostContent', 'post_id': 'testPostID', 'user_id': 'testUser', 'post_subject': 'testSubject', 'post_photo_location': None, 'establishment_id': 'testEstablishmentID', 'post_rating': '5'}, 'type': 'PostCreatedEvent', 'timestamp': 'testTimeStamp'}
        actual = generatePostSQLQuery(postCreatedEvent)
        expected = 'INSERT INTO post (post_id, post_user, post_date, post_rating, post_subject, post_content, establishment_id) values("testPostID", "testUser", "testTimeStamp", 5, "testSubject", "testPostContent","testEstablishmentID")'
        self.assertEqual(expected, actual)

    def testPostCreatedWithPhoto(self):
        """test to see if the sql uery for inserting posts is generated correctly when post_photo_location is not null"""
        postCreatedEvent = {'event id': 'testEventId2', 'data': {'post_content': 'testPostContent', 'post_id': 'testPostID', 'user_id': 'testUser', 'post_subject': 'testSubject', 'post_photo_location': 'IAMNOTNULL', 'establishment_id': 'testEstablishmentID', 'post_rating': '5'}, 'type': 'PostCreatedEvent', 'timestamp': 'testTimeStamp'}
        actual = generatePostSQLQuery(postCreatedEvent)
        expected = 'INSERT INTO post (post_id, post_user, post_date, post_rating, post_subject, post_content, post_photo_location, establishment_id) values("testPostID", "testUser", "testTimeStamp", 5, "testSubject", "testPostContent","IAMNOTNULL", "testEstablishmentID")'
        self.assertEqual(expected, actual)

    def testPostDeleted(self):
        """test to see if query for deleting posts generates the correct update sql query"""
        postDeletedEvent = {'event id': 'testEventId2', 'data': {'post_content': None, 'post_id': 'testPostID', 'user_id': 'testUser', 'post_subject': 'testSubject', 'post_photo_location': None, 'establishment_id': 'testEstablishmentID', 'post_rating': None}, 'type': 'PostDeletedEvent', 'timestamp': 'testTimeStamp'}
        actual = generateDeletePostSQLQuery(postDeletedEvent)
        expected = 'UPDATE post SET post_content = "[deleted]", post_photo_location = NULL, upvote = 0, downvote = 0 WHERE post_id = "testPostID"'
        self.assertEqual(expected, actual)

    def testGetRecent(self):
        """test if the get request with base path /posts generates the correct sql query"""
        getRecent = {'resource': '/posts', 'path': '/posts', 'httpMethod': 'GET', 'queryStringParameters': {'page': '0'}, 'multiValueQueryStringParameters': {'page': ['0']}, 'pathParameters': None, 'stageVariables': None, 'requestContext': {'resourceId': 'pr8qvx', 'resourcePath': '/posts', 'httpMethod': 'GET', 'extendedRequestId': 'JB-orE4kvHcFSdQ=', 'requestTime': '07/Mar/2020:17:47:35 +0000', 'path': '/alpha/posts'}, 'body': None, 'isBase64Encoded': False}
        actual = generateGetPostSQLQuery(getRecent, 0)
        expected = 'SELECT * FROM post ORDER BY post_date DESC LIMIT 10 OFFSET 0'
        self.assertEqual(expected, actual)

if __name__ == '__main__':
    unittest.main()