from pynamodb.models import Model
from pynamodb.attributes import UnicodeAttribute, MapAttribute, UTCDateTimeAttribute, NumberAttribute
from OutToLunch.config import DynamoDBAccessKey, DynamoDBKeyID


class Establishment(MapAttribute):
    establishment_id = UnicodeAttribute()
    post_content = UnicodeAttribute()
    post_id = UnicodeAttribute()
    post_photo_location = UnicodeAttribute()
    post_rating = NumberAttribute()
    post_subject = UnicodeAttribute()
    user_id = UnicodeAttribute()


class Event (Model):
    class Meta:
        table_name = 'OutToLunchEvents'
        region = 'us-west-2'
        aws_access_key_id = DynamoDBKeyID
        aws_secret_access_key = DynamoDBAccessKey
    event_id = UnicodeAttribute(hash_key=True)
    type = UnicodeAttribute()
    timestamp = UTCDateTimeAttribute()
    data = Establishment()