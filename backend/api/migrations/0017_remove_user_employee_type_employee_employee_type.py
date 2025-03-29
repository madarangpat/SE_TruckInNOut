# Generated by Django 5.1.6 on 2025-03-28 19:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0016_remove_employee_employee_type_user_employee_type_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='employee_type',
        ),
        migrations.AddField(
            model_name='employee',
            name='employee_type',
            field=models.CharField(blank=True, choices=[('Driver', 'Driver'), ('Helper', 'Helper'), ('Staff', 'Staff')], max_length=50, null=True),
        ),
    ]
