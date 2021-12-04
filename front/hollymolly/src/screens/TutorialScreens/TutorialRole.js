import React, { useReducer, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import MollyRole from '../../components/TutorialMollyRole';
import { useHistory, useLocation } from 'react-router';

//나중에 삭제하기
import TutorialWorldview from '../../components/TutorialWorldview';

function TutorialRole() {
    let location = useLocation();
    const [role, setRole] = useState(location.state.role);

    return (
        <Background>
            <Header goMain />
            <Container>{
                console.log('롤은? ' + role),
                role && role === "ghost" ?
                    <TutorialWorldview />
                :   
                    <MollyRole/>
                }
               {/*  <TutorialWorldview /> */}
                {/* 이어서 튜토리얼 페이지들... */}
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
export default TutorialRole;
