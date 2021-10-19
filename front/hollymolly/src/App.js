import React, { useEffect } from 'react';
import style from './styles/styles.js';
import CreateRoom from './components/CreateRoom';
import Filter from './components/Filter';
import CheckBox from './components/CheckBox';
import io from 'socket.io-client';
import './App.css';

import RoomList from "../src/screens/RoomList";
import RoomSearchBar from "../src/components/RoomSearchBar";
import Room from "../src/components/Room";
import GameStart from './screens/GameStart';
import Dialog from './screens/NickNameDialog';
import { BrowserRouter, Route } from 'react-router-dom'; //React-Router import


function App() {
     /*   useEffect(() => {
            console.log("통신 시작!"); 
            const socket = io("http://3.17.55.178:3002/", {
                token : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkeCI6NywidXNlcl9uYW1lIjoidGVzdCIsImlhdCI6MTYzMjgzMzAxN30.G1ECMSLaD4UpCo6uc-k6VRv7CxXY0LU_I5M2WZPYGug'
            });
    
            socket.on("connect", () => { console.log("connection server"); });
          
    }, []); */
        
    return (
        
        // <div>
        //     {/* <button onclick={() => alert('Click!')}>방 만들기</button> */}
        //     <CreateRoom />
        //     <Filter />
        //     <CheckBox />
        //     {/* <button onclick={hi}>방 만들기</button> */}

        //     <div>
        <BrowserRouter>
            {/* <Route path="/">
                <GameStart />
            </Route>

            <Route path="/InputName">
                <Dialog title="닉네임 입력" confirmText="접속" />
            </Route> */}

            <Route path="/" exact component={RoomList}/>
        </BrowserRouter>
        // </div>  
        // </div>

    );

}

export default App;
