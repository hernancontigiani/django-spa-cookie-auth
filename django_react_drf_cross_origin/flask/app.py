from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Configura CORS para permitir todas las solicitudes

@app.route('/flask/cookies')
def read_cookies():
    cookies = request.cookies
    print("cookies")
    print(cookies)
    return {"cookies": cookies}

if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True)
