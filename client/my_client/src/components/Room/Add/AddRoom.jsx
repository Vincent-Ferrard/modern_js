import React from 'react';
import './AddRoom.css';

import { createRoom } from '../../../services/RoomService.jsx';

export default class AddRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      success: "",
      error: ""
    }
  }

  submit = async (event) => {
    event.preventDefault();
    this.setState({success: "", error: ""});
    if (this.state.name !== "") {
      const res = await createRoom(this.state.name);
      console.log(res);
      this.setState({name: ""});
      if (res.message)
        this.setState({success: res.message});
      else if (res.error)
        this.setState({error: res.error});
    } else
      this.setState({error: "All fields have to be completed."});
  }

  render() {
    return (
      <div className="container" id="box-position">
        <div className="card">
          <article className="card-body">
          <button className="float-right btn btn-outline-primary" onClick={(event) => {event.preventDefault();this.props.history.goBack();}}>Go Back</button>
              <h4 className="card-title mb-4 mt-1">Create a room</h4>
              <form method="POST" onSubmit={this.submit}>
                  <div className="form-group">
                      <label>Room Name</label>
                      <input name="name" className="form-control" placeholder="Name" type="text" value={this.state.name} onChange={(event) => this.setState({name: event.target.value})}/>
                  </div>
                  { this.state.error !== '' ? (<div className="alert alert-danger" role="alert">{this.state.error}</div>) : <></> }
                  { this.state.success !== '' ? (<div className="alert alert-success" role="alert">{this.state.success}</div>) : <></> }
                  <div className="form-group">
                      <button type="submit" className="btn btn-primary btn-block"> Create room </button>
                  </div>                                                           
              </form>
          </article>
        </div>
      </div>
    );
  }
}