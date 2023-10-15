USE employee_tracker;

-- SELECT 
-- e.first_name,
-- e.last_name,
-- r.title AS role_title,
-- d.name AS department_name
-- FROM employee e
--     JOIN employee_role r
--         ON e.employee_role_id = r.id
--     JOIN department d
--         ON r.department_id = d.id
-- WHERE r.id = 2;

CREATE VIEW all_employee_display AS
SELECT 
    e.id,
    e.first_name,
    e.last_name,
    r.title AS role_title,
    d.name AS department_title,
    r.salary,
    CONCAT(m.first_name, " ", m.last_name) AS manager
FROM employee e
    JOIN employee_role r
        ON e.employee_role_id = r.id
    JOIN department d
        ON r.department_id = d.id   
    LEFT JOIN employee m
        on e.manager_id = m.id 

-- CREATE VIEW all_departments_display AS
-- SELECT
--     department.name,
--     department.id
--         FROM department

-- CREATE VIEW all_roles_display AS 
-- SELECT 
--     r.id,
--     r.title,
--     d.name AS department_name,
--     r.salary
--     FROM employee_role r
--         JOIN department d
--             ON r.department_id = d.id
