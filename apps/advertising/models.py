from django.db import models

class Advertisement(models.Model):
  company_name = models.CharField(max_length=300)
  copy = models.TextField(max_length=3000)
  logo = models.ImageField()
  url = models.URLField()

  def __str__(self):
    return '{}'.format(self.company_name)