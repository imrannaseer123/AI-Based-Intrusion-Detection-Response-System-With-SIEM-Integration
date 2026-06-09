from django.db import models

class Log(models.Model):
    user = models.CharField(max_length=255, default='system')
    activity = models.CharField(max_length=1000)
    timestamp = models.DateTimeField(auto_now_add=True)
    severity = models.CharField(max_length=50, default='info')
    
    def __str__(self):
        return f"{self.timestamp} - {self.user}: {self.activity}"

class Alert(models.Model):
    alert_type = models.CharField(max_length=255)
    risk_level = models.CharField(max_length=50) # Low, Medium, High, Critical
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"[{self.risk_level}] {self.alert_type} at {self.timestamp}"
