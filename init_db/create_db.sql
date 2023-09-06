CREATE TABLE USERS (
    id  SERIAL PRIMARY KEY,
    firstname VARCHAR(30),
    lastname VARCHAR(30),
    profile_path VARCHAR(255),
    email  VARCHAR(50),
    password  VARCHAR(255),
    isDel VARCHAR(5) default 'N',
    created_at timestamp not null default CURRENT_TIMESTAMP,
    updated_at timestamp not null default current_timestamp on update current_timestamp
);
CREATE TABLE MEETING (
    id  SERIAL PRIMARY KEY,
    meeting_name VARCHAR(100),
    meeting_logo_path VARCHAR(255),
    owner_id VARCHAR(20),
    admin_code  VARCHAR(20) unique,
    common_code  VARCHAR(20) unique,
    isDel VARCHAR(5) default 'N',
    created_at timestamp not null default CURRENT_TIMESTAMP,
    updated_at timestamp not null default current_timestamp on update current_timestamp
);
CREATE TABLE MEETINGROLE (
    id  SERIAL PRIMARY KEY,
    meeting_id  VARCHAR(20),
    role_name  VARCHAR(50),
    role_type VARCHAR(10),
    isDel VARCHAR(5) default 'N',
    created_at timestamp not null default CURRENT_TIMESTAMP,
    updated_at timestamp not null default current_timestamp on update current_timestamp
);
CREATE TABLE USERMEETING (
    user_id INT,
    meeting_id INT,
    meeting_role_id INT,
    isDel VARCHAR(5) default 'N',
    created_at timestamp not null default CURRENT_TIMESTAMP,
    updated_at timestamp not null default current_timestamp on update current_timestamp
);
CREATE TABLE POST (
    id  SERIAL PRIMARY KEY,
    user_id  VARCHAR(20),
    meeting_id  INT,
    title VARCHAR(255),
    content TEXT,
    post_type VARCHAR(20),
    file_path VARCHAR(255),
    image_path VARCHAR(255),
    isAno VARCHAR(5),
    isDel VARCHAR(5) default 'N',
    created_at timestamp not null default CURRENT_TIMESTAMP,
    updated_at timestamp not null default current_timestamp on update current_timestamp
);
CREATE TABLE CHAT (
    id  SERIAL PRIMARY KEY,
    user_id  VARCHAR(20),
    post_id  INT,
    chat_id VARCHAR(20),
    content VARCHAR(255),
    isAno VARCHAR(5),
    isDel VARCHAR(5) default 'N',
    created_at timestamp not null default CURRENT_TIMESTAMP,
    updated_at timestamp not null default current_timestamp on update current_timestamp
);