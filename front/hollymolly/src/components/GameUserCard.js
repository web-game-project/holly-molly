import React from "react";
import styled from "styled-components";
import style from '../styles/styles';

import OrangeCharacter from '../assets/orange.svg'; // 일단 오렌지만 png로 쓰는 걸로
import YellowCharacter from '../assets/yellow.svg';
import GreenCharacter from '../assets/green.svg';
import BlueCharacter from '../assets/blue.svg';
import PurpleCharacter from '../assets/purple.svg';
import PinkCharacter from '../assets/pink.svg';
import RedCharacter from '../assets/red.svg';


const GameUserCard = (props) => {
   
    const {name, role, color, order, children} = props;
    
    let isEmpty = false;
    let borderColor = "" // 테두리 색 
    let characterImg = "";
    let fillColor = ""; // 배경 색 

    if (color === 'red') {

        borderColor = style.red_bg;
        characterImg = RedCharacter;
        fillColor = style.red_fill;

    }else if (color === 'orange') {

        borderColor = style.orange_bg;
        characterImg = OrangeCharacter;
        fillColor = style.orange_fill;

    }else if (color === 'yellow') {

        borderColor = style.yellow_bg;
        characterImg = YellowCharacter;
        fillColor = style.yellow_fill;

    }else if (color === 'green') {

        borderColor = style.green_bg;
        characterImg = GreenCharacter;
        fillColor = style.green_fill;

    }else if (color === 'blue') {

        borderColor = style.blue_bg;
        characterImg = BlueCharacter;
        fillColor = style.blue_fill;

    }else if (color === 'purple') {

        borderColor = style.purple_bg;
        characterImg = PurpleCharacter;
        fillColor = style.purple_fill;

    }else if (color === 'pink') {

        borderColor = style.pink_bg;
        characterImg = PinkCharacter;
        fillColor = style.pink_fill;
    }else{ // 빈칸 일때 
        borderColor = "#eeeeee";
        isEmpty = true;
        fillColor = "#eeeeee";
    }

    const styles = {
        borderColor: borderColor,
        fillColor: fillColor,
    };

      return (
        <React.Fragment>
              <Container {...styles}>
                <OrderContainer {...styles}>{order}</OrderContainer>
                <UserInfoContainer>
                    {isEmpty? <EmptyImgContainer></EmptyImgContainer> : <ImgContainer src={characterImg}></ImgContainer>}
                    <RoleNameContainer>
                        <RoleContainer {...styles}>{role}</RoleContainer>
                        {isEmpty? <EmptyNameContainer></EmptyNameContainer> : <NameContainer>{name}</NameContainer>}
                    </RoleNameContainer>
                </UserInfoContainer>
              </Container>
        </React.Fragment>
      );
  };
  
  const Container = styled.div`
    text-align: center;
    font-family: 'Jua';
    width: 150px;
    height: 73px;
    margin-bottom: 4px;
    display: flex;
    align-item: flex-start;
    justify-content: flex-start;
    margin-right: 1px;
    background-color: #FFFFFF;
    border: 5px solid;
    border-color: ${(props) => (props.borderColor)}; // border 색상 변경 
  `;

  const OrderContainer = styled.div`
    font-family: 'Jua';
    color: white;
    margin: 1px;
    width: 20px;
    height: 20px;
    background-color: ${(props) => (props.borderColor)};
    border-radius: 0.2rem;
  `;

  const UserInfoContainer = styled.div`
    display: flex;
    align-item: space-between;
    justify-content: space-between;
    font-family: 'Jua';
    width: 130px;
    height: 73px;
`;

  const ImgContainer = styled.img`
    font-family: 'Jua';
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 3px;
    width: 48px;
    height: 68px;
    //background-color: ${style.red_fill};
  `;

  const EmptyImgContainer = styled.div`
    font-family: 'Jua';
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 3px;
    width: 48px;
    height: 68px;
    background-color:#eeeeee;
  `;

  const RoleNameContainer = styled.div`
    text-align: center;
    font-family: 'Jua';
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 73px;
  `;

  const RoleContainer = styled.div`
    text-align: center;
    font-family: 'Gaegu';
    flex-direction: column;
    display: flex;
    justify-content: center;
    width: 60px;
    height: 20px;
    border-radius: 0.5rem;
    background-color: ${(props) => (props.fillColor)};
    margin-bottom: 4px;
  `;

  const NameContainer = styled.div`
    text-align: center;
    font-family: 'Jua';
    flex-direction: column;
    display: flex;
    justify-content: center;
    font-size: 10px;
    width: 75px;
    height: 30px;
  `;

  const EmptyNameContainer = styled.div`
    text-align: center;
    font-family: 'Jua';
    flex-direction: column;
    display: flex;
    justify-content: center;
    font-size: 10px;
    margin-top: 10px;
    width: 60px;
    height: 20px;
    border-radius: 0.5rem;
    background-color: #eeeeee;
  `;




  export default GameUserCard;