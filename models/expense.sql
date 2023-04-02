-- Active: 1679903567610@@127.0.0.1@5432@mvc_project
CREATE DATABASE expenses;

CREATE TABLE expenses(
    expense_id SERIAL PRIMARY KEY,
    title VARCHAR(30) NOT NULL, 
    price DECIMAL(10, 2) NOT NULL, 
    category VARCHAR(30) NOT NULL, 
    essential BOOLEAN NOT NULL, 
    created_at TIMESTAMPTZ NOT NULL
);
