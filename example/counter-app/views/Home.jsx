const React = require('react');
const Counter = require('./components/Counter');

function Home(props) {
    return (
        <div>
            <h1>{props.title}</h1>
            <p>{props.message}</p>
            <Counter />
        </div>
    );
}

module.exports = Home;