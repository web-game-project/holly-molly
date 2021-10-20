import React, { useEffect } from 'react';
import style from './styles/styles.js';

import io from 'socket.io-client';
import './App.css';

import RoomList from '../src/screens/RoomList';
import RoomSearchBar from '../src/components/RoomSearchBar';
import Room from '../src/components/Room';
import GameStart from './screens/GameStart';
import Dialog from './screens/NickNameDialog';
import { BrowserRouter, Route } from 'react-router-dom'; //React-Router import
import UserCard from './components/UserCard.js';
import WaitingRoom from './screens/WaitingRoom.js';

function App() {
    useEffect(() => {
        console.log('통신 시작!');
        const socket = io('http://3.17.55.178:3002/', {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkeCI6NywidXNlcl9uYW1lIjoidGVzdCIsImlhdCI6MTYzMjgzMzAxN30.G1ECMSLaD4UpCo6uc-k6VRv7CxXY0LU_I5M2WZPYGug',
        });

        socket.on('connect', () => {
            console.log('connection server');
        });
    }, []);

    return (
        <div>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <UserCard id={4} nickname="돈암동 민혁이" color="yellow" />
                        </td>
                        <td>
                            <UserCard id={2} nickname="이태원 돈까스" color="purple" ready />
                        </td>
                        <td>
                            <UserCard id={3} nickname="신사동 양꼬치" color="green" ready />
                        </td>

                        <td>
                            <UserCard id={7} nickname="방배동 살쾡이" color="red" ready />
                        </td>
                        <td>
                            <UserCard id={5} nickname="수유동 불주먹" color="pink" />
                        </td>
                        <td>
                            <UserCard id={6} nickname="용두동 쭈꾸미" color="blue" />
                        </td>
                        <td>
                            <UserCard id={1} nickname="인계동 껍데기" color="orange" ready />
                        </td>
                    </tr>
                </tbody>
            </table>
            <div>
                <BrowserRouter>
                    <Route path="/">
                        <GameStart />
                    </Route>
                    <Route path="/" exact component={RoomList} />
                    <Route path="/InputName">
                        <Dialog title="닉네임 입력" confirmText="접속" />
                    </Route>
                </BrowserRouter>
            </div>
        </div>
    );
}

export default App;
