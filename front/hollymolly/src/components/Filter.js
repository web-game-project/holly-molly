import React, { useState, useRef, useCallback } from 'react';
import style from '../styles/styles';
import styled from 'styled-components';
import FilterContext from './FliterContext';

function Filter() {
    return (
        <Container>
            <Title>--- Filter ---</Title>
            <FilterContext text={'Easy Mode'} />
            <FilterContext text={'Hard Mode'} />
            <Line></Line>
            <FilterContext text={'4 people'} />
            <FilterContext text={'5 people'} />
            <FilterContext text={'6 people'} />
            <Line></Line>
            <FilterContext text={'Waiting'} />
            <Line></Line>
            {/* 전체 선택일 때는 텍스트 색상 다르기 때문에 all props 파라미터 넣어줌 */}
            <FilterContext text={'Check All'} all />
        </Container>
    );
}

export default Filter;
const Icon = styled.svg`
    fill: none;
    stroke: white;
    stroke-width: 2px;
`;
const Container = styled.div`
    width: 130px;
    height: 300px;
    background-color: #8676c7;
    padding: 0px 10px;
    margin: 10px auto;
    border-radius: 15px;
    border: 1px solid #8676c7;
    box-shadow: 10px 10px 20px #808080;
    overflow: hidden;
`;

const Title = styled.h4`
    color: white;
    text-align: center;
    // -webkit-text-stroke: 1px #fff;
    font-weight: bolder;
    margin-top: 10px;
`;

const Line = styled.hr`
    margin: 12px 0px;
    border: 0.1px solid #ddd;
    border-color: rgba(255, 255, 255, 0.1);
`;

const Context = styled.text`
    color: white;
    font-size: 20px;
    font-weight: bolder;
    -webkit-text-stroke: 1px #4d1596;
`;

const hori = styled.div``;
