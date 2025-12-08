import React, { useState } from "react";

interface HomeProps {
  title: string;
  message: string;
}

function Home(props: HomeProps) {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>{props.title}</h1>
      <p>{props.message}</p>
      <div
        style={{ border: "1px solid #ccc", padding: "10px", marginTop: "20px" }}
      >
        <h3>Interactive Counter</h3>
        <p>Count: {count}</p>
        <button onClick={() => setCount(count + 1)}>Increment</button>
      </div>
    </div>
  );
}

export default Home;
