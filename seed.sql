use employee_tracker;

INSERT INTO department (name) VALUES 
    ("Marketing"),
    ("Accounting"),
    ("IT");


INSERT INTO employee_role (title, salary, department_id) VALUES 
    ("Manager", 100000, 1),
    ("Assistant Manager", 70000, 1),
    ("Managers Assistant", 45000, 1);


INSERT INTO employee (first_name, last_name, employee_role_id, manager_id) VALUES 
    ("Stacy", "Bilbury", 001, NULL),
    ("Mark", "Fairfield", 002, 0001),
    ("Steven", "Carmichal", 003, 0001);
