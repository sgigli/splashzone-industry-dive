# Generated by Django 3.1.6 on 2021-08-01 20:37

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('advertising', '0001_initial'),
        ('news', '0002_newspost_active'),
    ]

    operations = [
        migrations.AddField(
            model_name='newspost',
            name='advertisement',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='advertising.advertisement'),
        ),
    ]