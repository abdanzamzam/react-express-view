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
        <div>
            <h1>Counter</h1>
            <p>Current Count: {count}</p>
            <button onClick={increment}>Increment</button>
            <button onClick={decrement} style={{ marginLeft: '10px' }}>Decrement</button>
        </div>
    );
}

module.exports = Counter;