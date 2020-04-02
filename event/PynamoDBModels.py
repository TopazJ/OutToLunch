from pynamodb.models import Model
from pynamodb.attributes import UnicodeAttribute, MapAttribute, UTCDateTimeAttribute, NumberAttribute, BooleanAttribute
from OutToLunch.settings import DynamoAccess, DynamoKeyID

PostCreatedEvent = 'PostCreatedEvent'
PostUpdatedEvent = 'PostUpdatedEvent'
PostVoteEvent = 'PostVoteEvent'
PostDeletedEvent = 'PostDeletedEvent'
AccountCreatedEvent = 'AccountCreatedEvent'
AccountUpdatedEvent = 'AccountUpdatedEvent'
AccountDeletedEvent = 'AccountDeletedEvent'
CommentCreatedEvent = 'CommentCreatedEvent'
CommentUpdatedEvent = 'CommentUpdatedEvent'
CommentDeletesEvent = 'CommentDeleteEvent'


class Post(MapAttribute):
    post_id = UnicodeAttribute(null=False)
    post_user = UnicodeAttribute(null=False)
    establishment_id = UnicodeAttribute(null=False)
    post_rating = NumberAttribute(null=True)
    post_subject = UnicodeAttribute(null=True)
    post_content = UnicodeAttribute(null=True)
    post_photo_location = UnicodeAttribute(null=True)
    post_date = UnicodeAttribute(null=True)


class PostVote(MapAttribute):
    user_id = UnicodeAttribute(null=False)
    post_user = UnicodeAttribute(null=False)
    vote = UnicodeAttribute(null=False)


class CreateComment(MapAttribute):
    commentID = UnicodeAttribute()
    userID = UnicodeAttribute()
    parentID = UnicodeAttribute()
    content = UnicodeAttribute()
    dateMs = NumberAttribute()


class UpdateComment(MapAttribute):
    commentID = UnicodeAttribute()
    userID = UnicodeAttribute()
    content = UnicodeAttribute()
    numChildren = NumberAttribute()


class WipeComment(MapAttribute):
    commentID = UnicodeAttribute()
    userID = UnicodeAttribute()
    content = UnicodeAttribute()


class Event(Model):
    class Meta:
        table_name = 'OutToLunchEvents'
        region = 'us-west-2'
        aws_access_key_id = DynamoKeyID
        aws_secret_access_key = DynamoAccess

    event_id = UnicodeAttribute(hash_key=True)
    type = UnicodeAttribute()
    timestamp = UTCDateTimeAttribute()
    data = MapAttribute()
