# Generated by Django 5.1.6 on 2025-02-20 06:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_alter_administrator_salary_report_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='vehicle',
            name='plate_number',
            field=models.CharField(blank=True, max_length=10, null=True, unique=True),
        ),
    ]
