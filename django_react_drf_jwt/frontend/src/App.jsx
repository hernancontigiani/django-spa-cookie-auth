import React from "react";

const domain = "http://localhost:8180"
//const domain = "http://cursos.inovecode.com"

const getToken = (token_name) => {
  const token = localStorage.getItem(token_name);
  console.log(`${token_name} disponible: ${token}`)
  return String(token); // Forzar que el dato sea interpretado como string
}

const setToken = (token_name, token) => {
  console.log(`${token_name} almacenado: ${token}`)
  localStorage.setItem(token_name, token);
}

const removeToken = (token_name) => {
  localStorage.removeItem(token_name);
}

class App extends React.Component {

  constructor(props) {
    super(props);

    

    this.state = {
      csrf: "",
      username: "",
      password: "",
      error: "",
      isAuthenticated: false,
      token: "",
      access_token: getToken("access_token"),
      refresh_token: "",
    };
  }

  
    
  

  makelogout = () => {
    this.setState({
      isAuthenticated: false,
      token: "",
      access_token: "",
      refresh_token: "",
      });
      removeToken("access_token");
  }

  componentDidMount = () => {
    this.getSession();
  }

  getSession = () => {
    if(this.state.access_token === "") {
      return
    }
    fetch(`${domain}/api/session/`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": this.state.access_token,
      },
      credentials: "include",
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.isAuthenticated) {
        this.setState({isAuthenticated: true});
      } else {
        this.makelogout();
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }

  whoami = () => {
    fetch(`${domain}/api/whoami/`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": this.state.access_token,
      },
      credentials: "include",
    })
    .then((res) => res.json())
    .then((data) => {
      console.log("You are logged in as: " + data.username + " with token " + this.state.token);
    })
    .catch((err) => {
      console.log(err);
    });
  }

  handlePasswordChange = (event) => {
    this.setState({password: event.target.value});
  }

  handleUserNameChange = (event) => {
    this.setState({username: event.target.value});
  }

  isResponseOk(response) {
    if (response.status >= 200 && response.status <= 299) {
      return response.json();
    } else {
      throw Error(response.statusText);
    }
  }

  login = (event) => {
    event.preventDefault();
    fetch(`${domain}/api/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({username: this.state.username, password: this.state.password}),
    })
    .then(this.isResponseOk)
    .then((data) => {
      console.log(data);
      this.setState({
        isAuthenticated: true, username: "", password: "", error: "",
        token: data.token,
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      });
      setToken("access_token", data.access_token);
    })
    .catch((err) => {
      console.log(err);
      this.setState({error: "Wrong username or password."});
    });
  }

  logout = () => {
    fetch(`${domain}/api/logout/`, {
      headers: {
        "Authorization": this.state.access_token,
      },
      credentials: "include",
    })
    .then(this.isResponseOk)
    .then((data) => {
      console.log(data);
      this.makelogout();
    })
    .catch((err) => {
      console.log(err);
      this.makelogout();
    });
  };

  render() {
    if (!this.state.isAuthenticated) {
      return (
        <div className="container mt-3">
          <h1>React Cookie Auth</h1>
          <br />
          <h2>Login</h2>
          <form onSubmit={this.login}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input type="text" className="form-control" id="username" name="username" value={this.state.username} onChange={this.handleUserNameChange} />
            </div>
            <div className="form-group">
              <label htmlFor="username">Password</label>
              <input type="password" className="form-control" id="password" name="password" value={this.state.password} onChange={this.handlePasswordChange} />
              <div>
                {this.state.error &&
                  <small className="text-danger">
                    {this.state.error}
                  </small>
                }
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Login</button>
          </form>
        </div>
      );
    }
    return (
      <div className="container mt-3">
        <h1>React Cookie Auth</h1>
        <p>You are logged in!</p>
        <button className="btn btn-primary mr-2" onClick={this.whoami}>WhoAmI</button>
        <button className="btn btn-danger" onClick={this.logout}>Log out</button>
        <button className="btn btn-secondary" onClick={this.getSession}>Session</button>
      </div>
    )
  }
}

export default App;
