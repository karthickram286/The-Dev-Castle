import React from 'react';
import axios from 'axios';

class User extends React.Component {
    constructor() {
        super();

        this.state = {
            users: ''
        }
    }

    componentDidMount() {
        axios.get('/api/users/getAll')
            // .then(response => response.json())
            .then(response => {
                console.log(response);
                this.setState({ users: response.data[0].email });
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