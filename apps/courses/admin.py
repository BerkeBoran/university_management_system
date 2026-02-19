from django.contrib import admin
from apps.courses.models.course import Course

@admin.register(Course)
class CoursesAdmin(admin.ModelAdmin):
    list_display = ("ects","capacity","instructor","credit","course_name","course_id","course_detail")