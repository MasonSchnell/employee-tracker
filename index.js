const mysql = require("mysql2/promise");
const inquirer = require("inquirer");
const fs = require("fs");

var firstName = "";
var lastName = "";
var id;
var roleID;
var managerID;
var departmentName = "";

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "pass",
    database: "employee_tracker",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

promptMenu();

function promptMenu() {
    inquirer
        .prompt({
            name: "option",
            message: "What would you like to do?",
            type: "list",
            choices: [
                "View All Employees",
                "View All Departments",
                "View All Roles",
                "Add Role",
                "Add Employee",
                "Add Department",
                "Delete Employee",
                "Delete Department",
                "Update Employee Role",
            ],
        })
        .then((answer) => {
            switch (answer.option) {
                case "Add Employee":
                    addEmployee()
                        .then(() => {
                            console.log("Completed employee submission.");
                            promptMenu();
                        })
                        .catch((error) => {
                            console.error("Error:", error);
                        });
                    break;
                case "Update Employee Role":
                    updateEmployeeRole().then(() => {
                        promptMenu();
                    });
                    break;
                case "Add Role":
                    addRole().then(() => {
                        promptMenu();
                    });
                    break;
                case "View All Employees":
                    showAllEmployees().then(() => {
                        promptMenu();
                    });
                    break;
                case "View All Departments":
                    showAllDepartments().then(() => {
                        promptMenu();
                    });
                    break;
                case "View All Roles":
                    showAllRoles().then(() => {
                        promptMenu();
                    });
                    break;
                case "Delete Employee":
                    deleteEmployee().then(() => {
                        promptMenu();
                    });
                    break;
                case "Add Department":
                    addDepartment().then(() => {
                        promptMenu();
                    });
                    break;
                case "Delete Department":
                    deleteDepartment().then(() => {
                        promptMenu();
                    });
                    break;
            }
        });
}

async function showAllEmployees() {
    try {
        const [rows] = await pool.query("SELECT * FROM all_employee_display");
        console.table(rows);
    } catch (err) {
        console.error("Error executing query:", err);
    }
}

async function showAllDepartments() {
    try {
        const [rows] = await pool.query("SELECT * FROM department");
        console.table(rows);
    } catch (err) {
        console.error("Error executing query:", err);
    }
}

async function showAllRoles() {
    try {
        const [rows] = await pool.query("SELECT * FROM all_roles_display");
        console.table(rows);
    } catch (err) {
        console.error("Error executing query:", err);
    }
}

function askFirstName() {
    return new Promise((resolve) => {
        inquirer
            .prompt({
                name: "firstName",
                message: "What is their first name?",
            })
            .then((answer) => {
                resolve(answer.firstName);
            });
    });
}

function askLastName() {
    return new Promise((resolve) => {
        inquirer
            .prompt({
                name: "lastName",
                message: "What is their last name?",
            })
            .then((answer) => {
                resolve(answer.lastName);
            });
    });
}

function askDepartmentName() {
    const sql = "SELECT name FROM department";
    console.log(pool.query(sql));

    return new Promise((resolve) => {
        inquirer
            .prompt({
                name: "departmentName",
                message: "What is the department name?",
            })
            .then((answer) => {
                resolve(answer.departmentName);
            });
    });
}

function askManagersID() {
    return new Promise((resolve) => {
        inquirer
            .prompt({
                name: "manID",
                message: "What is their managers ID?",
            })
            .then((answer) => {
                resolve(answer.manID);
            });
    });
}

function askRoleID() {
    return new Promise((resolve) => {
        inquirer
            .prompt({
                name: "role",
                message: "What is their position id?",
            })
            .then((answer) => {
                resolve(answer.role);
            });
    });
}

// Creates new employees
async function addEmployee() {
    firstName = await askFirstName();
    lastName = await askLastName();
    roleID = await askRoleID();
    managerID = await askManagersID();
    console.log(id, firstName, lastName, roleID, managerID);

    const sql = `INSERT INTO employee (first_name, last_name, employee_role_id, manager_id) VALUES ("${firstName}", "${lastName}", ${roleID}, ${managerID})`;
    pool.query(sql);
}

async function addDepartment() {
    departmentName = await askDepartmentName();

    const sql = `INSERT INTO department (name) VALUES ("${departmentName}")`;
    pool.query(sql);
}

async function getFromTable(section, table) {
    try {
        const sqt = `SELECT ${section} FROM ${table}`;
        const [rows, fields] = await pool.query(sqt);
        const departmentList = [];
        rows.forEach((row) => {
            departmentList.push(row.name);
        });
        console.log(departmentList);
        return departmentList;
    } catch (error) {
        console.error("Error:", error);
    }
}

async function deleteDepartment() {
    const sqt = "SELECT name FROM department";
    const [rows, fields] = await pool.query(sqt);
    const departmentList = [];
    rows.forEach((row) => {
        departmentList.push(row.name);
    });
    // const choices1 = getFromTable("name", "department");
    return new Promise((resolve) => {
        inquirer
            .prompt({
                name: "departmentOption",
                message: "Which department would you like to delete?",
                type: "list",
                choices: departmentList,
            })
            .then((answer) => {
                const sql = `DELETE FROM department WHERE name = "${answer.departmentOption}"`;
                resolve(pool.query(sql));
            });
    });
}

async function deleteEmployee() {
    firstName = await askFirstName();
    lastName = await askLastName();

    const sql = `DELETE FROM employee WHERE first_name = "${firstName}" AND last_name = "${lastName}"`;
    pool.query(sql);
}

async function updateEmployeeRole() {
    firstName = await askFirstName();
    lastName = await askLastName();

    return new Promise((resolve) => {
        inquirer
            .prompt({
                name: "role",
                message: "Enter id of their new role",
            })
            .then((answer) => {
                const sql = `
        UPDATE employee
        SET employee_role_id = ${answer.role}
        WHERE first_name = "${firstName}" AND last_name = "${lastName}"
      `;
                resolve(pool.query(sql));
            });
    });
}

function addRole() {
    inquirer
        .prompt({
            name: "roleName",
            message: "What is the title's name?",
        })
        .then((answer) => {
            const placeHolder = [
                {
                    title: answer.roleName,
                    positionID: positions.length + 1,
                },
            ];

            positions.push(placeHolder);
        });
}
