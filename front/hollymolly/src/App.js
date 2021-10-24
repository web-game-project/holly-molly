import React, { useEffect } from 'react';
import style from './styles/styles.js';

import io from 'socket.io-client';
import './App.css';

import RoomList from '../src/screens/RoomList';
import RoomSearchBar from '../src/components/RoomSearchBar';
import Room from '../src/components/Room';
import Chatting from '../src/components/Chatting';
import GameStart from './screens/GameStart';
import Dialog from './screens/NickNameDialog';

import HeaderComponent from '../src/components/HeaderComponent';
import { BrowserRouter, Route } from 'react-router-dom'; //React-Router import
import WaitingRoom from './screens/WaitingRoom.js';
import UserTable from './components/UserTable.js';

function App() {
    useEffect(() => {
        console.log('통신 시작!');
        const socket = io('http://3.17.55.178:3002/', {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkeCI6NywidXNlcl9uYW1lIjoidGVzdCIsImlhdCI6MTYzMjgzMzAxN30.G1ECMSLaD4UpCo6uc-k6VRv7CxXY0LU_I5M2WZPYGug',
        });
    }, []);

    return (
        <div>
            {/* 유저 컴포넌트 테이블 */}
            <UserTable />

            <div>
                <BrowserRouter>
                    <Route path="/">
                        <GameStart />
                    </Route>
                    <Route path="/" exact component={RoomList} />
                    <Route path="/InputName">
                        <Dialog title="닉네임 입력" confirmText="접속" />
                    </Route>
                    <Route path="/" exact component={Chatting} />
                    <Route path="/" exact component={WaitingRoom} />
                </BrowserRouter>
            </div>
        </div>
    );
}

export default App;
