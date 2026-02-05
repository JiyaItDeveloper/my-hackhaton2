---
name: database-skill
description: Create tables, manage migrations, and design robust schemas for application backends (Todo-focused).
---
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE todos (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  priority SMALLINT NOT NULL DEFAULT 3,
  due_date DATE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_todos_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT chk_priority CHECK (priority BETWEEN 1 AND 5)
);
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_todos_user_completed ON todos (user_id, completed);
-- 001_init.up.sql
CREATE TABLE users (...);
CREATE TABLE todos (...);
-- 001_init.down.sql
DROP TABLE IF EXISTS todos;
DROP TABLE IF EXISTS users;
-- 002_add_tags.up.sql
CREATE TABLE tags (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE todo_tags (
  todo_id BIGINT REFERENCES todos(id),
  tag_id BIGINT REFERENCES tags(id),
  PRIMARY KEY (todo_id, tag_id)
);
-- 002_add_tags.down.sql
DROP TABLE IF EXISTS todo_tags;
DROP TABLE IF EXISTS tags;
