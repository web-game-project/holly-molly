## :ghost: 프로젝트 소개 :ghost:
성신여자대학교 정보시스템공학과 학생 5명이 진행한 사이드 프로젝트, 다중 사용자가 실시간으로 웹으로 게임을 할 수 있는 프로젝트입니다.
Socket.io 모듈를 활용하여 실시간 채팅, 실시간 좌표 전송, 사용자 색 변경 등을 구현했습니다. <br>
[게임을 진행해보고 싶으시다면 여기를 눌러주세요](http://hollymolly.kr)<br>
<br>

## :woman_technologist: 팀원
- [김정희(wjdgml3092)](https://github.com/wjdgml3092)
- [백성아(sunga0101)](https://github.com/sunga0101)
- [정연희(JungYeonHee)](https://github.com/JungYeonHee)
- [권혜영(DeveloperHailie)](https://github.com/DeveloperHailie)
- [이지현(jyeon1039)](https://github.com/jyeon1039)
<br>

## :hammer_and_wrench: 기술 스택
### Front-end Stack
<p>
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=HTML5&logoColor=white"/> 
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=CSS3&logoColor=white"/> 
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=JavaScript&logoColor=white"/> 
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat-squar&logo=react&logoColor=black"> 
  <img src="https://img.shields.io/badge/AWS EC2-232F3E?style=flat-square&logo=Amazon AWS&logoColor=white"/>
  <img src="https://img.shields.io/badge/Ubuntu-E95420?style=flat-square&logo=ubuntu&logoColor=white"/> 	
</p>

### Back-end Stack
<p> 
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=JavaScript&logoColor=white"/> 
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white"/> 
  <img src="https://img.shields.io/badge/AWS EC2-232F3E?style=flat-square&logo=Amazon AWS&logoColor=white"/>
  <img src="https://img.shields.io/badge/AWS RDS-232F3E?style=flat-square&logo=Amazon AWS&logoColor=white"/>
  <img src="https://img.shields.io/badge/Ubuntu-E95420?style=flat-square&logo=ubuntu&logoColor=white"/> 	
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=MySQL&logoColor=white"/> 
</p>

### Cowork Tools
<p>
  <img src="https://img.shields.io/badge/Figma-F24E1E?style=flat-square&logo=Figma&logoColor=white"/>
  <img src="https://img.shields.io/badge/Postman-FF6C37?style=flat-square&logo=Postman&logoColor=white"/>
  <img src="https://img.shields.io/badge/Notion-000000?style=flat-square&logo=Notion&logoColor=white"/>
  <img src="https://img.shields.io/badge/Slack-4A154B?style=flat-square&logo=slack&logoColor=white">
  <img src="https://img.shields.io/badge/Github-181717?style=flat-square&logo=github&logoColor=white">
</p>
<br>

## :memo: 화면 흐름도<br>
![Untitled](https://user-images.githubusercontent.com/69183944/147040534-0dfd867d-5c3e-4b4e-bb9a-41c52afb17e0.png)
<br><br>

## :star2: 주요 기능
#### :stopwatch: 타이머
- 클라이언트에서 타이머를 사용하여 자신의 차례에만 그림을 그릴 수 있게 권한 부여
- 서버에서 타이머를 사용하여 모든 사용자가 준비가 되었는지 확인 (어떤 한 사용자의 네트워크 문제로 인하여 다른 플레이어들의 게임을 방해하지 않기 위한 체크 과정)

#### :paintbrush: 실시간 그림 그리기
- socket.io 의 rooms 기능을 사용하여 같은 방에 있는 플레이어들에게 실시간으로 그림 좌표를 공유하며, 이를 통해 모든 플레이어의 화면에 그림 그리기

#### :loudspeaker: 채팅
- socket.io 의 rooms 기능을 사용하여 같은 방에 있는 플레이어들과 실시간 채팅
- 채팅의 글씨는 플레이어의 색깔에 맞게 출력

<br>
