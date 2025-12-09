const React = require('react');
const Counter = require('./components/Counter');

function Home(props) {
    return (
        <>
            <link rel="stylesheet" href="/css/home.css" />
            <link rel="stylesheet" href="/css/counter.css" />
            <div className="home-page">
                <div className="home-card">
                    <div className="home-header">
                        <h1 className="home-title">{props.title}</h1>
                        <p className="home-subtitle">{props.message}</p>
                    </div>
                    <Counter />
                </div>
            </div>
        </>
    );
}

module.exports = Home;
