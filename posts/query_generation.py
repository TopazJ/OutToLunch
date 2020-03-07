


def generatePostSQLQuery(newRecord):
    postId = newRecord['data']['M']['post_id']['S']
    postUser = newRecord['data']['M']['user_id']['S']
    postDate = newRecord['timestamp']['S']
    postRating = newRecord['data']['M']['post_rating']['N']
    postSubject = newRecord['data']['M']['post_subject']['S']
    postContent = newRecord['data']['M']['post_content']['S']
    postEstablishment = newRecord['data']['M']['establishment_id']['S']
    if newRecord['data']['M']['post_photo_location'] == {'NULL': True}:
        query = ("INSERT INTO post (post_id, post_user, post_date, post_rating, post_subject, post_content,"
                 " establishment_id) values(\"{}\", \"{}\", \"{}\", {}, \"{}\", \"{}\",\"{}\")"
                 .format(postId, postUser, postDate, postRating, postSubject, postContent, postEstablishment))
    else:
        postPhotoLocation = newRecord['data']['M']['post_photo_location']['S']
        query = ("INSERT INTO post (post_id, post_user, post_date, post_rating, post_subject, post_content,"
                 " establishment_id, post_photo_location) values(\"{}\", \"{}\", \"{}\", {}, \"{}\", \"{}\",\"{}\","
                 " \"{}\")".format(postId, postUser, postDate, postRating, postSubject, postContent, postEstablishment,
                                   postPhotoLocation))
    return query

def generatePostUpdatedSQLQuery(rewRecord):
    print("Complete me!")

def generateDeletePostSQLQuery(newRecord):
    query = ('UPDATE post SET post_content = "[deleted]", post_photo_location = NULL WHERE post_id = {}'
             .format(newRecord['data']['M']['post_id']['S']))
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
