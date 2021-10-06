import React, { useState, useRef } from 'react';
import style from '../styles/styles';
import styled from 'styled-components';

function Filter() {
    return (
        <Container>
            <Title>--- Filter ---</Title>
            <Line></Line>
            <hori>
                <Context>hihi</Context>
                <input type="checkbox" />
            </hori>

            <hori>
                <Context>hihi</Context>
                <input type="checkbox" />
            </hori>

            <hori>
                <Context>hihi</Context>
                <input type="checkbox" />
            </hori>
            <Line></Line>
            <hori>
                <Context>hihi</Context>
                <input type="checkbox" />
            </hori>

            <hori>
                <Context>hihi</Context>
                <input type="checkbox" />
            </hori>
            <Line></Line>
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
    width: 135px;
    height: 350px;
    background-color: #8676c7;
    padding: 16px;
    margin: 20px auto;
    border-radius: 15px;
    border: 1px solid #8676c7;
    box-shadow: 10px 10px 20px #808080;
`;

const Title = styled.h3`
    color: black;
    text-align: center;
    -webkit-text-stroke: 1px #fff;
`;

const Line = styled.hr`
    margin: 16px 0px;
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
