import React from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
    return (
        <div>
            <h2><span className="text-primary"><strong>Sign Up</strong></span></h2>
            <h6><i className="fa fa-user"></i> Create your <i><strong>Dev Castle</strong></i> account</h6><br />

            <form onSubmit= "">
                <div className="form-group">
                    <label><strong>First Name</strong></label>
                    <input type="text"
                            placeholder="Enter your first name"
                            required
                            className="form-control"
                    />
                    <br />

                    <label><strong>Last Name</strong></label>
                    <input type="text"
                            placeholder="Enter your last name"
                            required
                            className="form-control"
                    />
                    <br />

                    <label><strong>Email address</strong></label>
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

                    <label><strong>Confirm Password</strong></label>
                    <input type="text"
                            placeholder="Confirm Password"
                            required
                            className="form-control"
                    />
                    <br />
                </div>
                <button type="submit" class="btn btn-primary">Sign Up</button>
            </form>
            <p>Already have an account? <Link to="/login">Sign In</Link></p>
        </div>
    )
}

export default Register
