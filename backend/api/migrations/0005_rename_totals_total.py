# Generated by Django 5.1.6 on 2025-04-06 06:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_employee_payment_status'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Totals',
            new_name='Total',
        ),
    ]
