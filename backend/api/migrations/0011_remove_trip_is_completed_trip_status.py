# Generated by Django 5.1.6 on 2025-03-26 15:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0010_trip_assignment_status'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='trip',
            name='is_completed',
        ),
        migrations.AddField(
            model_name='trip',
            name='status',
            field=models.CharField(choices=[('completed', 'Completed'), ('ongoing', 'Ongoing')], default='ongoing', max_length=20),
        ),
    ]
