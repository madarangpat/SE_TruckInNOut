# Generated by Django 5.1.6 on 2025-04-10 14:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0014_employeelocation_timestamp'),
    ]

    operations = [
        migrations.AlterField(
            model_name='trip',
            name='trip_origin',
            field=models.JSONField(blank=True, null=True),
        ),
    ]
