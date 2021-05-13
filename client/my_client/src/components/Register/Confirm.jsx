import React from 'react';

export default class Confirm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: props.match.params.user
        };
    }

    render() {
        return (
            <>
                <div>Account confirmed {this.state.user}, click <a href='/login'> here </a>to get redirected</div>
            </>
        );
    }
}