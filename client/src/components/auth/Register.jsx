import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {

    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

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
                            value={firstname}
                            onChange={ e => setFirstName(e.target.value) }
                    />
                    <br />

                    <label><strong>Last Name</strong></label>
                    <input type="text"
                            placeholder="Enter your last name"
                            required
                            className="form-control"
                            value={lastname}
                            onChange={ e => setLastName(e.target.value) }
                    />
                    <br />

                    <label><strong>Email address</strong></label>
                    <input type="email"
                            placeholder="Enter your email address"
                            required
                            className="form-control"
                            value={ email }
                            onChange={ e => setEmail(e.target.value) }
                    />
                    <br />

                    <label><strong>Password</strong></label>
                    <input type="password"
                            placeholder="Password"
                            required
                            className="form-control"
                            value={ password }
                            onChange= { e => setPassword(e.target.value) }
                    />
                    <br />

                    <label><strong>Confirm Password</strong></label>
                    <input type="password"
                            placeholder="Confirm Password"
                            required
                            className="form-control"
                            value={ confirmPassword }
                            onChange={ e => setConfirmPassword(e.target.value) }
                    />
                    <br />
                </div>
                <button type="submit" className="btn btn-primary">Sign Up</button>
            </form>
            <p>Already have an account? <Link to="/login">Sign In</Link></p>
        </div>
    )
}

export default Register;
