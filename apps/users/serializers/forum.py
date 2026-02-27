from rest_framework import serializers
from apps.courses.models.forum import Answer,Question


class AnswerSerializer(serializers.ModelSerializer):
    author_name = serializers.ReadOnlyField(source='author.get_full_name')

    class Meta:
        model = Answer
        fields = ['id','question','created_at','updated_at','author_name','upvotes','author','is_accepted','answer_text',]
        read_only_fields = ['author_name','upvotes','is_accepted','author']


class QuestionSerializer(serializers.ModelSerializer):
    answer = AnswerSerializer(many=True, read_only=True)
    author_name = serializers.ReadOnlyField(source='author.get_full_name')

    class Meta:
        model = Question
        fields =  ['id','created_at','updated_at','question_title','author','author_name','course','is_resolved','question_text','answer']
        read_only_fields = ['author']

    def validate(self, attrs):
        if attrs.get('is_accepted'):
            question = self.instance.question if self.instance else attrs['question']
            Answer.objects.filter(question=question).update(is_accepted=False)
            question.is_resolved = True
            question.save()
        return attrs

