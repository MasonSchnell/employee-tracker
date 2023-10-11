const mysql = require("mysql2");
const inquirer = require("inquirer");

departmentName = "";

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "pass",
    database: "employee_tracker",
});

const createViewSQL = `
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
            ON e.manager_id = m.id
`;

connection.connect();

inquirer
    .prompt({
        name: "department",
        message: "Please input the name of the new department.",
    })
    .then((answer) => {
        departmentName = answer.department;
    });

inquirer
    .prompt({
        name: "option",
        message: "What would you like to do?",
        type: "list",
        choices: [
            "View All Employees",
            "View All Employees by Department",
            "View All Employees by Manager",
            "Add Employees",
            "Remove Employees",
            "Update Employee Role",
            "Update Employee Manager",
        ],
    })
    .then((answer) => {
        switch (answer.option) {
            case "View All Employees":
                connection.query(createViewSQL, (error, results, fields) => {
                    if (error) {
                        console.error(error);
                    } else {
                        console.log(results);
                    }

                    connection.end();
                });
                break;
        }
    });
