import React from 'react';

export default class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            name: '',
            password: '',
            errorMessage: '',
        }
    }

    submit = async (event) => {

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
                            <label>Your name</label>
                            <input name="name" className="form-control" placeholder="Name" type="text" value={this.state.email} onChange={(event) => this.setState({name: event.target.value})}/>
                        </div>
                        <div className="form-group">
                            <label>Your password</label>
                            <input name="password" className="form-control" placeholder="Password" type="password" value={this.state.password} onChange={(event) => this.setState({password: event.target.value})}/>
                        </div>
                        {this.state.errorMessage === 'Wrong informations' ? (<div className="alert alert-danger" role="alert">{this.state.errorMessage}</div>) : <></>}
                        {this.state.errorMessage === 'Login successful' ? (<div className="alert alert-success" role="alert">{this.state.errorMessage}</div>) : <></>}
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