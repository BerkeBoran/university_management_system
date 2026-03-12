from rest_framework import serializers
from apps.courses.models.forum import Answer,Question


class AnswerSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    author_title = serializers.SerializerMethodField()
    upvotes_count = serializers.SerializerMethodField()


    class Meta:
        model = Answer
        fields = ['id','question','created_at','updated_at','author_name','author_title','upvotes','author','is_accepted','answer_text','upvotes_count']
        read_only_fields = ['author_name','author_title','upvotes','is_accepted','author']

    def get_author_name(self, obj):
        first = obj.author.first_name
        last = obj.author.last_name
        if first or last:
            return f"{first} {last}".strip()

        return obj.author.full_name

    def get_author_title(self, obj):
        instructor = getattr(obj.author, "instructor", None)
        if instructor:
            return instructor.get_title_display()
        return None

    def get_upvotes_count(self, obj):
        return obj.liked_by.count()

class QuestionSerializer(serializers.ModelSerializer):
    answer = AnswerSerializer(many=True, read_only=True)
    author_name = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields =  ['id','created_at','updated_at','question_title','author','author_name','course','is_resolved','question_text','answer']
        read_only_fields = ['author']

    def get_author_name(self, obj):
        first = obj.author.first_name
        last = obj.author.last_name
        if first or last:
            return f"{first} {last}".strip()

        return obj.author.full_name

    def validate(self, attrs):
        if attrs.get('is_accepted'):
            question = self.instance.question if self.instance else attrs['question']
            Answer.objects.filter(question=question).update(is_accepted=False)
            question.is_resolved = True
            question.save()
        return attrs
