import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
    return (
        <div>
            <h2><span className="text-primary"><strong>Sign In</strong></span></h2>
            <h6><i className="fa fa-user"></i> Log In to your <i><strong>Dev Castle</strong></i> account</h6><br />

            <form onSubmit= "">
                <div className="form-group">
                    <label><strong>Email Address</strong></label>
                    <input type="text"
                            placeholder="Enter your email address"
                            required
                            className="form-control"
                    />
                    <br />

                    <label><strong>Password</strong></label>
                    <input type="text"
                            placeholder="Password"
                            required
                            className="form-control"
                    />
                    <br />
                </div>
                <button type="submit" class="btn btn-primary">Sign In</button>
            </form>
            <p>Don't have an account? <Link to="/login">Sign Up</Link></p>
        </div>
    )
}

export default Login
