DROP DATABASE IF EXISTS employee_tracker;
CREATE DATABASE employee_tracker;

USE employee_tracker;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(250) NOT NULL
);

CREATE TABLE employee_role (
     id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
     title VARCHAR(250) NOT NULL,
     salary INT NOT NULL,
     department_id INT NOT NULL,
     FOREIGN KEY (department_id)
        REFERENCES department (id)
        ON DELETE CASCADE
);

CREATE TABLE employee (
     id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
     first_name VARCHAR(250) NOT NULL,
     last_name VARCHAR(250) NOT NULL,
     employee_role_id INT NOT NULL,
     manager_id INT,
     FOREIGN KEY (employee_role_id)
        REFERENCES employee_role (id)
        ON DELETE CASCADE,
    FOREIGN KEY (manager_id)
        REFERENCES employee (id)
        ON DELETE SET NULL
);
