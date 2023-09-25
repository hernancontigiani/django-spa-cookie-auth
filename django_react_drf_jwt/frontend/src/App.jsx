import React from "react";

import { AuthAPI } from "./api/AuthAPI"
import { TestAPI } from "./api/TestAPI"

const domain = "http://localhost:8180"

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      error: "",
      isAuthenticated: false,
    };
  }

  makelogin = () => {
    console.log("makelogin")
    this.setState({
      isAuthenticated: true, username: "", password: "", error: ""
    });
  }

  makelogout = () => {
    console.log("makelogout")
    this.setState({
      isAuthenticated: false,
      token: "",
      });
  }

  componentDidMount = () => {
    this.getSession();
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
    AuthAPI.login(this.state.username, this.state.password).then((data) => {
      this.makelogin();
    }).catch( error => {
      //console.log(error);
      if(error.response.status !== 500) {
        this.setState({error: error.response.data.detail});
      } else {
        this.setState({error: "Error in login process"});
      }
    });
  }

  logout = (event) => {
    event.preventDefault();
    AuthAPI.logout().then((data) => {
      this.makelogout();
    }).catch( error => {
      console.log(error);
      this.makelogout();
    });
  }

  getSession = async () => {
    try {
      const session_data = await AuthAPI.session();
      if(session_data) {
        this.makelogin();
      } else {
        this.makelogout();  
      }
    }
    catch(error) {
      console.log(error)
      this.makelogout();
    }
  }

  whoami = () => {
    TestAPI.whoami().then((data) => {
      console.log("You are logged in as: " + data.username);
    }).catch( error => {
      console.log(error);
      this.makelogout();
    });
  }

  render() {
    if (!this.state.isAuthenticated) {
      return (
        <div className="container mt-3">
          <h1>React JWT+Cookie Auth</h1>
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
        <h1>React JWT+Cookie Auth</h1>
        <p>You are logged in!</p>
        <button className="btn btn-primary mr-2" onClick={this.whoami}>WhoAmI</button>
        <button className="btn btn-danger" onClick={this.logout}>Log out</button>
        <button className="btn btn-secondary" onClick={this.getSession}>Session</button>
      </div>
    )
  }
}

export default App;
