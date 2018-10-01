# Generated by Django 2.0.1 on 2018-04-09 16:09

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('images', '0009_auto_20180409_1806'),
    ]

    operations = [
        migrations.AddField(
            model_name='image',
            name='image_group',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='image', to='images.ImageGroup'),
        ),
    ]
