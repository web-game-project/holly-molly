import React from "react";
import styled from "styled-components";
import style from "../styles/styles";
import night from "../assets/night.svg";
import day from "../assets/day.svg";

// 캐릭터
import RedSvg from "../assets/red.svg";
import OrangeSvg from "../assets/orange.svg";
import YellowSvg from "../assets/yellow.svg";
import GreenSvg from "../assets/green.svg";
import BlueSvg from "../assets/blue.svg";
import PinkSvg from "../assets/pink.svg";
import PurpleSvg from "../assets/purple.svg";

const Loading = (props) => {
  return (
    <React.Fragment>
      <Container>
        <CharacterContainer>
          <RedCharacter className="ghost1"></RedCharacter>
          <OrangeCharacter className="ghost2"></OrangeCharacter>
          <YellowCharacter className="ghost3"></YellowCharacter>
          <GreenCharacter className="ghost4"></GreenCharacter>
          <BlueCharacter className="ghost5"></BlueCharacter>
          <PinkCharacter className="ghost6"></PinkCharacter>
          <PurpleCharacter className="ghost7"></PurpleCharacter>
        </CharacterContainer>
        <Context className="text">게임이 곧 시작됩니다...</Context>
      </Container>
    </React.Fragment>
  );
};

const Container = styled.div`
  background-image: url(${night});
  width: 1020px;
  height: 720px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .ghost1 {
    animation: motion 1.2s linear 0s infinite;
    margin-bottom: 0;
  }

  .ghost2 {
    animation: motion 1.4s linear 0s infinite;
    margin-bottom: 0;
  }

  .ghost3 {
    animation: motion 1.6s linear 0s infinite;
    margin-bottom: 0;
  }

  .ghost4 {
    animation: motion 1.8s linear 0s infinite;
    margin-bottom: 0;
  }

  .ghost5 {
    animation: motion 2.0s linear 0s infinite;
    margin-bottom: 0;
  }

  .ghost6 {
    animation: motion 2.2s linear 0s infinite;
    margin-bottom: 0;
  }

  .ghost7 {
    animation: motion 2.4s linear 0s infinite;
    margin-bottom: 0;
  }

  @keyframes motion {
    0% {
      margin-bottom: 4px;
    }
    10% {
      margin-bottom: 7px;
    }
    20% {
      margin-bottom: 10px;
    }
    30% {
      margin-bottom: 12px;
    }
    40% {
      margin-bottom: 14px;
    }
    50% {
      margin-bottom: 16px;
    }
    60% {
      margin-bottom: 14px;
    }
    70% {
      margin-bottom: 12px;
    }
    80% {
      margin-bottom: 10px;
    }
    90% {
      margin-bottom: 7px;
    }
    100% {
      margin-bottom: 4px;
    }
  }
`;
const CharacterContainer = styled.div`
  width: 700px;
  height: 200px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const Context = styled.text`
  margin-top: 50px;
  font-size: 50px;
  font-family: Nanum Pen Script;
  //-webkit-text-stroke: 1px #53305e;
  //font-weight: bold;
  color: #ffffff;
  //text-shadow: 4px 4px 0px #53305e, 5px 5px 0px #53305e, 6px 6px 0px #53305e,
    7px 7px 0px #2a132e, 8px 8px 0px #2a132e, 9px 9px 0px #2a132e,
    10px 10px 0px #2a132e; //#2A132E
  margin-bottom: 50px;
`;

const RedCharacter = styled.div`
  background-image: url(${RedSvg});
  background-size: cover;
  width: 90px;
  height: 127px;
`;

const OrangeCharacter = styled.div`
  background-image: url(${OrangeSvg});
  background-size: cover;
  width: 90px;
  height: 127px;
  margin-left: 10px;
`;

const YellowCharacter = styled.div`
  background-image: url(${YellowSvg});
  background-size: cover;
  width: 90px;
  height: 127px;
  margin-left: 10px;
`;

const GreenCharacter = styled.div`
  background-image: url(${GreenSvg});
  background-size: cover;
  width: 90px;
  height: 127px;
  margin-left: 10px;
`;

const BlueCharacter = styled.div`
  background-image: url(${BlueSvg});
  background-size: cover;
  width: 90px;
  height: 127px;
  margin-left: 10px;
`;

const PinkCharacter = styled.div`
  background-image: url(${PinkSvg});
  background-size: cover;
  width: 90px;
  height: 127px;
  margin-left: 10px;
`;

const PurpleCharacter = styled.div`
  background-image: url(${PurpleSvg});
  background-size: cover;
  width: 90px;
  height: 127px;
  margin-left: 10px;
`;

export default Loading;
