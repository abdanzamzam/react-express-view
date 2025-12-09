const React = require('react');
const { useState } = require('react');

function Counter() {
    const [count, setCount] = useState(0);

    const increment = () => {
        setCount(count + 1);
    };

    const decrement = () => {
        setCount(count - 1);
    };

    return (
        <div className="counter-box">
            <h1 className="counter-title">Counter</h1>
            <p className="counter-value">{count}</p>
            <div className="counter-actions">
                <button className="btn btn-primary" onClick={increment}>Increment</button>
                <button className="btn btn-secondary" onClick={decrement}>Decrement</button>
            </div>
        </div>
    );
}

module.exports = Counter;
