import json

from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.views.decorators.http import require_POST

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.parsers import JSONParser

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken


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
            return JsonResponse({'detail': 'Invalid credentials.'}, status=401)

        refresh_token = RefreshToken.for_user(user)
        data = {
            "token": str(refresh_token.access_token),
            'detail': 'Successfully logged in.'
        }

        if not request.session.session_key:
            request.session.save()
            print("session creada:", request.session.session_key)
        else:
            print("session existe:", request.session.session_key)
        
        request.session['refresh_token'] = str(refresh_token)
        return JsonResponse(data)


class LogoutAPIView(APIView):
    authentication_classes = (JWTAuthentication,)
    
    def get(self, request):
        # Delete refresh token from session
        if 'refresh_token' in request.session:
            refresh_token = request.session.get('refresh_token')
            # del request.session['refresh_token']

        # Delete session
        # request.session.flush()
        
        # Revoque tokens for that user:
        if refresh_token:
            try:
                # Exclude this refresh token
                refresh_token = RefreshToken(refresh_token)
                refresh_token.blacklist()
                
                # Exclude all refresh token of this user
                user = request.user
                outstandingtokens = OutstandingToken.objects.filter(
                    user=user
                ).exclude(
                    id__in=BlacklistedToken.objects.filter(token__user=user).values_list('token_id', flat=True),
                )
                for token in outstandingtokens:
                    BlacklistedToken.objects.create(token=token)
            except:
                pass
        # if not request.user.is_authenticated:
        #     return JsonResponse({'detail': 'You\'re not logged in.'}, status=400)
        
        
        # 
        
        

        # logout(request)
        return JsonResponse({'detail': 'Successfully logged out.'})


class RefreshAPIView(APIView):
    authentication_classes = ()
    permission_classes = ()

    def get(self, request):
        if not request.session.session_key:
            print('No session created.')
            return JsonResponse({'error': 'Session invalid.'}, status=403)

        refresh_token = request.session.get('refresh_token')

        if not refresh_token:
            print('No refresh token stored in session.')
            return JsonResponse({'error': 'No refresh token stored in session.'}, status=401)

        try:
            refresh_token = RefreshToken(refresh_token)
            access_token = str(refresh_token.access_token)
        except:
            return JsonResponse({'error': 'Invalid refresh token.'}, status=401)

        return JsonResponse({'token': access_token}, status=status.HTTP_200_OK)


class WhoamiAPIView(APIView):
    authentication_classes = (JWTAuthentication,)
    
    def get(self, request):
        print("whoami_view:", request.user.username, request.user.is_authenticated)

        if not request.session.session_key:
            print("Session no creada")
            print("session creada en endpoint:", request.session.session_key)
        else:
            print("session existente:", request.session.session_key)
            refresh_token = request.session.get('refresh_token')
            print("refresh_token:", refresh_token)
        
        
        return JsonResponse({'username': request.user.username})
