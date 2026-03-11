from rest_framework import viewsets, status, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action

from apps.courses.models.forum import Answer, Question
from apps.courses.permission import IsTeacherOrQuestionAuthor, IsTeacherOrAnswerAuthorOrQuestionAuthor,AnswerIsTeacherOrQuestionAuthor
from apps.users.serializers.forum import AnswerSerializer, QuestionSerializer
from apps.courses.models import Course
from apps.users.serializers import CourseSerializer


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated]

    def destroy(self, request,*args,**kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status = status.HTTP_204_NO_CONTENT)

    def get_queryset(self):
        queryset = Question.objects.filter(is_deleted = False)
        course_id = self.request.query_params.get('course_id')
        if course_id:
            return queryset.filter(course_id = course_id)
        return queryset

    def get_permissions(self):
        if self.action in ['update', 'partial_update','destroy']:
            return [IsTeacherOrQuestionAuthor()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(author = self.request.user)



class AnswerViewSet(viewsets.ModelViewSet):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer
    permission_classes = [IsAuthenticated]

    def destroy(self,request,*args,**kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status = status.HTTP_204_NO_CONTENT)

    def get_queryset(self):
        queryset = Answer.objects.filter(is_deleted = False)

        if self.action == 'list':
            question_id = self.request.query_params.get('question_id')
            if question_id:
                return queryset.filter(question_id = question_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(author = self.request.user)

    def get_permissions(self):
        if self.action in ['update', 'partial_update','destroy']:
            return [IsTeacherOrAnswerAuthorOrQuestionAuthor()]
        if self.action == 'accept':
            return [AnswerIsTeacherOrQuestionAuthor()]
        return [IsAuthenticated()]



    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def accept(self, request, pk=None):
        answer = self.get_object()
        question = answer.question


        Answer.objects.filter(question=answer.question).update(is_accepted=False)
        answer.is_accepted = True
        answer.save()

        question.is_resolved = True
        question.save()
        return Response({"Cevap Kabul edildi"}, status=status.HTTP_200_OK)

class ForumCourseListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
