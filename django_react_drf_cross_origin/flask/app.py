from flask import Flask, request

app = Flask(__name__)

@app.route('/flask/cookies')
def read_cookies():
    cookies = request.cookies
    print("cookies")
    print(cookies)
    return {"cookies": cookies}

if __name__ == '__main__':
    app.run(debug=True)
