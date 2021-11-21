import React, { useState } from 'react';
import style from '../styles/styles';
import styled from 'styled-components';
import '../assets/font.css';
import UserVote from '../components/UserVote';

export default function VoteBoard({}) {
    return (
        <>
            <UserVote nick="수유동살쾡이" color="RED" />
            <UserVote nick="동선동살쾡이" color="ORANGE" />
            <UserVote nick="미아동살쾡이" color="YELLOW" />
            <UserVote nick="월곡동살쾡이" color="GREEN" />
            <UserVote nick="방배동살쾡이" color="BLUE" />
            <UserVote nick="진월동살쾡이" color="PURPLE" />
            <UserVote nick="봉선동살쾡이" color="PINK" />
        </>
    );
}
