# Generated by Django 5.1.6 on 2025-04-10 05:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_alter_trip_trip_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='trip',
            name='trip_origin',
            field=models.CharField(blank=True, max_length=150, null=True),
        ),
    ]
