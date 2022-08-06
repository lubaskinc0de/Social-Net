from authentication.permissions import IsAnonymous
from djoser.views import TokenCreateView

class AnonymousTokenCreateView(TokenCreateView):
    permission_classes = (IsAnonymous,)