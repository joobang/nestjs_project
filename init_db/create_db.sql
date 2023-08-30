CREATE TABLE USER (
    id  SERIAL PRIMARY KEY,
    firstname VARCHAR(30),
    lastname VARCHAR(30),
    profile_path VARCHAR(50),
    email  VARCHAR(50),
    password  VARCHAR(50),
    isDel VARCHAR(10),
    created_at datetime not null default CURRENT_TIMESTAMP,
    updated_at timestamp not null default current_timestamp on update current_timestamp
);
CREATE TABLE SPACE (
    id  SERIAL PRIMARY KEY,
    space_name VARCHAR(50),
    space_logo_path VARCHAR(50),
    owner_id VARCHAR(20),
    admin_code  VARCHAR(50),
    common_code  VARCHAR(50),
    isDel VARCHAR(10),
    created_at datetime not null default CURRENT_TIMESTAMP,
    updated_at timestamp not null default current_timestamp on update current_timestamp
);
CREATE TABLE SPACEROLE (
    id  SERIAL PRIMARY KEY,
    space_id  VARCHAR(50),
    role_name  VARCHAR(50),
    role_type VARCHAR(10),
    isDel VARCHAR(10),
    created_at datetime not null default CURRENT_TIMESTAMP,
    updated_at timestamp not null default current_timestamp on update current_timestamp
);
CREATE TABLE USERSPACE (
    id  SERIAL PRIMARY KEY,
    user_id  VARCHAR(50),
    space_id  VARCHAR(50),
    space_role_id  VARCHAR(50),
    isDel VARCHAR(10),
    created_at datetime not null default CURRENT_TIMESTAMP,
    updated_at timestamp not null default current_timestamp on update current_timestamp
);
CREATE TABLE POST (
    id  SERIAL PRIMARY KEY,
    user_id  VARCHAR(50),
    space_id  VARCHAR(50),
    title VARCHAR(50),
    content VARCHAR(50),
    post_type VARCHAR(50),
    isAno VARCHAR(10),
    isDel VARCHAR(10),
    created_at datetime not null default CURRENT_TIMESTAMP,
    updated_at timestamp not null default current_timestamp on update current_timestamp
);
CREATE TABLE CHAT (
    id  SERIAL PRIMARY KEY,
    user_id  VARCHAR(50),
    post_id  VARCHAR(50),
    chat_id VARCHAR(50),
    content VARCHAR(50),
    isAno VARCHAR(10),
    isDel VARCHAR(10),
    created_at datetime not null default CURRENT_TIMESTAMP,
    updated_at timestamp not null default current_timestamp on update current_timestamp
);