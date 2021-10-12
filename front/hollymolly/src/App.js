import React, { useState, useEffect } from 'react';
import './App.css';
import GameStart from './screens/GameStart';
import Dialog from './screens/NickNameDialog';
import { BrowserRouter, Route } from 'react-router-dom'; //React-Router import
import Header from './components/HeaderComponent';
import io from "socket.io-client";

function App() {

    useEffect(() => {
        console.log("통신 시작!"); 
        const socket = io("http://3.17.55.178:3002/", {
            token : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkeCI6NywidXNlcl9uYW1lIjoidGVzdCIsImlhdCI6MTYzMjgzMzAxN30.G1ECMSLaD4UpCo6uc-k6VRv7CxXY0LU_I5M2WZPYGug'
        });

        socket.on("connect", () => { console.log("connection server"); });
      
}, []);
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
    return (        
        <div>
        <BrowserRouter>
            <Route path="/">
                <GameStart />
            </Route>

            <Route path="/InputName">
                <Dialog title="닉네임 입력" confirmText="접속" />
            </Route>

        </BrowserRouter>
        </div>  
    );
}

export default App;
