import React from 'react';

const Landing = () => {
    return (
        <section className="landing">
            <div className="dark-overlay">
                <div className="landing-inner">
                    <h1 className="x-large">The Dev Castle</h1>
                    <p className="lead">
                        A place for Developers to hangout
                    </p>
                    <div className="buttons">
                        <a href="register.html" className="btn btn-primary">Register</a>
                        <a href="login.html" className="btn btn-primary">Login</a>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Landing

