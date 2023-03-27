-- Active: 1679903567610@@127.0.0.1@5432@mvc_project

--убираем публичный доступ к схеме и БД
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON DATABASE mvc_project FROM PUBLIC;
--создание групповой роли для чтения и записи в таблицы 
CREATE ROLE readwrite_mvc_project;
GRANT CONNECT ON DATABASE mvc_project TO readwrite_mvc_project;
GRANT USAGE ON SCHEMA public TO readwrite_mvc_project;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO readwrite_mvc_project;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO readwrite_mvc_project;

--создание роли для пользования таблицами
--создаем пользователя
CREATE USER mvc_user WITH PASSWORD 'letsTest';
GRANT readwrite_mvc_project TO mvc_user;

