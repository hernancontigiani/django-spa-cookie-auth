import { client } from "./client"

const token_name = "token";
const token_type = "Bearer"
let lastSessionData = null;

const getToken = () => {
  const token = localStorage.getItem(token_name);
  //console.log(`${token_name} disponible: ${token}`)
  return token ?? ""; // Forzar que el dato sea interpretado como string
}

const setToken = (token) => {
  //console.log(`${token_name} almacenado: ${token}`)
  localStorage.setItem(token_name, token);
}

const removeToken = () => {
  localStorage.removeItem(token_name);
}

export const getAuthHeader = () => {
  return `${token_type} ${getToken()}`
}

export const AuthAPI = {
  login: async function (username, password) {
    const response = await client.request({
      url: `/api/login/`,
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      data: {
        username: username,
        password, password
      }
    })
    if(response) {
      setToken(response.data.token);
      return response.data
    }
  },

  logout: async function () {
    const response = await client.request({
      url: `/api/logout/`,
      headers: {
        "Authorization": getAuthHeader(),
      },
      method: "GET",
    })
    if(response) {
      removeToken()
      return response.data
    }
  },

  refresh: async function () {
    const response = await client.request({
      url: `/api/refresh/`,
      method: "GET",
    })
    if(response) {
      setToken(response.data.token);
      return response.data
    }
  },

  session: async function () {
    // const token = getToken();
    // if(token !== "") {
    //   // user is already authenticated (token is available)
    //   return lastSessionData;
    // }
    const data = await this.refresh();
    lastSessionData = data;
    return data
  },

}

// Request interceptor for API calls
client.interceptors.request.use(
  async config => {
    // Things before request is sent
    // Add to every request the auth header
    config.headers = { 
      "Authorization": getAuthHeader(),
    }
    return config;
  },
  error => {
    // Things with request error
    return Promise.reject(error)
});

// Response interceptor for API calls
client.interceptors.response.use((response) => {
  // Do something with response data
  return response
}, async function (error) {
  // Do something with response error
  const originalRequest = error.config;

  if (!originalRequest._retry && (error.response.status === 403 || error.response.status === 401)) {
    // Check if it's the refresh endpoint
    if (originalRequest.url.endsWith('/refresh/')) {
      return Promise.reject(error);  // Exclude interceptor for refresh endpoint
    }
    // Set request retry true
    originalRequest._retry = true;

    // Try logging with refresh token (get session)
    await AuthAPI.refresh();

    // Try again the original request
    return client(originalRequest);
  }
  // Return error
  return Promise.reject(error);
});