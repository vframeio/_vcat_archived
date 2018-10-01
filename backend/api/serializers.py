from django.contrib.auth.models import User, Group
from rest_framework import serializers

class QuickGroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('name',)

class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')

class UserSerializer(serializers.HyperlinkedModelSerializer):
    groups = QuickGroupSerializer(many=True)
    class Meta:
        model = User
        fields = ('id', 'url', 'username', 'email', 'groups', 'is_superuser', 'is_staff')
