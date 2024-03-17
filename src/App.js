import React from "react"; 


function App() {

    const styles = {
        container: {
          backgroundColor: 'black',
          color: 'white',
          minHeight: '100vh',
          minWidth: '100vw', // Set minimum height and width to fill the viewport
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        },
      };


  return (
    <div style={styles.container}>
      <h1>💻 Maxima ⚛️</h1>
      <p>Ratioing Intel.</p>
        <button onClick={clickMe}>Default Button</button>
    </div>
  );
}

function clickMe() {
    alert("You clicked me!");
  }

export default App;