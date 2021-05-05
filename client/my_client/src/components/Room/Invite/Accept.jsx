import React from 'react';
import { acceptInvite } from '../../../services/RoomService.jsx';

export default class Accept extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomId: props.match.params.roomId ?? null,
      inviteToken: new URLSearchParams(this.props.location.search).get("token") ?? null,
      input: "",
      errorMessage: "",
    }
  }

  async componentWillMount() {
    try {
      await acceptInvite(this.state.roomId, this.state.inviteToken);
    } catch (e) {
      this.props.history.push("/");
    }
  }

  render() {
    return (
      <div className="container" id="box-position">
        <div className="card">
          <article className="card-body">
          <button className="float-right btn btn-outline-primary" onClick={(event) => {event.preventDefault();this.props.history.push("/");}}>Go Back</button>
              <h4 className="card-title mb-4 mt-1">You have join the room</h4>
          </article>
        </div>
      </div>
    );
  }
}