from pynamodb.models import Model
from pynamodb.attributes import UnicodeAttribute, JSONAttribute, UTCDateTimeAttribute, NumberAttribute
from OutToLunch.config import DynamoDBAccessKey, DynamoDBKeyID


class Event (Model):
    class Meta:
        table_name = 'OutToLunchEvents'
        region = 'us-west-2'
        aws_access_key_id = DynamoDBKeyID
        aws_secret_access_key = DynamoDBAccessKey
    event_id = UnicodeAttribute(hash_key=True)
    type = UnicodeAttribute()
    timestamp = UTCDateTimeAttribute()
    content = JSONAttribute()
