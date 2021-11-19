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

// local storage에 있는지 확인
let data = localStorage.getItem('token');
let save_token = JSON.parse(data) && JSON.parse(data).access_token;
let save_refresh_token = JSON.parse(data) && JSON.parse(data).refresh_token;
let save_user_idx = JSON.parse(data) && JSON.parse(data).user_idx;
let save_user_name = JSON.parse(data) && JSON.parse(data).user_name;

console.log('내 인덱스 : ' + save_user_idx);

function GameRoleComponent(props) {

    const ghost = "\n홀리세계에 원래 살고 있던 외로운 홀리입니다.\n현재 홀리세계에 유령의 탈을 쓰고 \n살고 있는 인간이 있습니다.\n그 인간은 3일 뒤에 본인의 세계로 돌아갑니다.\n함께 친구로서, 같이 살고 싶다면 \n그 인간을 꼭 찾으세요!!!\n당신은 할 수 있습니다. 권투를 빕니다 *^3^*";
    const human = "\n당신은 홀리세계에 어쩌다보니\n 들어오게된 몰리입니다.\n현재 외로운 홀리들은 당신을 찾고 있어요.\n홀리들은 당신이 인간, 몰리인지 몰라요.\n3일 뒤면 당신의 세계로 돌아갈 수 있어요.\n그 3일 동안 홀리인척하면서 살아가면 된답니다.\n당신은 할 수 있습니다. 권투를 빕니다 *^3^*";


    useEffect(() => {
        console.log('넘어온 게임 세트 인덱스_gamerole' + props.role);
        /* var gameSetIdx = props.index;

        if (gameSetIdx != '') {
            const reqHeaders = {
                headers: {
                    authorization:
                        'Bearer ' + save_token,
                },
            };
            const restURL = BaseURL + 'game/member/' + gameSetIdx;

            console.log('url : ' + restURL);

            axios
                .get(
                    restURL,
                    reqHeaders
                )
                .then(function (response) {
                    alert('rest 키워드' + response.data.keyword + ', 역할' + response.data.user_role);
                    setRole(response.data.user_role);
                })
                .catch(function (error) {
                    alert('error information : ' + error.message);
                });
        } */
    }, []);

    return (
        <Container>
            <TxtContainer>
                    {
                        props.role == "human" ?
                        <HeadLine>
                                당신은 <RoleTxt ishuman="yes">"인간"</RoleTxt>입니다.
                                {human.split("\n").map((i, key) => {
                                    if (key === 3 || key === 5)
                                        return <Content key={key}><br></br>{i}</Content>;
                                    else
                                        return <Content key={key}>{i}</Content>;
                                })}
                           </HeadLine>
                            :
                            <HeadLine>
                                당신은 <RoleTxt ishuman="no"> "유령" </RoleTxt>입니다.
                                {ghost.split("\n").map((i, key) => {
                                    if (key === 3 || key === 5)
                                        return <Content key={key}><br></br>{i}</Content>;
                                    else
                                        return <Content key={key}>{i}</Content>;
                                })}
                            </HeadLine>
                    }
            </TxtContainer>
        </Container>

    );
}

const Container = styled.div`
    width: 450px;
    height: 450px;
    margin-top: 85px;
    border-width: thin;
    border-radius: 10px;
    border-color: #000000;
    border-style: solid;
`;

const TxtContainer = styled.div`
    width: 420px;
    height: 400px;
    padding: 5px;
    margin-left: 20px;
    margin-top: 20px;
`;

const HeadLine = styled.div`
    width: 100%;
    font-size: 23px;
    display: flex;  
    flex-direction: column;
    //align-items: center;
    //justify-content: center;
`;

const RoleTxt = styled.div`
    font-size: 26px;
    ${(props) =>
        props.ishuman == 'yes' ? `color: #FF0000;` : 
        props.ishuman == 'no' ? `color: #0100FF;` : `color: #000000`}
`;
const Content = styled.div`
    width: 100%;
    display: flex;    
    font-size: 23px;
`;
export default GameRoleComponent;