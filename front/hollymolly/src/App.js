import logo from './logo.svg';
import './App.css';
import style from './styles/styles';
import {BrowserRouter, Route} from "react-router-dom";
import RoomList from "../src/screens/RoomList";

import React from "react";

function App() {
    /* return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    홀리몰리의 세계에 오신 것을 환영합니다!
                </p>
                <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
                    Learn React
                </a>
            </header>
        </div>
    ); */
    // return (
    //     <div style={{background: style.black}}>
    //             <p>
    //                 {/* Edit <code>src/App.js</code> and save to reload.
    //                  */}
    //                 홀리몰리의 세계에 오신 것을 환영합니다!
    //             </p>
    //     </div>
    // );
    return (
        <React.Fragment>
          <BrowserRouter>
            <Route path="/" exact component={RoomList}/>
          </BrowserRouter>
        </React.Fragment>
      );

}

export default App;
