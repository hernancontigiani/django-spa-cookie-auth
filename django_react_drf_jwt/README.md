# Django + React SPA (cross origin)

Cookie based authentication, frontend and backend separated, cross origin

## Getting Started

Run Django:

```sh
$ cd backend
$ python3 -m venv venv && source venv/bin/activate
(venv)$ pip install -r requirements.txt
(venv)$ python manage.py migrate
(venv)$ python manage.py runserver
```

Run React:

```sh
$ cd frontend
$ npm install
$ npm run dev
```

Test at [http://localhost:5173/](http://localhost:5173/).


docker run --rm -it --user "$(id -u):$(id -g)" -v $(pwd)/frontend:/front/ -w=/front node:18-bullseye npm install

docker run --rm -it --user "$(id -u):$(id -g)" -v $(pwd)/frontend:/front/ -w=/front node:18-bullseye npm run build

# Error al instalar Axios
Borrar la carpeta node_modules y el package-lock.json y volver a instalar todo:
```sh
rm -rf node_modules
rm -f package-lock.json
rm -f yarn.lock

# 👇️ clean npm cache
npm cache clean --force

# 👇️ install packages
npm install
```