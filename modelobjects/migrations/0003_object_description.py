# Generated by Django 5.1.2 on 2024-10-18 04:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('modelobjects', '0002_rename_type_object_object_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='object',
            name='description',
            field=models.CharField(default='no_data', max_length=200),
        ),
    ]
