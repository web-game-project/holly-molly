import React, { useEffect } from 'react';
import './App.css';

import RoomList from '../src/screens/RoomList';
import GameStart from './screens/GameStart';
import Dialog from './screens/NickNameDialog';
import { BrowserRouter, Route, Switch } from 'react-router-dom'; //React-Router import
import WaitingRoom from './screens/WaitingRoom.js';
import PlayingRoom from './screens/PlayingRoom.js';
import InGame from './components/InGameComponent';
import GameRole from './components/GameRoleComponent';

const htmlTitle = document.querySelector("title");
htmlTitle.innerHTML = '홀리몰리';

export default function App() {
    return (
        <div>
            {/* <UserTable /> */}
            <div>
                <BrowserRouter>
                    <Route exact path="/" component={GameStart} />
                    <Route path="/inputname" component={Dialog}>
                        <Dialog title="닉네임 입력" confirmText="접속" />
                    </Route>
                    <Switch>
                        <Route path="/playingroom/:name" component={PlayingRoom} />
                        <Route path="/playingroom" component={PlayingRoom} />
                    </Switch>
                    <Route path="/roomlist" component={RoomList} />
                    <Route path="/ingame" component={InGame} />
                    <Route path="/role" component={GameRole} />
                    <Switch>
                        <Route path="/waitingroom/:name" component={WaitingRoom} />
                        <Route path="/waitingroom" component={WaitingRoom} />
                    </Switch>

                </BrowserRouter>
            </div>
        </div>
    );
}
