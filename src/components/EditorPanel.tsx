import React, { useState, useEffect } from "react";

interface Props {
  title: string;
}

const MyComponent: React.FC<Props> = ({ title }) => {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    document.title = `${title}: ${count}`;
  }, [count, title]);

  const handleIncrement = () => {
    setCount((prevCount) => prevCount + 1);
  };

  const handleDecrement = () => {
    setCount((prevCount) => prevCount - 1);
  };

  return (
    <div>
      <h1>{title}</h1>
      <p>Count: {count}</p>
      <button onClick={handleIncrement}>Increment</button>
      <button onClick={handleDecrement}>Decrement</button>
    </div>
  );
};

export default MyComponent;
