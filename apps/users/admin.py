from django.contrib import admin
from apps.users.models.student import Student
from apps.users.models.instructor import Instructor

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ("username", "first_name", "last_name", "enrollment_date","grade", "department")
    exclude = ("password","last_login","groups", "is_superuser", "is_staff", "is_active", "date_joined","user_permissions","section","deleted_at","is_deleted","courses")
    readonly_fields = ("username","role")

@admin.register(Instructor)
class InstructorAdmin(admin.ModelAdmin):
    list_display = ("username", "first_name", "last_name", "title", "department")
    exclude = ("password","last_login","is_superuser", "is_staff", "is_active", "date_joined","user_permissions","groups","is_deleted","deleted_at")
    readonly_fields = ("username","role")

