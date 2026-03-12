from rest_framework import permissions

from apps.courses.models.forum import Question


class IsTeacherOrQuestionAuthor(permissions.BasePermission):
    def hasattr_instructor(self, user):
        return hasattr(user, 'instructor')

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        is_question_author = obj.author == request.user

        is_course_teacher = False

        if self.hasattr_instructor(request.user):
            is_course_teacher = obj.course.sections.filter(instructor=request.user).exists()

        return is_course_teacher or is_question_author

class AnswerIsTeacherOrQuestionAuthor(permissions.BasePermission):
    def hasattr_instructor(self, user):
        return hasattr(user, 'instructor')

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        is_question_author = obj.question.author == request.user

        is_course_teacher = False

        if self.hasattr_instructor(request.user):
            is_course_teacher = obj.question.course.sections.filter(instructor=request.user).exists()

        return is_course_teacher or is_question_author

class IsTeacherOrAnswerAuthorOrQuestionAuthor(permissions.BasePermission):
        def has_object_permission(self, request, view, obj):
            if request.method in permissions.SAFE_METHODS:
                return True

            is_question_author = obj.question.author == request.user
            is_answer_author = obj.author == request.user
            user_role = str(getattr(request.user, 'user_role', '')).lower()
            if user_role == 'instructor':
                return True

            return  is_question_author or is_answer_author


class IsTeacher(permissions.BasePermission):
    def has_permission(self, request,view):
        return hasattr(request.user, 'instructor')

class IsStudent(permissions.BasePermission):
    def has_permission(self, request, view,):
        return hasattr(request.user, 'student')
