import React from 'react';
import './Login.css';
import {loginService} from '../../services/AuthService.jsx';

export default class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            errorMessage: '',
        }
    }

    submit = async (event) => {
        event.preventDefault();
        const tmp = await loginService(this.state.email, this.state.password);
        if (tmp.token == null) {
            this.setState({errorMessage: 'Wrong informations'});
        } else {
            this.setState({errorMessage: 'Login successful'});
            localStorage.setItem("token", tmp.token); //a chaque arrivée sur la route connection, vérifier que un token n'est pas déjà existant
            setTimeout(() => {
                this.props.history.push("/rooms");
            }, 500);
        }
        //renvoyer sur la route avec la liste des serveurs de l'utilisateurs
    }

    render() {
        return (
        <div className="container" id="box-position">
            <div className="card">
                <article className="card-body">
                <a href="/register" className="float-right btn btn-outline-primary">Sign up</a>
                    <h4 className="card-title mb-4 mt-1">Sign in</h4>
                    <form method="POST" onSubmit={this.submit}>
                        <div className="form-group">
                            <label>Your email</label>
                            <input name="email" className="form-control" placeholder="Email" type="email" value={this.state.email} onChange={(event) => this.setState({email: event.target.value})}/>
                        </div>
                        <div className="form-group">
                            <label>Your password</label>
                            <input name="password" className="form-control" placeholder="******" type="password" value={this.state.password} onChange={(event) => this.setState({password: event.target.value})}/>
                        </div>
                        {this.state.errorMessage === 'Wrong informations' ? (<div className="alert alert-danger" role="alert">{this.state.errorMessage}</div>) : <></>}
                        {this.state.errorMessage === 'Login successful' ? (<div className="alert alert-success" role="alert">{this.state.errorMessage}</div>) : <></>}
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary btn-block"> Login  </button>
                        </div>                                                           
                    </form>
                </article>
            </div>
        </div>
        );
    }
}