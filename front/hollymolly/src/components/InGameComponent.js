import React, { useEffect } from 'react';
import style from '../styles/styles';
import styled from 'styled-components';

//이미지
import gameBackground from '../assets/night.png';
//유저카드
import UserTable from '../components/UserTable.js';
//통신
import axios from 'axios';
// 소켓
import { io } from 'socket.io-client';

function InGameComponent() {

    return (
        <Backgroundimg>

            <PointTxt>
                <p>마피아를 지목해서 </p> <p color='#FF0000'>투표</p> <p>해주세요</p> 
            </PointTxt>

            <UserDiv>
                <UserTable
                    style={{
                        display: 'inline-block',
                        alignSelf: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                    }}
                />
            </UserDiv>

        </Backgroundimg>
    );
}

const Backgroundimg = styled.div`
    background-image: url(${gameBackground});
    width: 1020px;
    height: 720px;
    background-size: contain;
    background-position: center center;
    background-repeat: no-repeat;
`;

const UserDiv = styled.div`
    width: 100%;
    height: 390px;
    margin: 180px 190px;
    display: inline-block;
    overflow: hidden;
    align-items: center;
    justify-content: center;
    text-align: center;
`;

const PointTxt = styled.div`
width: 100%;
display: flex;
flex-direction: row;
  align-items: center;
  justify-content: center;
p{
  font-size: 48px;  
  margin: 0px;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  ${(props) => props.color === '#FF0000' ? `color: ${props.color};`:  `color: #fff;` }
}
`;
export default InGameComponent;