from flask import Flask, request
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app, supports_credentials=True)

@app.route('/flask/cookies')
@cross_origin(origin='*', headers=['Content-Type','Authorization'])
def read_cookies():
    cookies = request.cookies
    print("cookies")
    print(cookies)
    response = app.make_response({"cookies": cookies})
    response.headers['Access-Control-Allow-Credentials'] = 'true'  # Establece el encabezado para permitir credenciales
    return response

if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True)
