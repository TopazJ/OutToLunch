


def generatePostSQLQuery(newRecord):
    print(newRecord)
    if newRecord['data']['post_photo_location'] is None:
         query = ("INSERT INTO post (post_id, post_user, post_date, post_rating, post_subject, post_content,"
                 " establishment_id) values(\"{}\", \"{}\", \"{}\", {}, \"{}\", \"{}\",\"{}\")"
                 .format(newRecord["data"]["post_id"], newRecord["data"]["user_id"], newRecord["timestamp"], newRecord["data"]["post_rating"], newRecord["data"]["post_subject"], newRecord["data"]["post_content"], newRecord["data"]["establishment_id"]))
    else:
         query = ("INSERT INTO post (post_id, post_user, post_date, post_rating, post_subject, post_content, post_photo_location"
                 " establishment_id) values(\"{}\", \"{}\", \"{}\", {}, \"{}\", \"{}\",\"{}\")"
                 .format(newRecord["data"]["post_id"], newRecord["data"]["user_id"], newRecord["timestamp"], newRecord["data"]["post_rating"], newRecord["data"]["post_subject"], newRecord["data"]["post_content"], newRecord["data"]["post_photo_location"], newRecord["data"]["establishment_id"]))

    return query


def generatePostUpdatedSQLQuery(rewRecord):
    print("Complete me!")

def generateDeletePostSQLQuery(newRecord):
    query = ('UPDATE post SET post_content = "[deleted]", post_photo_location = NULL WHERE post_id = {}'
             .format(newRecord['data']['post_id']))
    return query

def generateGetPostSQLQuery(getRequestEvent):
    path = getRequestEvent['path']
    pageNumber = int(getRequestEvent['queryStringParameters']['page'])
    if 'user' in path:
        theUserId = path.replace('/posts/user/', '')
        query = ('SELECT * FROM post WHERE post_user = \"{}\" ORDER BY post_date DESC LIMIT 10 OFFSET {}'
                 .format(theUserId, (pageNumber*10)))
    elif 'establishment' in path:
        theEstablishmentId = path.replace('/posts/establishment/', '')
        query = ('SELECT * FROM post WHERE establishment_id = \"{}\" ORDER BY post_date DESC LIMIT 10 OFFSET {}'
                 .format(theEstablishmentId, (pageNumber*10)))
    else:
        query = 'SELECT * FROM post ORDER BY post_date DESC LIMIT 10 OFFSET {}'.format((pageNumber*10))
    return query
