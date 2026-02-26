from django.db import models
from django.conf import settings
from apps.courses.models import Course


class Question(models.Model):
    question_title = models.CharField(max_length=200)
    question_text = models.TextField()

    course = models.ForeignKey(Course, on_delete=models.CASCADE,related_name="questions")
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,related_name="questions")

    is_resolved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    view_count = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['-created_at']
    def __str__(self):
        return f"{self.question_title}: {self.author.full_name}"



class Answer(models.Model):
    answer_text = models.TextField()

    question = models.ForeignKey(Question, on_delete=models.CASCADE,related_name="answers")
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,related_name="answers")

    upvotes=models.PositiveIntegerField(default=0)
    is_accepted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        ordering = ['-is_accepted','-upvotes','-created_at']

    def __str__(self):
        return f"{self.answer_text}: {self.author.full_name}"