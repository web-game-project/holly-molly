import React, { useEffect } from 'react';
import style from './styles/styles.js';
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

// 소켓
import { io } from 'socket.io-client';
import axios from 'axios';

export default function App() {
    return (
        <div>
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
