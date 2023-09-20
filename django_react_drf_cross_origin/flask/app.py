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
    return {"cookies": cookies}

if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True)
