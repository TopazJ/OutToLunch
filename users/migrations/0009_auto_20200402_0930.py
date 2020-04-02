# Generated by Django 3.0.3 on 2020-04-02 15:30

from django.db import migrations, models
import users.user_verification


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0008_auto_20200402_0835'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='confirmation',
            name='id',
        ),
        migrations.AlterField(
            model_name='confirmation',
            name='code',
            field=models.CharField(default=users.user_verification.generate_activation_key, max_length=32, primary_key=True, serialize=False),
        ),
    ]