# Generated by Django 2.0.1 on 2018-05-22 14:07

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('videos', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='video',
            name='collection_tag',
        ),
        migrations.RemoveField(
            model_name='video',
            name='violation_tag',
        ),
        migrations.RemoveField(
            model_name='video',
            name='weapon_tag',
        ),
    ]