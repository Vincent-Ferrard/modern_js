import React from 'react';

export default class Confirm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: props.match.params.user
        };
    }

    async componentDidMount() {
        const res = await fetch(`http://localhost:8080/api/user/confirm/${this.state.user}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        await res.json;
    }

    render() {
        return (
            <div className="container" id="box-position">
                <div>Account confirmed {this.state.user}, click <a href='/login'> here </a>to get redirected</div>
            </div>
        );
    }
}