from django.contrib import admin
from apps.users.models.student import Student
from apps.users.models.instructor import Instructor

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ("username", "first_name", "last_name", "enrollment_date",)
    exclude = ("password","last_login","groups", "is_superuser", "is_staff", "is_active", "date_joined","user_permissions")
    readonly_fields = ("username","role")

@admin.register(Instructor)
class InstructorAdmin(admin.ModelAdmin):
    list_display = ("username", "first_name", "last_name", "title")
    exclude = ("password","last_login","is_superuser", "is_staff", "is_active", "date_joined","user_permissions","groups")
    readonly_fields = ("username","role")

