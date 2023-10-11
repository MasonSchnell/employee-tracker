use employee_tracker;

INSERT INTO department (id, name) VALUES 
    ("1", "Marketing"),
    ("2", "Accounting"),
    ("3", "IT");


INSERT INTO employee_role (id, title, salary, department_id) VALUES 
    ("001", "Manager", 100000, 1),
    ("002", "Assistant Manager", 70000, 1),
    ("003", "Managers Assistant", 45000, 1);


INSERT INTO employee (id, first_name, last_name, employee_role_id, manager_id) VALUES 
    ("0001", "Stacy", "Bilbury", 001, NULL),
    ("0002", "Mark", "Fairfield", 002, 0001),
    ("0003", "Steven", "Carmichal", 003, 0001);
