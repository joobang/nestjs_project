## Description

Dojoohwan 클라썸 과제

### 환경
- Node.js 18.17.1
- Nest.js 8.2.8
- TypeORM 0.2.41
- Typescript 4.9.5
- Mysql 8.0

dojoohwan_assign/classum.postman_collection.json 파일

Postman imort 후에 API 테스트

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
 ┣ 📂space                          -> 공간(space) 관련 
 ┃ ┣ 📂dto
 ┃ ┃ ┣ 📜create-param.dto.ts
 ┃ ┃ ┣ 📜create-space.dto.ts
 ┃ ┃ ┗ 📜join-space.dto.ts
 ┃ ┣ 📜space.controller.spec.ts
 ┃ ┣ 📜space.controller.ts
 ┃ ┣ 📜space.entity.ts
 ┃ ┣ 📜space.module.ts
 ┃ ┣ 📜space.service.spec.ts
 ┃ ┗ 📜space.service.ts
 ┣ 📂spacerole                      -> 공간 역할(spacerole) 관련 
 ┃ ┣ 📂dto
 ┃ ┃ ┗ 📜create-spacerole.dto.ts
 ┃ ┣ 📜spacerole.entity.ts
 ┃ ┣ 📜spacerole.module.ts
 ┃ ┗ 📜spacerole.service.ts
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
 ┣ 📂userspace             -> 유저 공간(userspace) bridge 테이블 관련 
 ┃ ┣ 📂dto
 ┃ ┃ ┗ 📜create-userspace.dto.ts
 ┃ ┣ 📜userspace.entity.ts
 ┃ ┣ 📜userspace.module.ts
 ┃ ┣ 📜userspace.service.spec.ts
 ┃ ┗ 📜userspace.service.ts
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
3. [Space API](#space-apis)
    - [공간생성](#create-user)
    - [참여코드조회](#get-user)
    - [공간참여](#get-user)
    - [내공간조회](#get-user)
    - [역할삭제](#get-user)
    - [공간삭제](#get-user)
4. [Post API](#space-apis)
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
## Space API

### 공간 생성
공간을 생성한다.

**Endpoint:**  
`POST /space`

**Request Body:**
```json
{
    "space_name" : "학원",
    "admin_array" : ["강사","원장","부원장"],
    "common_array" : ["학부보","학생"],
    "owner_role" : "강사"
}
```
------
### 참여 코드 조회
공간마다 가지고 있는 참여코드로 공간정보를 조회한다.

참여코드가 관리자면 공간정보와 관리자 권한 정보,

참여코드가 참여자면 공간정보와 참여자 권한 정보를 가져온다.

**Endpoint:**  
`GET /space/:joincode`

------
### 공간 참여
참여코드와 권한정보로 공간에 참여한다.

**Endpoint:**  
`POST /space/join`

**Request Body:**
```json
{
    "joincode":"ZZxJyzrr",
    "role_name" : "원장"
}
```
------
### 내 공간 조회
로그인한 유저 id가 참여하고 있는 공간정보와 권한 정보를 가져온다.

**Endpoint:**  
`GET /space/myspace`

------
### 공간 권한 삭제
공간 권한 id로 isDel 값을 'Y'로 수정한다. (soft delete)

**Endpoint:**  
`DELETE /space/role`

**Request Body:**
```json
{
    "space_id" : 1,
    "role_id" : 3
}
```

------
### 공간 삭제
공간 id로 isDel 값을 'Y'로 수정한다. (soft delete)

**Endpoint:**  
`DELETE /space`

**Request Body:**
```json
{
    "space_id" : 1
}
```
------
## Post API

### 게시글 생성
현재 로그인 한 유저가 해당 공간에 속해있는지 확인하고

공간에 속해있는 참여자 혹은 관리자라면 게시글 작성을 할 수 있다.

**Endpoint:**  
`POST /post`

**Request Body:**
```json
{
    "space_id" :3,
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
현재 로그인 한 유저가 해당 공간에 속해있는지 확인하고

공간에 속해있는 참여자 혹은 관리자라면 게시글을 조회한다.

**Endpoint:**  
`GET /post/:id`

--------