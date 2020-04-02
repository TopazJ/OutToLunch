# Generated by Django 3.0.3 on 2020-04-02 15:43

from django.db import migrations, models
import users.user_verification


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0009_auto_20200402_0930'),
    ]

    operations = [
        migrations.AlterField(
            model_name='confirmation',
            name='code',
            field=models.CharField(default=users.user_verification.generate_activation_key, editable=False, max_length=32, primary_key=True, serialize=False),
        ),
    ]