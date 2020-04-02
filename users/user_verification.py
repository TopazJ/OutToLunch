import uuid
from django.core.mail import send_mail


def generate_activation_key():
    key = uuid.uuid4().__str__().replace('-', '').upper()
    return key


def send_email(code, email):
    send_mail(
        'Out To Lunch Verification Code',
        "Your verification code is " + str(code) + "." +
        "\nCopy and paste this code into the confirmation box here: http://outtolunch.us-west-2.elasticbeanstalk.com/confirm/" +
        "\nThis is a no-reply address, please don't reply to this email.",
        'youraccesscodeishere@gmail.com',
        [email]
    )
