import React from "react"; 


function App() {
    // s ssconst xtermRef = useRef(null);

    // useEffect(() => {
    //     const xterm = new Terminal();
    //     xterm.open(xtermRef.current);

    //     xterm.writeln("Please enter any string then press enter:");
    //     xterm.write("echo> ");
    // }, []); // Empty dependency array ensures the effect runs only once after mount

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

     /* <XTerm
                    ref={this.xtermRef}
                    onData={(data) => {
                        const code = data.charCodeAt(0);
                        // If the user hits empty and there is something typed echo it.
                        if (code === 13 && this.state.input.length > 0) {
                            this.xtermRef.current.terminal.write(
                                "\r\nYou typed: '" + this.state.input + "'\r\n"
                            );
                            this.xtermRef.current.terminal.write("echo> ");
                            this.setState({input: ""})
                        } else if (code < 32 || code === 127) { // Disable control Keys such as arrow keys
                            return;
                        } else { // Add general key press characters to the terminal
                            this.xtermRef.current.terminal.write(data);
                            this.setState({input: this.state.input + data})
                        }
                    }}
                /> */