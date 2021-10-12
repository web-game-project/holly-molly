import React, { useState } from 'react';
import styled from 'styled-components';
import smallLogo from '../assets/smallLogo.png';
import tutorial from '../assets/InnerTutorialBtn.png';

const Header = () => {
    return (
        <HeaderContainer>

            <LogoContainer/>
            {/* <button/> */}
            <Tutorial/>

        </HeaderContainer>
    )
}

const HeaderContainer = styled.header`
    width: 100vw;
    height: 15vh;
    display: flex;
    flex-direction: row; 
    border-bottom: 7px dashed #EDDA2C;
`;

const LogoContainer = styled.div` 
    background-image: url(${smallLogo});
    width: 30vw;
    height: 10vh;    
    background-size: contain;
    background-repeat: no-repeat;
    margin: 10px;  
`;

const Tutorial = styled.div`
    width: 20vw;
    height: 10vh;  
    background-image: url(${tutorial});
    background-size: cover;
    background-repeat: no-repeat;
    margin-top: 10px;
    margin-left: 50vw; 
`;

export default Header