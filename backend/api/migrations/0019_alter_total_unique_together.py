# Generated by Django 5.1.6 on 2025-04-10 21:18

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0018_remove_total_total_bonuses'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='total',
            unique_together={('start_date', 'end_date', 'employee')},
        ),
    ]
