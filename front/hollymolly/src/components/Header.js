import React, { useState } from 'react';
import styled from 'styled-components';
import style from '../styles/styles';
import LogoSVG from '../assets/sub_logo.svg';
import tutorial_btn from '../assets/tutorial_btn.svg';
import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <Container>
            <Link to="/roomlist">
                <Logo src={LogoSVG}></Logo>
            </Link>
            <Link to="/tutorial">
                <Tutorial src={tutorial_btn} />
            </Link>
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
`;

// 로고
const Logo = styled.img`
    // background-color: ${style.skyblue};
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 70px;
    width: 450px;
`;

// 튜토리얼
const Tutorial = styled.img`
    // background-color: ${style.yellow};
    justify-content: center;
    align-items: center;
    height: 80px;
    width: 200px;
    margin-right: 20px;
`;
