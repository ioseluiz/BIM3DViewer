from django.db import models

class Object(models.Model):
    number = models.PositiveIntegerField(unique=True)
    object_name = models.CharField(max_length=100)
    description = models.CharField(max_length=200, default="no_data")
    object_type = models.CharField(max_length=50)
    
    def __str__(self):
        return f"{self.object_name}"
