import React from 'react';
import registerService from '../../services/RegisterService';

export default class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            name: '',
            password: '',
            errorMessage: '',
            successMessage: '',
        }
    }

    submit = async (event) => {
        console.log("register");
        event.preventDefault();
        if (this.state.email === "" || this.state.name === "" || this.state.password === "")
            this.setState({errorMessage: 'Wrong informations'});
        else if (this.state.password.length < 6)
            this.setState({errorMessage: 'The password must have at least 6 characters'});
        else {
            const tmp = await registerService(this.state.email, this.state.name, this.state.password);
            if (!tmp.message) {
                if (tmp.error && tmp.error === "User already exist")
                    this.setState({errorMessage: tmp.error});
                else
                    this.setState({errorMessage: 'Wrong informations'});
            } else {
                this.setState({successMessage: 'Confirmation email sent'});
                setTimeout(() => {
                    this.props.history.push("/login");
                }, 500);
            }
        }
    }

    render() {
        return (
        <div className="container" id="box-position">
            <div className="card">
                <article className="card-body">
                <a href="/login" className="float-right btn btn-outline-primary">Sign in</a>
                    <h4 className="card-title mb-4 mt-1">Register</h4>
                    <form method="POST" onSubmit={this.submit}>
                    <div className="form-group">
                            <label>Your email</label>
                            <input name="email" className="form-control" placeholder="Email" type="email" value={this.state.email} onChange={(event) => this.setState({email: event.target.value})}/>
                        </div>
                        <div className="form-group">
                            <label>Your name</label>
                            <input name="name" className="form-control" placeholder="Name" type="text" value={this.state.name} onChange={(event) => this.setState({name: event.target.value})}/>
                        </div>
                        <div className="form-group">
                            <label>Your password</label>
                            <input name="password" className="form-control" placeholder="Password" type="password" value={this.state.password} onChange={(event) => this.setState({password: event.target.value})}/>
                        </div>
                        {this.state.errorMessage !== '' ? (<div className="alert alert-danger" role="alert">{this.state.errorMessage}</div>) : <></>}
                        {this.state.successMessage !== '' ? (<div className="alert alert-success" role="alert">{this.state.successMessage}</div>) : <></>}
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary btn-block">Register</button>
                        </div>                                                           
                    </form>
                </article>
            </div>
        </div>
        );
    }
}