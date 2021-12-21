import React, { useReducer, useState } from 'react';
import styled from 'styled-components';
import Header from '../../components/Header';
import MollyRole from '../../components/Tutorial/TutorialMollyRoleComponent';
import HollyRole from '../../components/Tutorial/TutorialHollyRoleComponent';

import {useLocation } from 'react-router';

function TutorialRole() {
    let location = useLocation();
    const [role, setRole] = useState(location.state.role);

    return (
        <Background>
            <Header goMain />
            <Container>{
                console.log('롤은? ' + role),
                role && role === "ghost" ?
                    <HollyRole role={role}/>
                :   
                     <MollyRole role={role}/>
                    /* <RoomList/> */
                    
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
export default TutorialRole;
