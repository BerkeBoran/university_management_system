from django.contrib import admin
from apps.courses.models.course import Course, Grade, Department, Semester

@admin.register(Grade)
class GradeAdmin(admin.ModelAdmin):
    list_display = ("grade",)


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ("department",)

@admin.register(Semester)
class SemesterAdmin(admin.ModelAdmin):
    list_display = ("semester",)

@admin.register(Course)
class CoursesAdmin(admin.ModelAdmin):
    list_display = ("ects","capacity","instructor","credit","course_name","course_id","course_detail","department","grade","semester")