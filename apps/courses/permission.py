from rest_framework import permissions

from apps.courses.models.forum import Question


class IsTeacherOrQuestionAuthor(permissions.BasePermission):
    def hasattr_instructor(self, user):
        return hasattr(user, 'instructor')

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        is_question_author = obj.question_author == request.user

        is_course_teacher = False

        if self.hasattr_instructor(request.user):
            is_course_teacher = obj.question.course.instructor == request.user

        return is_course_teacher or is_question_author


