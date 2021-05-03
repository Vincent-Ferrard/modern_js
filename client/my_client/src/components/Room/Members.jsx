import React from 'react';
import { Nav, Dropdown } from 'react-bootstrap';
import './Room.css';

const USER = "20Cents";

export default class Members extends React.Component {

  render() {
    return (
      <Nav className="col-md-2 d-md-block bg-light sidebar">
        <div className="sidebar-sticky"></div>
        {
          Object.keys(this.props.members).length > 0 ? (
            <div>
              <Nav.Item key={this.props.members.owner._id}>
                {this.props.members.owner.username} - (Owner) - {this.props.members.owner.status ? "connected" : "disconnected"}
              </Nav.Item>
              {
                Object.keys(this.props.members.members).map(key => {
                  return (
                    <Nav.Item key={this.props.members.members[key]._id}>
                      <Dropdown>
                        <Dropdown.Toggle variant="outline-secondary">
                          {this.props.members.members[key].username} - {this.props.members.members[key].status ? "connected" : "disconnected"}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          { this.props.members.owner.username === USER ? (
                            <Dropdown.Item onClick={(event) => this.props.promoteUserToOwner(event, this.props.members.members[key].username)}>Promote to owner</Dropdown.Item>
                          ) : (
                            <></>
                          )}
                        </Dropdown.Menu>
                      </Dropdown>
                    </Nav.Item>
                  );
                })
              }
            </div>
          ) : ("")
        }
      </Nav>
    );
  }

}