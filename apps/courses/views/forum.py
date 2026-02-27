from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.courses.models.forum import Answer, Question
from apps.courses.permission import IsTeacherOrQuestionAuthor
from apps.users.serializers.forum import AnswerSerializer, QuestionSerializer


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