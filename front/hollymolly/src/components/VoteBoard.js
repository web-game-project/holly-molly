import React, { useState } from 'react';
import style from '../styles/styles';
import styled from 'styled-components';
import '../assets/font.css';
import UserVote from '../components/UserVote';

export default function VoteBoard({}) {
    const dummy =
        // 게임방 에서 넘겨주는 임시 데이터
        {
            game_idx: 2,
            game_set_idx: 1,
            user_list: [
                { user_idx: 111, user_name: '수유동살쾡이', game_member_order: 1, user_color: 'RED' },
                { user_idx: 222, user_name: '동선동살쾡이', game_member_order: 2, user_color: 'ORANGE' },
                { user_idx: 333, user_name: '미아동살쾡이', game_member_order: 3, user_color: 'YELLOW' },
                { user_idx: 444, user_name: '월곡동살쾡이', game_member_order: 4, user_color: 'GREEN' },
                { user_idx: 555, user_name: '방배동살쾡이', game_member_order: 5, user_color: 'BLUE' },
                { user_idx: 666, user_name: '진월동살쾡이', game_member_order: 6, user_color: 'PURPLE' },
                // { user_idx: 4, user_name: '봉선동살쾡이', game_member_order: 2, user_color: 'GREEN' },
            ],
        };

    const userList =
        // 플레잉룸에서 받아오는 유저리스트
        [
            {
                user_idx: 384,
                game_member_order: '나',
                user_color: 'PINK',
                user_name: '아ㄴ녕하세요',
            },
            {
                user_idx: 385,
                game_member_order: 1,
                user_color: 'PINK',
                user_name: '지밍잉',
            },
        ];

    const beforeData = {
        // 플레잉룸에서 받아오는 전체 데이터
        game_idx: 88,
        game_set_idx: 89,
        user_list: [
            {
                user_idx: 384,
                game_member_order: '나',
                user_color: 'PINK',
                user_name: '아ㄴ녕하세요',
            },
            {
                user_idx: 385,
                game_member_order: 1,
                user_color: 'PINK',
                user_name: '지밍잉',
            },
        ],
    };

    const [data, setData] = React.useState('');

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
