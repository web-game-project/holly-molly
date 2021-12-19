import React from 'react';
import './App.css';
import { ConnectedRouter } from "connected-react-router";
import { history } from "./redux/configureStore";
import { io } from 'socket.io-client';

import RoomList from '../src/screens/RoomList';
import GameStart from './screens/GameStart';
import { BrowserRouter, Route, Switch } from 'react-router-dom'; //React-Router import
import WaitingRoom from './screens/WaitingRoom.js';
import PlayingRoom from './screens/PlayingRoom.js';
import Tutorial from './screens/TutorialScreens/TutorialStart.js';
import TutorialRole from './screens/TutorialScreens/TutorialRole.js';
import PlayingResult from './screens/PlayingResult';
import ModalNickName from './components/ModalNickName';
import PlayingVote from './screens/PlayingVote';
import TutorialRommList from './screens/TutorialScreens/TutorialRoomList';
import TutorialWaitingRoom from './screens/TutorialScreens/TutorialWaitingRoom';
import TutorialNickName from './screens/TutorialScreens/TutorialNickName';
import TutorialDraw from './screens/TutorialScreens/TutoialDraw';
import TutorialVote from './screens/TutorialScreens/TutorialVote';
import TutorialMollyVoteResult from './screens/TutorialScreens/TutorialMollyVoteResult';
import TutorialMission from './screens/TutorialScreens/TutorialMission';
import TutorialMiddleVoteResult from './screens/TutorialScreens/TutorialMiddleVoteResult';
import TutorialFinalVoteResult from './screens/TutorialScreens/TutorialFinalVoteResult';
import TutorialHollyVoteResult from './screens/TutorialScreens/TutorialHollyVoteResult';

//토큰 만료 확인
import RefreshVerification from './server/RefreshVerification';

const htmlTitle = document.querySelector('title');
htmlTitle.innerHTML = '홀리몰리';

let data = localStorage.getItem('token');
let save_token = JSON.parse(data) && JSON.parse(data).access_token;
      
//console.log('app.js에 data 가 있냐?' + data);
//data && RefreshVerification.verification();

const socket = io('http://3.17.55.178:3002/', {
              auth: {
                  token: save_token,
              },
              transports: ['websocket']
});

 socket.on('connect', () => {
  //console.log("app.js");
  //console.log(socket);
});

socket.on('disconnect', (reason) => {
    socket.connect();
});

export default function App() {

    return (
        <div>
            <div>
                <BrowserRouter>
                    <ConnectedRouter history={history}>
                    
                    {/* 튜토리얼 페이지 Route */}
                    <Route path="/tutorial" component={Tutorial}></Route>
                    <Route path="/nicknameTutorial" component={TutorialNickName}></Route>
                    <Route path="/roleTutorial" component={TutorialRole}></Route>
                    <Route path="/roomlistTutorial" component={TutorialRommList}></Route>
                    <Route path="/waitingroomTutorial" component={TutorialWaitingRoom}></Route>
                    <Route path="/drawTutorial" component={TutorialDraw}></Route>
                    <Route path="/voteTutorial" component={TutorialVote}></Route>
                    <Route path="/MolltvoteresultTutorial" component={TutorialMollyVoteResult}></Route>
                    <Route path="/missionTutorial" component={TutorialMission}></Route>
                    <Route path="/middleresultTutorial" component={TutorialMiddleVoteResult}></Route>
                    <Route path="/finalresultTutorial" component={TutorialFinalVoteResult}></Route>
                    {/* <Route path="/openmollyTutorial" component={}></Route> */}
                    <Route path="/HollyvoteresultTutorial" component={TutorialHollyVoteResult}></Route> 

                    <Route path="/nickname" component={ModalNickName}></Route>
                    <Route exact path="/" component={GameStart} />
                    
                    <Route 
                        path="/roomlist" 
                        render={(props) => <RoomList socket={socket} {...props} />}/>
                    
                    <Switch>
                        <Route 
                            path="/waitingroom/:name" 
                            render={(props) => <WaitingRoom socket={socket} {...props} />}/>
                        <Route 
                            path="/waitingroom" 
                            render={(props) => <WaitingRoom socket={socket} {...props} />}/>
                    </Switch>

                    <Switch>
                        <Route 
                            path="/playingroom/:name" 
                            render={(props) => <PlayingRoom socket={socket} {...props} />}/>
                        <Route 
                            path="/playingroom" 
                            render={(props) => <PlayingRoom socket={socket} {...props} />}/>
                    </Switch>
                    
                    <Switch>
                        <Route 
                            path="/playingvote/:name" 
                            render={(props) => <PlayingVote socket={socket} {...props} />}/>
                        <Route 
                            path="/playingvote" 
                            render={(props) => <PlayingVote socket={socket} {...props} />}/>
                    </Switch>

                    <Switch>
                        <Route 
                            path="/playingresult/:name" 
                            render={(props) => <PlayingResult socket={socket} {...props} />}/>
                        <Route 
                            path="/playingresult" 
                            render={(props) => <PlayingResult socket={socket} {...props} />}/>
                    </Switch>
         
                  </ConnectedRouter>
                </BrowserRouter>
            </div>
        </div>
    );
}
