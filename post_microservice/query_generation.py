#variables
sizeOfPage = 10

#Assumption that initial post will have zero upvotes and zero downvotes so no need to insert into table
def generatePostSQLQuery(newRecord):
    """creates string query from PostCreatedEvent to insert Post"""
    if newRecord['data']['post_photo_location'] is None:
         query = ("INSERT INTO post (post_id, post_user, post_date, post_rating, post_subject, post_content,"
                 " establishment_id) values(\"{}\", \"{}\", \"{}\", {}, \"{}\", \"{}\",\"{}\")"
                 .format(newRecord["data"]["post_id"], newRecord["data"]["post_user"], newRecord["timestamp"], newRecord["data"]["post_rating"], newRecord["data"]["post_subject"], newRecord["data"]["post_content"], newRecord["data"]["establishment_id"]))
    else:
         query = ("INSERT INTO post (post_id, post_user, post_date, post_rating, post_subject, post_content, post_photo_location,"
                 " establishment_id) values(\"{}\", \"{}\", \"{}\", {}, \"{}\", \"{}\",\"{}\", \"{}\")"
                 .format(newRecord["data"]["post_id"], newRecord["data"]["post_user"], newRecord["timestamp"], newRecord["data"]["post_rating"], newRecord["data"]["post_subject"], newRecord["data"]["post_content"], newRecord["data"]["post_photo_location"], newRecord["data"]["establishment_id"]))

    return query

def generateDeletePostSQLQuery(newRecord):
    """generates a delete query that sets values to [deleted], zero or null but leaves subject untouched"""
    query = ('UPDATE post SET post_content = "[deleted]", post_user = "00000000000000000000000000000000", post_photo_location = NULL, post_rating = 0, upvote = 0, downvote = 0 WHERE post_id = \"{}\"'
             .format(newRecord['data']['post_id']))
    return query

def generateGetPostSQLQuery(getRequestEvent, pageNumber):
    """generates the select query to retrieve post requests based on the GET path and query parameters"""
    path = getRequestEvent['path']
    if 'user' in path:
        theUserId = getRequestEvent['queryStringParameters']['post_user']
        query = ('SELECT * FROM post WHERE post_user = \"{}\" ORDER BY post_date DESC LIMIT {} OFFSET {}'
                 .format(theUserId, sizeOfPage, (pageNumber*sizeOfPage)))
    elif 'establishment' in path:
        theEstablishmentId = getRequestEvent['queryStringParameters']['establishment_id']
        query = ('SELECT * FROM post WHERE establishment_id = \"{}\" ORDER BY post_date DESC LIMIT {} OFFSET {}'
                 .format(theEstablishmentId, sizeOfPage, (pageNumber*sizeOfPage)))
    elif len(path) > len("/posts/"):
        thePostId = path.replace('/posts/', '')
        query = 'SELECT * FROM post WHERE post_id = \"{}\"'.format(thePostId)
    else:
        query = 'SELECT * FROM post ORDER BY post_date DESC LIMIT {} OFFSET {}'.format(sizeOfPage, (pageNumber*sizeOfPage))
    return query
