## Description

Nest.js 실습

### 환경
- Node.js 18.17.1
- Nest.js 8.2.8
- TypeORM 0.2.41
- Typescript 4.9.5
- Mysql 8.0

## Installation

```bash
$ npm install
# Mysql 세팅
# dev : 3307 포트 / prod: 3308 포트
$ docker-compose up -d
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## ERD

![Alt text](image-2.png)

## 디렉토리 구조
```
📜 .env.dev         -> DB 설정 정보 및 scret key 등 환경변수 파일
📜 .env.prod
📦init_db               -> docker-compose로 mysql 테이블 자동 생성
 ┗ 📜create_db.sql   
📦src
 ┣ 📂auth                   -> jwt 토큰, 로그인, 권한 검증 관련
 ┃ ┣ 📂guards                       
 ┃ ┃ ┣ 📜jwt-auth.guard.ts
 ┃ ┃ ┣ 📜jwt-service.guard.ts
 ┃ ┃ ┗ 📜local-service.guard.ts
 ┃ ┃ ┗ 📜role-service.guard.ts
 ┃ ┣ 📂security
 ┃ ┃ ┗ 📜payload.interface.ts
 ┃ ┣ 📂strategies                   
 ┃ ┃ ┣ 📜jwt-service.strategy.ts
 ┃ ┃ ┗ 📜local-service.strategy.ts
 ┃ ┣ 📜auth.controller.spec.ts
 ┃ ┣ 📜auth.controller.ts
 ┃ ┣ 📜auth.module.ts
 ┃ ┣ 📜auth.service.spec.ts
 ┃ ┗ 📜auth.service.ts
 ┣ 📂config                         -> config 관련
 ┃ ┗ 📜typeorm.config.ts
 ┣ 📂chat                           -> 댓글(chat) 관련 
 ┃ ┣ 📂dto
 ┃ ┣ 📜chat.controller.ts
 ┃ ┣ 📜chat.entity.ts
 ┃ ┣ 📜chat.module.ts
 ┃ ┗ 📜chat.service.ts
 ┣ 📂post                           -> 게시글(post) 관련 
 ┃ ┣ 📂dto
 ┃ ┃ ┗ 📜create-post.dto.ts
 ┃ ┣ 📜post.controller.ts
 ┃ ┣ 📜post.entity.ts
 ┃ ┣ 📜post.module.ts
 ┃ ┗ 📜post.service.ts
 ┣ 📂meeting                          -> 공간(meeting) 관련 
 ┃ ┣ 📂dto
 ┃ ┃ ┣ 📜create-param.dto.ts
 ┃ ┃ ┣ 📜create-meeting.dto.ts
 ┃ ┃ ┗ 📜join-meeting.dto.ts
 ┃ ┣ 📜meeting.controller.spec.ts
 ┃ ┣ 📜meeting.controller.ts
 ┃ ┣ 📜meeting.entity.ts
 ┃ ┣ 📜meeting.module.ts
 ┃ ┣ 📜meeting.service.spec.ts
 ┃ ┗ 📜meeting.service.ts
 ┣ 📂meetingrole                      -> 공간 역할(meetingrole) 관련 
 ┃ ┣ 📂dto
 ┃ ┃ ┗ 📜create-meetingrole.dto.ts
 ┃ ┣ 📜meetingrole.entity.ts
 ┃ ┣ 📜meetingrole.module.ts
 ┃ ┗ 📜meetingrole.service.ts
 ┣ 📂user                           -> 유저 (users) 관련 
 ┃ ┣ 📂dto
 ┃ ┃ ┣ 📜create-user.dto.ts
 ┃ ┃ ┣ 📜update-param.dto.ts
 ┃ ┃ ┗ 📜update-user.dto.ts
 ┃ ┣ 📜user.controller.spec.ts
 ┃ ┣ 📜user.controller.ts
 ┃ ┣ 📜user.entity.ts
 ┃ ┣ 📜user.module.ts
 ┃ ┣ 📜user.service.spec.ts
 ┃ ┗ 📜user.service.ts
 ┣ 📂usermeeting             -> 유저 공간(usermeeting) bridge 테이블 관련 
 ┃ ┣ 📂dto
 ┃ ┃ ┗ 📜create-usermeeting.dto.ts
 ┃ ┣ 📜usermeeting.entity.ts
 ┃ ┣ 📜usermeeting.module.ts
 ┃ ┣ 📜usermeeting.service.spec.ts
 ┃ ┗ 📜usermeeting.service.ts
 ┣ 📂utils                          
 ┃ ┗ 📂vaildate
 ┃ ┃ ┗ 📜is-in-array.ts             -> 유효성 검사를 위한 custom 데코레이터 생성
 ┣ 📜app.controller.spec.ts
 ┣ 📜app.controller.ts
 ┣ 📜app.module.ts
 ┣ 📜app.service.ts
 ┗ 📜main.ts
```

## API 정의
1. [Auth API](#auth-api)
    - [로그인](#login)
2. [Users API](#users-api)
    - [유저생성](#create-user)
    - [유저조회](#get-user)
    - [내정보조회](#get-user)
    - [내정보수정](#get-user)
3. [Meeting API](#meeting-apis)
    - [공간생성](#create-user)
    - [참여코드조회](#get-user)
    - [공간참여](#get-user)
    - [내공간조회](#get-user)
    - [역할삭제](#get-user)
    - [공간삭제](#get-user)
4. [Post API](#meeting-apis)
    - [게시글생성](#create-user)
    - [게시글조회](#get-user)

---

## Auth API

### 로그인
이메일과 비밀번호로 로그인을 한다.
성공시 토큰을 제공받고 이후 API를 토큰을 통해 인증할 수 있따.

**Endpoint:**  
`POST /auth/login`

**Request Body:**
```json
{
    "email": "ehwnghks@gmail.com",
    "password": "12345ehE!"
}
```
## Users API

### 유저 생성
유저를 생성한다.

**Endpoint:**  
`POST /user`

**Request Body:**
```json
{
  "email": "example@email.com",
  "firstname": "John",
  "lastname": "Doe",
  "password": "YourSecurePassword!"
}
```
-----
### 유저 조회
유저의 id 값으로 이메일 정보를 제외한 정보를 가져온다.

**Endpoint:**  
`GET /user/:id`

-----
### 내 정보 조회
로그인을 통해 얻은 유저의 id 값으로 정보를 조회한다.

**Endpoint:**  
`GET /user/myprofile`

------
### 내 정보 수정
이메일을 제외한 내 정보를 수정한다.

**Endpoint:**  
`PUT /user/myprofile`

**Request Body:**
```json
{
    "firstname" : "jooohwan"
}
```
## Meeting API

### 미팅룸 생성
미팅룸을 생성한다.

**Endpoint:**  
`POST /meeting`

**Request Body:**
```json
{
    "meeting_name" : "학원",
    "admin_array" : ["강사","원장","부원장"],
    "common_array" : ["학부보","학생"],
    "owner_role" : "강사"
}
```
------
### 참여 코드 조회
미팅룸마다 가지고 있는 참여코드로 미팅룸 정보를 조회한다.

참여코드가 관리자면 미팅룸 정보와 관리자 권한 정보,

참여코드가 참여자면 미팅룸 정보와 참여자 권한 정보를 가져온다.

**Endpoint:**  
`GET /meeting/:joincode`

------
### 공간 참여
참여코드와 권한정보로 공간에 참여한다.

**Endpoint:**  
`POST /meeting/join`

**Request Body:**
```json
{
    "joincode":"ZZxJyzrr",
    "role_name" : "원장"
}
```
------
### 내 미팅룸 조회
로그인한 유저 id가 참여하고 있는 미팅룸 정보와 권한 정보를 가져온다.

**Endpoint:**  
`GET /meeting/mymeeting`

------
### 미팅룸 권한 삭제
미팅룸 권한 id로 isDel 값을 'Y'로 수정한다. (soft delete)

**Endpoint:**  
`DELETE /meeting/role`

**Request Body:**
```json
{
    "meeting_id" : 1,
    "role_id" : 3
}
```

------
### 미팅룸 삭제
미팅룸 id로 isDel 값을 'Y'로 수정한다. (soft delete)

**Endpoint:**  
`DELETE /meeting`

**Request Body:**
```json
{
    "meeting_id" : 1
}
```
------
## Post API

### 게시글 생성
현재 로그인 한 유저가 해당 미팅룸에 속해있는지 확인하고

미팅룸에 속해있는 참여자 혹은 관리자라면 게시글 작성을 할 수 있다.

미팅룸의 관리자면 공지, 질문을 작성할 수 있고, 참여자일 경우 질문만 작성할 수 있다.

단, 참여자만 익명으로 작성할 수 있다.

**Endpoint:**  
`POST /post`

**Request Body:**
```json
{
    "meeting_id" :3,
    "title": "안녕하세요 반갑습니다.44444",
    "content": "dddddd",
    "post_type" : "Notice",
    "isAno" : "N",
    "file_path" : ["11.txt","22.txt"],
    "image_path" : ["123.png"]
}
```
--------

### 게시글 조회
현재 로그인 한 유저가 해당 미팅룸에 속해있는지 확인하고

미팅룸에 속해있는 참여자 혹은 관리자라면 게시글을 조회한다.

관리자라면 모든 게시물의 글쓴이를 확인할 수 있고, 

참여자는 본인이 아니면 익명 게시글의 글쓴이를 볼 수 없다.

**Endpoint:**  
`GET /post/:id`

--------