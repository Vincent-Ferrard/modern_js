import React from 'react';
import { Nav, Button, NavDropdown } from 'react-bootstrap';
import './Members.css';

export default class Members extends React.Component {

  render() {
    return (
      <Nav className="col-md-2 d-md-block bg-dark sidebar" variant="pills">
        {
          Object.keys(this.props.members).length > 0 ? (
            <div>
              <NavDropdown key={this.props.members.owner._id} title={
                <>
                  <i className={`status-icon ${this.props.members.owner.username === this.props.connectUser.username || this.props.members.owner.status ? 'connected' : ''}`}></i>
                  {this.props.members.owner.username} - (Owner)
                </>
              } className="members">
                <NavDropdown.Item className="members-dropdown-item">Send a message</NavDropdown.Item>
              </NavDropdown>
              {
                Object.keys(this.props.members.members).map(key => {
                  return (
                    <NavDropdown key={this.props.members.members[key]._id} title={
                      <>
                        <i className={`status-icon ${this.props.members.members[key].username === this.props.connectUser.username || this.props.members.members[key].status ? 'connected' : ''}`}></i>
                        {this.props.members.members[key].username}
                      </>
                    } className="members">
                      { this.props.members.owner.username === this.props.connectUser.username ? (
                        <>
                          <NavDropdown.Item key={this.props.members.members[key]._id + "-promote"} className="promote members-dropdown-item" onClick={(event) => this.props.promoteUserToOwner(event, this.props.members.members[key].username)}>Promote to owner</NavDropdown.Item>
                          <NavDropdown.Item key={this.props.members.members[key]._id + "-message"} className="members-dropdown-item">Send a message</NavDropdown.Item>
                        </>
                      ) : (
                        <NavDropdown.Item key={this.props.members.members[key]._id + "-message"} className="members-dropdown-item">Send a message</NavDropdown.Item>
                      )}
                    </NavDropdown>
                  );
                })
              }
              <div id="add-members-button">
                <Button variant="outline-light" className="add-member right-margin" onClick={(event) => this.props.toInvite(event)}>Add a member</Button>
                <Button variant="outline-danger" onClick={(event) => this.props.toLeave(event)}>Leave group</Button>
              </div>
            </div>
          ) : ("")
        }
      </Nav>
    );
  }
}