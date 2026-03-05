from django.contrib import admin
from apps.courses.models.course import Course
from apps.courses.models.enrollment import Enrollment
from apps.courses.models.section import Section,Semester, Classroom, CourseTime, Grade, Department


@admin.register(Classroom)
class ClassroomAdmin(admin.ModelAdmin):
    list_display = ("classroom_name", "classroom_capacity")

@admin.register(CourseTime)
class CourseTimeAdmin(admin.ModelAdmin):
    list_display = ("course_start_time","course_end_time","course_days")

@admin.register(Grade)
class GradeAdmin(admin.ModelAdmin):
    list_display = ("grade",)


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ("department",)

@admin.register(Semester)
class SemesterAdmin(admin.ModelAdmin):
    list_display = ("semester","is_active")

@admin.register(Course)
class CoursesAdmin(admin.ModelAdmin):
    list_display = ("ects","credit","course_name","course_id","course_detail",)

@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ("student","section","midterm_grade","final_grade")

@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):
    list_display = ("course","semester","classroom","instructor","capacity","course_time")