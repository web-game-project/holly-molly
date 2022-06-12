## :ghost: 프로젝트 소개 :ghost:
>...<br>
공포 영화를 보다가 잠이 든 인간. 눈을 떠보니 유령 세계에 있는데...<br>
인간은 유령들 사이에서 3일 뒤에 인간 세계로 돌아가는 길이 열린다는 사실을 알게 되고, 들키지 않고 인간세계로 돌아가기 위해 노력하는데... <br>
유령인 홀리와 인간인 몰리의 숨막히는 그림 그리기가 시작된다!<br>
...

홀리몰리는 차례로 주어진 단어에 맞는 그림을 완성하며, 홀리는 엉뚱한 그림을 그린 플레이어를 잡아내고 몰리는 홀리가 그림 그림의 단서를 통해 단어를 맞추는 그림 마피아 게임입니다. 
인터넷 접속을 통해 다른 사용자들과 함께 실시간으로 플레이할 수 있습니다. 
실시간 멀티플레이 게임을 위해 [socket.io](http://socket.io) 모듈을 사용하였고, 다음과 같은 서비스를 제공하고 있습니다. 

1. 실시간 대기실 조회
2. 실시간 방 입장 및 퇴장
3. 실시간 사용자 색 변경
4. 실시간 준비 상태 관리
5. 실시간 채팅
6. 실시간 그림 좌표 전송&받기
7. 실시간 투표
8. 실시간 투표 결과 조회
9. 실시간 게임 결과 조회
<br>

## 게임 이용 방법
- 권장 브라우저는 Chrome입니다. 다른 브라우저로 이용 시 게임이 원활하지 않을 수 있습니다.
- [친구들과 함께 게임을 즐겨보세요!](http://hollymolly.kr)
- [게임 방법은 튜토리얼을 참고해주세요!](http://hollymolly.kr/tutorial)
<br>

## :woman_technologist: 팀원
이름 | 역할 | 기능|  
---- | ---- | ----
[권혜영(DeveloperHailie)](https://github.com/DeveloperHailie) | 기획, DB 설계, API 설계, 백엔드 개발 |
[김정희(wjdgml3092)](https://github.com/wjdgml3092) | 기획, UI/UX 설계, 프론트 개발 |
[백성아(sunga0101)](https://github.com/sunga0101) | 기획, UI/UX 설계, 프론트 개발 |
[이지현(jyeon1039)](https://github.com/jyeon1039) | 기획, DB 설계, API 설계, 백엔드 개발 |
[정연희(JungYeonHee)](https://github.com/JungYeonHee) | 기획, UI/UX 설계, 프론트 개발 |
<br>

## 아키텍쳐
<img width="1000" alt="architecture" src="https://user-images.githubusercontent.com/69183944/154490816-c557f7fa-3212-468b-9162-0a06465a755c.png">

## :hammer_and_wrench: 기술 스택

### Front-end Stack
<p>
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

## Wiki
- [REST API 문서](https://github.com/web-game-project/holly-molly/wiki/REST-API)
- [SOCKET API 문서](https://github.com/web-game-project/holly-molly/wiki/Socket-Server-API)
<br>

## :star2: 주요 기능
### :loudspeaker: 실시간 채팅
그림을 그리는 동안 플레이어들은 자유롭게 채팅을 할 수 있으므로 몰리가 누구인지 토론할 수 있습니다. 채팅을 이용해 고도의 심리전을 펼쳐보세요.<br>
<br>
**<구현 방법>**
1. Client: 소켓 통신을 통해 서버에 메시지를 전달하며, “chat” 이벤트로 전달한다
2. Server: 사용자가 해당 room의 멤버인지 확인하고, socket의 같은 room에 있는 Client에게 채팅을 전송하고, “chat” 이벤트로 전달한다
3. Client: Server에서 “chat” 이벤트로부터 받은 메시지를 출력한다

※ Client 끼리 통신하지 않고, Server를 통해 통신하는 이유는 해당 room에 있는 사용자인지 확인하기 위해서입니다
<img width="1000" alt="chat" src="https://user-images.githubusercontent.com/69183944/154488481-ef7f9886-904b-46c1-b4e1-36ef2cbb9b38.png">
<br>

### :paintbrush: 실시간 그림 공유
차례가 된 플레이어가 그리고 있는 그림을 실시간으로 그림을 공유하여 게임방에 있는 모든 플레이어가 볼 수 있습니다. 이를 통해 몰리는 홀리들의 그림을 통해 비밀 단어를 유추할 수 있고, 홀리는 엉뚱한 그림을 그리는 몰리를 유추할 수 있습니다. <br>
<br>
**<구현 방법>**
1. Client: 소켓 통신을 통해 서버에 좌표와 색상 등을 전달하며, “draw” 이벤트로 전달한다
2. Server: 사용자가 해당 room의 멤버인지 확인하고, socket의 같은 room에 있는 Client에게 좌표와 색상 등을 전송하고, “draw” 이벤트로 전달한다
3. Client: Server에서 “draw” 이벤트로부터 받은 정보를 캔버스에 그린다

※ Client 끼리 통신하지 않고, Server를 통해 통신하는 이유는 해당 room에 있는 사용자인지 확인하기 위해서입니다
<img width="1000" alt="draw" src="https://user-images.githubusercontent.com/69183944/154488550-7f18d0a8-26a6-4d52-bad3-bbbf631eeeef.png">
<br>

### :stopwatch: 타이머
제한시간동안 무한한 창의적 발상과 상상력이 발휘해보세요. 너무 쉽게 그리면 몰리가 알아채고, 못 그리면 의심을 받을 수 있으니 주의하세요.<br>
<br>
**<구현 방법>**
1. Client: 소켓 통신을 통해 서버에 준비가 되었다는 신호를 보내주며, “send next turn” 이벤트로 전달한다. 그리고 보냄과 동시에 10초의 타이머를 시작한다
2-3. Server:  ROOM 1의 Client 중 한 명이라도 “send next turn” 이벤트를 발생시키면 3초의 타이머를 시작한다. 3초가 끝나면 ROOM 1의 Client들에게 “get next turn” 이벤트를 통해 “success” 를 보낸다
4. 성공적으로 “success”를 받았으므로 다음 차례로 넘어간다.
   만약 “success”를 받지 못 했다면 네트워크에 문제가 있는 것으로 간주하여 게임에서 강제 퇴장한다.
   
※ 이를 통해 각 Client의 인터넷 속도로 인해 서로의 화면이 달라질 수 있는 문제 해결한다
<img width="600" alt="timer" src="https://user-images.githubusercontent.com/69183944/154488596-3a8b1cc1-7a30-439d-8f4f-f88fd4d096a0.png">
<br>


## 개발 기간
날짜 | 내용
---- | ----
2021.07.19 ~ 2021.08.06 | 기획 (아이디어 & 요구사항 & 와이어프레임)
2021.08.07 ~ 2021.09.17 | UI/UX 디자인, API 설계, ERD 설계
2021.09.18 ~ 2021.12.06 | 개발
2021.12.01 ~ 2022.01.16 | 테스트
2022.01.17 ~ 2022.02.20 | 마케팅
2022.04.04 ~ 2022.06.10 | 버그 수정 및 리팩토링
