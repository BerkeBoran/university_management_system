from django.contrib import admin
from .models.student import Student
from .models.instructor import Instructor

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ("username", "first_name", "last_name", "enrollment_date")
    readonly_fields = ("username",)

@admin.register(Instructor)
class InstructorAdmin(admin.ModelAdmin):
    list_display = ("username", "first_name", "last_name", "title")
    readonly_fields = ("username",)