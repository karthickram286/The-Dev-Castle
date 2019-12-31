import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div>
            <h2><span className="text-primary"><strong>Sign In</strong></span></h2>
            <h6><i className="fa fa-user"></i> Log In to your <i><strong>Dev Castle</strong></i> account</h6><br />

            <form onSubmit= "">
                <div className="form-group">
                    <label><strong>Email Address</strong></label>
                    <input type="email"
                            placeholder="Enter your email address"
                            required
                            className="form-control"
                            value={email}
                            onChange={ e => setEmail(e.target.value) }
                    />
                    <br />

                    <label><strong>Password</strong></label>
                    <input type="password"
                            placeholder="Password"
                            required
                            className="form-control"
                            value={password}
                            onChange={ e => setPassword(e.target.value) }
                    />
                    <br />
                </div>
                <button type="submit" className="btn btn-primary">Sign In</button>
            </form>
            <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
        </div>
    )
}

export default Login;
