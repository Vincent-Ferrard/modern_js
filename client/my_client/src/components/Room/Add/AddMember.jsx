import React from 'react';
import { Redirect } from 'react-router-dom'
import './AddMember.css';

import { inviteUser } from '../../../services/RoomService.jsx';

export default class AddMember extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomId: props.match.params.roomId ?? null,
      input: "",
      errorMessage: "",
    }
  }

  submit = async (event) => {
    event.preventDefault();
    const res = await inviteUser(this.state.roomId, this.state.input);
    console.log(res);
    this.setState({input: ""});
    if (res.message)
      this.setState({errorMessage: res.message});
  }

  render() {
    if (this.state.roomId)
      return (
        <div className="container" id="box-position">
          <div className="card">
            <article className="card-body">
            <button className="float-right btn btn-outline-primary" onClick={(event) => {event.preventDefault();this.props.history.goBack();}}>Go Back</button>
                <h4 className="card-title mb-4 mt-1">Send an invitation to the room</h4>
                <form method="POST" onSubmit={this.submit}>
                    <div className="form-group">
                        <label>User Email / Username</label>
                        <input name="email" className="form-control" placeholder="Email / Username" type="text" value={this.state.input} onChange={(event) => this.setState({input: event.target.value})}/>
                    </div>
                    {/* {this.state.errorMessage === 'Wrong informations' ? (<div className="alert alert-danger" role="alert">{this.state.errorMessage}</div>) : <></>*/}
                    {this.state.errorMessage !== '' ? (<div className="alert alert-success" role="alert">{this.state.errorMessage}</div>) : <></>}
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary btn-block"> Send invitation </button>
                    </div>                                                           
                </form>
            </article>
          </div>
        </div>
      );
    else
        return (
          <Redirect to="/rooms"></Redirect>
        );
  }
}