# Generated by Django 5.1.6 on 2025-03-27 12:26

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_trip_multiplier'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='employee',
            name='salary_configuration',
        ),
    ]
