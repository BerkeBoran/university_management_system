from django.utils import timezone
from django.db import models
from django.conf import settings
from apps.courses.models import Course
from apps.users.models import User


class Question(models.Model):
    question_title = models.CharField(max_length=200)
    question_text = models.TextField()

    course = models.ForeignKey(Course, on_delete=models.CASCADE,related_name="questions")
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,related_name="questions")

    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)
    is_resolved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    view_count = models.PositiveIntegerField(default=0)

    def delete(self):
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save()

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        author_name = f"{self.author.first_name} {self.author.last_name}"
        return f"{self.question_title}: {author_name}"



class Answer(models.Model):
    answer_text = models.TextField()

    question = models.ForeignKey(Question, on_delete=models.CASCADE,related_name="answers")
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,related_name="answers")

    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)
    upvotes=models.PositiveIntegerField(default=0)
    is_accepted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    liked_by = models.ManyToManyField(User, related_name='liked_answers',blank=True)

    @property
    def upvotes_count(self):
        return self.liked_by.count()

    def delete(self):
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save()

    class Meta:
        ordering = ['-is_accepted','-upvotes','-created_at']

    def __str__(self):
        author_name = f"{self.author.first_name} {self.author.last_name}"
        return f"{self.answer_text}: {author_name}"