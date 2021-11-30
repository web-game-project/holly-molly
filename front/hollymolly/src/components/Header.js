import React, { useState } from 'react';
import styled from 'styled-components';
import style from '../styles/styles';
import LogoSVG from '../assets/sub_logo.svg';
import tutorial_btn from '../assets/tutorial_btn.svg';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';

export default function Header({ goMain, tutorial }) {
    return (
        <Container>
            <ReactTooltip place="bottom" type="dark" />
            {goMain ? (
                <Link to="/roomlist">
                    <Logo src={LogoSVG}></Logo>
                </Link>
            ) : (
                <NonclickLogo data-tip="게임 접속 중에는 홈으로 돌아가면 되돌아오실 수 없습니다." src={LogoSVG}></NonclickLogo>
            )}
            {tutorial && (
                <Link to="/tutorial">
                    <Tutorial src={tutorial_btn} />
                </Link>
            )}
        </Container>
    );
}

const Container = styled.div`
    width: 1020px;
    flex-direction: row;
    display: flex;
    background-color: white;
    height: 100px;
    justify-content: space-between;
    align-items: center;
    border-top-left-radius: 1.5rem;
    border-top-right-radius: 1.5rem;
`;

// 로고
const Logo = styled.img`
    // background-color: ${style.skyblue};
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 75px;
    width: 450px;
    margin-top: 10px;
    &:hover {
        cursor: grab;
    }
`;

// 로고
const NonclickLogo = styled.img`
    // background-color: ${style.skyblue};
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 75px;
    width: 450px;
    margin-top: 10px;
    &:hover {
        cursor: not-allowed;
    }
`;

// 튜토리얼
const Tutorial = styled.img`
    // background-color: ${style.yellow};
    justify-content: center;
    align-items: center;
    height: 90px;
    width: 180px;
    margin-right: 30px;
    margin-top: 20px;

    &:hover {
        cursor: grab;
    }
`;
