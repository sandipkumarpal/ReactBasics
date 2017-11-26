import React, { Component } from 'react';
import Application from './component/Application';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

class App extends Component {
  
  render() {
    const player = [
      {
          name: 'Sandip pal',
          score: 32,
          id: 1,
      },
      {
          name: 'Gopal Pal',
          score: 42,
          id: 2
      },
      {
          name: 'Rayel Pal',
          score: 55,
          id: 3
      }
  ];
    return (
      <div className="App">
        <Application player={player}/>
      </div>
    );
  }
}

export default App;
