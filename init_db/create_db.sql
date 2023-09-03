CREATE TABLE USERS (
    id  SERIAL PRIMARY KEY,
    firstname VARCHAR(30),
    lastname VARCHAR(30),
    profile_path VARCHAR(255),
    email  VARCHAR(50),
    password  VARCHAR(255),
    isDel VARCHAR(5),
    created_at timestamp not null default CURRENT_TIMESTAMP,
    updated_at timestamp not null default current_timestamp on update current_timestamp
);
CREATE TABLE SPACE (
    id  SERIAL PRIMARY KEY,
    space_name VARCHAR(100),
    space_logo_path VARCHAR(255),
    owner_id VARCHAR(20),
    admin_code  VARCHAR(20) unique,
    common_code  VARCHAR(20) unique,
    isDel VARCHAR(5),
    created_at timestamp not null default CURRENT_TIMESTAMP,
    updated_at timestamp not null default current_timestamp on update current_timestamp
);
CREATE TABLE SPACEROLE (
    id  SERIAL PRIMARY KEY,
    space_id  VARCHAR(20),
    role_name  VARCHAR(50),
    role_type VARCHAR(10),
    isDel VARCHAR(5),
    created_at timestamp not null default CURRENT_TIMESTAMP,
    updated_at timestamp not null default current_timestamp on update current_timestamp
);
CREATE TABLE USERSPACE (
    user_id INT,
    space_id INT,
    space_role_id INT,
    isDel VARCHAR(5),
    created_at timestamp not null default CURRENT_TIMESTAMP,
    updated_at timestamp not null default current_timestamp on update current_timestamp
);
CREATE TABLE POST (
    id  SERIAL PRIMARY KEY,
    user_id  VARCHAR(20),
    space_id  INT,
    title VARCHAR(255),
    content TEXT,
    post_type VARCHAR(20),
    isAno VARCHAR(5),
    isDel VARCHAR(5),
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
    isDel VARCHAR(5),
    created_at timestamp not null default CURRENT_TIMESTAMP,
    updated_at timestamp not null default current_timestamp on update current_timestamp
);