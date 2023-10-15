use employee_tracker;

INSERT INTO department (name) VALUES 
    ("Marketing"),
    ("Accounting"),
    ("IT");


INSERT INTO employee_role (title, salary, department_id) VALUES 
    ("Marketing Manager", 100000, 1),
    ("Assistant Marketing Manager", 70000, 1),
    ("Marketing Manager's Assistant", 45000, 1),
    ("Accounting Manager", 100000, 2),
    ("Assistant Accounting Manager", 70000, 2),
    ("Accounting Manager's Assistant", 45000, 2),
     ("IT Manager", 100000, 3),
    ("Assistant IT Manager", 70000, 3),
    ("IT Manager's Assistant", 45000, 3);


INSERT INTO employee (first_name, last_name, employee_role_id, manager_id) VALUES 
    ("Stacy", "Bilbury", 001, NULL),
    ("Mark", "Fairfield", 002, 0001),
    ("Steven", "Carmichal", 003, 0001);
