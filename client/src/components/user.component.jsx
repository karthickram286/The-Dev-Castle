import React from 'react';
import axios from 'axios';

class User extends React.Component {
    constructor() {
        super();

        this.state = {
            users: [

            ]
        }
    }

    componentDidMount() {
        fetch('/users/getAll')
            .then(response => response.json())
            .then(response => {
                this.setState({ users: response.data });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    render() {
        return (
            <div className="users">
                { this.state.users }
            </div>
        )
    }
}

export default User;