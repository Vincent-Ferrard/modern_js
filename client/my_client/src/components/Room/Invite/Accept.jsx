import React from 'react';
import { acceptInvite } from '../../../services/RoomService.jsx';

export default class Accept extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomId: props.match.params.roomId ?? null,
      inviteToken: new URLSearchParams(this.props.location.search).get("token") ?? null,
      message: "",
    }
  }

  async componentWillMount() {
    console.log("ok");
    const res = await acceptInvite(this.state.roomId, this.state.inviteToken);
    if (!res.message || res.message !== "You have join the room")
      this.props.history.push("/");
    else
      this.setState({message: res.message})
  }

  render() {
    return (
      <>
        {
          this.state.message !== "" ?
          (
            <div className="container" id="box-position">
              <div className="card">
                <article className="card-body">
                <button className="float-right btn btn-outline-primary" onClick={(event) => {event.preventDefault();this.props.history.push("/");}}>Go Back</button>
                    <h4 className="card-title mb-4 mt-1">{this.state.message}</h4>
                </article>
              </div>
            </div>
          ) : (<></>)
        }
      </>      
    );
  }
}