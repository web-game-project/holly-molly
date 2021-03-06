import React, { useState } from 'react';
import styled from 'styled-components';
import Header from '../../components/Header';
import TutorialMollyMissionComponent from '../../components/Tutorial/TutorialMollyMissionComponent';
import TutorialHollyMissionComponent from '../../components/Tutorial/TutorialHollyMissionComponent';
import {useLocation } from 'react-router';

function TutorialMission() {
    let location = useLocation();

    return (
        <Background>
            <Header goMain />
            <Container>
                {
                    location.state.role && location.state.role === "ghost" ?
                        <TutorialHollyMissionComponent role={location.state.role}/>
                    :
                        <TutorialMollyMissionComponent role={location.state.role}/>

                }
            </Container>
        </Background>
    );
}

const Background = styled.div`
    flex-direction: column;
    background-color: #180928;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Container = styled.div`
    background-color: pink;
    width: 1020px;
    height: 620px;
    display: flex;
    flex-direction: row;
    border-bottom-left-radius: 1.5rem;
    border-bottom-right-radius: 1.5rem;
    overflow: hidden;
`;
export default TutorialMission;
