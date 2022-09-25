from rest_framework.generics import RetrieveAPIView, ListAPIView
from .serializers import ProfileSerializer
from authentication.models import Profile

class ProfileDetailAPIView(RetrieveAPIView):
    serializer_class = ProfileSerializer
    queryset = Profile.objects.select_related('user').prefetch_related('followers')

class ProfileAPIView(ListAPIView):
    serializer_class = ProfileSerializer
    queryset = Profile.objects.select_related('user').prefetch_related('followers')
