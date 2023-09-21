import json

from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.views.decorators.http import require_POST

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.parsers import JSONParser

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken



class LoginAPIView(APIView):
    parser_classes = (JSONParser,)
    authentication_classes = ()
    permission_classes = ()

    def post(self, request):
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        if username is None or password is None:
            return JsonResponse({'detail': 'Please provide username and password.'}, status=400)

        user = authenticate(username=username, password=password)

        if user is None:
            return JsonResponse({'detail': 'Invalid credentials.'}, status=400)

        token, created = Token.objects.get_or_create(user=user)
        refresh_token = RefreshToken.for_user(user)
        access_token = AccessToken.for_user(user)
        data = {
            "token": f"Token {token}",
            "access_token": f"Bearer {access_token}", 
            "refresh_token": f"Bearer {refresh_token}",
            'detail': 'Successfully logged in.'
        }

        if not request.session.session_key:
            #request.session['userdata'] = 123
            request.session.save()
            print("session creada:", request.session.session_key)
        else:
            print("session existe:", request.session.session_key)
        
        request.session['userdata'] = 123
        return JsonResponse(data)


class LogoutAPIView(APIView):
    authentication_classes = (JWTAuthentication,)
    
    def get(self, request):
        if not request.user.is_authenticated:
            return JsonResponse({'detail': 'You\'re not logged in.'}, status=400)

        # logout(request)
        return JsonResponse({'detail': 'Successfully logged out.'})


    
class SessionAPIView(APIView):
    authentication_classes = (JWTAuthentication,)

    def get(self, request):
        if not request.user.is_authenticated:
            return JsonResponse({'isAuthenticated': False})

        return JsonResponse({'isAuthenticated': True})


class WhoamiAPIView(APIView):
    authentication_classes = (JWTAuthentication,)
    
    def get(self, request):
        print("whoami_view:", request.user.username, request.user.is_authenticated)
        if not request.user.is_authenticated:
            return JsonResponse({'isAuthenticated': False})

        if not request.session.session_key:
            print("Session no creada")
            request.session['userdata'] = 123
            request.session.save()
            print("session creada en endpoint:", request.session.session_key)
        else:
            print("session existente:", request.session.session_key)
            refresh_token = request.session.get('userdata')
            print("refresh_token:", refresh_token)
        
        
        return JsonResponse({'username': request.user.username})
