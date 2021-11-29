import React, { useEffect, useState } from 'react';
import style from '../styles/styles';
import styled from 'styled-components';

//이미지
import gameBackground from '../assets/night.png';

//통신
import axios from 'axios';
// 소켓
import { io, Socket } from 'socket.io-client';
import GameStart from '../screens/GameStart';

//인간, 유령
import { ReactComponent as HumanCharacter } from '../assets/human.svg';
import { ReactComponent as GhostCharacter } from '../assets/purple.svg';
import colors from '../styles/styles';

// local storage에 있는지 확인
let data = localStorage.getItem('token');
let save_token = JSON.parse(data) && JSON.parse(data).access_token;
let save_refresh_token = JSON.parse(data) && JSON.parse(data).refresh_token;
let save_user_idx = JSON.parse(data) && JSON.parse(data).user_idx;
let save_user_name = JSON.parse(data) && JSON.parse(data).user_name;

console.log('내 인덱스 : ' + save_user_idx);

function GameRoleComponent(props) {

    const ghost = "유령 친구들과 수다를 떨고 있는 Holly!\n그런데.. 동작 그만! 자꾸 생뚱맞은 이야기를 하는 너, \n대체 누구야?\n아무리 봐도 지금 우리 사이에 인간이 들어 온 것 같다!\n겁없이 유령 사이에 끼어든 인간을 찾아 혼쭐을 내주자.\n동안 유령 친구들과 함께 최선을 다해서 \n인간을 찾아보자구!";
    const human = "공포영화를 보다가 잠에 빠진 Molly!\n눈 떠보니 유령세계라고?\n을 들키지 않고 지내야 인간세계로 가는 길이 열린다.\n이 유령들 수다떠는 걸 엄청 좋아하는데\n그 사이에서 인간임을 들키지 않아야 산다.\n한 번 유령인척을 열심히 해보자구!";

    //게임 시작 5초 후, 타이머
    const [seconds, setSeconds] = useState(5);

    //let timer = 5;
    useEffect(() => {
        console.log('넘어온 게임 세트 인덱스_gamerole' + props.role);
        ///timer = props.timer;

        const countdown = setInterval(() => {
            if (parseInt(seconds) > 0) {
                setSeconds(parseInt(seconds) - 1);
            }
        }, 1000);

        return () => {clearInterval(countdown); console.log('게임 롤 초 끝')} ;
    }, [seconds]);

    return (
        <Container>
            <SubContainer>                
                {
                    props.role == "human" ?                        
                    <RoleContainer>
                            <RoleImg>
                                <HumanCharacter className="ghost" width="80" height="117" />
                            </RoleImg>
                            <RoleTitle role="human" color={style.red}> 인간 </RoleTitle>
                            
                            <RoleContent role="human">
                                {human.split("\n").map((i, key) => {
                                    console.log('key : ' + key)
                                    console.log('key i : ' + i)
                                  if (key !== 2)
                                        return <text key={key}> {i}</text>;
                                    else
                                        return <p key={key}><RoleTxt color={style.red}>3일</RoleTxt>{i}</p>;
                                })}
                            </RoleContent>
                        </RoleContainer>
                        :
                        <RoleContainer>
                            <RoleImg>
                                <GhostCharacter className="ghost" width="80" height="117" />
                            </RoleImg>
                            <RoleTitle role="ghost" color={style.blue}> 유령 </RoleTitle>
                            
                            <RoleContent role="ghost" >
                                {ghost.split("\n").map((i, key) => {
                                    console.log('key : ' + key)
                                    console.log('key i : ' + i)
                                  if (key !== 5)
                                        return <text key={key}> {i}</text>;
                                    else
                                        return <p key={key}><RoleTxt color={style.red}>3일 </RoleTxt>{i}</p>;
                                })}
                            </RoleContent>
                        </RoleContainer>
                }

                <TimerBtnContainer>{seconds}초 후 시작</TimerBtnContainer>
            </SubContainer>
        </Container>

    );
}

const Container = styled.div`
    width: 480px;
    height: 480px;
    margin-top: 60px;
    border-width: thin;
    border-radius: 10px;
    border-color: #000000;
    border-style: solid;
    background-color: #ffffff;
`;

const SubContainer = styled.div`
    width: 420px;
    height: 400px;
    padding: 5px;
    margin-left: 20px;
    margin-top: 20px;    
`;

const TimerBtnContainer = styled.div`
    width: 130px;
    height: 30px;
    margin-top: 15px;
    margin-left: 300px;   
    font-size: 20px;
    background-color: #fff;
    text-align: center;
    border-width: 1px;
    border-radius: 15px;
    border-color: #000;    
    border-style: solid;
`;

const RoleContainer = styled.div`
    width: 100%;
    font-size: 23px;
    display: flex;  
    flex-direction: column;  
    
    p{
        margin-top: 5px;
        margin-bottom: 0px;
        white-space: nowrap;
    }
`;

const RoleTxt = styled.text`
    font-size: 24px;
    color: ${(props) => (props.color)};
`;

const RoleImg = styled.div `
    width: 100%;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;

    .ghost {
        animation: motion 1.5s linear 0s infinite;
        margin-bottom: 0;
    }
`;

const RoleTitle = styled.div`
    text-align: center;   
    color: ${(props) => (props.color)};
    ${(props) => (props.role) === 'ghost' ? ` margin-top: 15px;` : ` margin-top: 20px;`}
`;

const RoleContent = styled.div`
    width: 100%;
    display: flex;     
    flex-direction: column;    
   
    ${(props) => (props.role) === 'ghost' ? `font-size: 20px; margin-top : 20px;` 
            : `font-size: 21px; margin-top : 30px; `}

    text{
        margin-top: 5px;
     }
`;

export default GameRoleComponent;