// REQUIREMENTS
// ----------------------------------------------------------------------------------------
const mysql = require("mysql2/promise");
const inquirer = require("inquirer");

// VARIABLES
// ----------------------------------------------------------------------------------------
var firstName = "";
var lastName = "";
var roleID;
var managerID;
var departmentName = "";
var departmentID = "";
var salary;
var positionName = "";

// DATABASE CONNECTION
// ----------------------------------------------------------------------------------------
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "pass",
    database: "employee_tracker",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// INITIALIZATION
// ----------------------------------------------------------------------------------------
promptMenu();

// MAIN MENU FUNCTION
// ----------------------------------------------------------------------------------------
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
                    console.log("Employee Role Updated.");
                    updateEmployeeRole().then(() => {
                        promptMenu();
                    });
                    break;
                case "Add Role":
                    console.log("Employee Role Added.");
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
                    console.log("Employee Deleted.");
                    deleteEmployee().then(() => {
                        promptMenu();
                    });
                    break;
                case "Add Department":
                    console.log("Department Added.");
                    addDepartment().then(() => {
                        promptMenu();
                    });
                    break;
                case "Delete Department":
                    console.log("Department Deleted.");
                    deleteDepartment().then(() => {
                        promptMenu();
                    });
                    break;
            }
        });
}

// SHOW ALL FUNCTIONS
// ----------------------------------------------------------------------------------------
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
        const [rows] = await pool.query(
            "SELECT * FROM all_departments_display"
        );
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

// ADD FUNCTIONS
// ----------------------------------------------------------------------------------------
async function addEmployee() {
    firstName = await askFirstName();
    lastName = await askLastName();
    roleID = await askRole();
    managerID = await askManager();

    const sql = `INSERT INTO employee (first_name, last_name, employee_role_id, manager_id) VALUES ("${firstName}", "${lastName}", ${roleID}, ${managerID})`;
    pool.query(sql);
}

async function addDepartment() {
    departmentName = await askDepartmentName();

    const checkSql = `
    SELECT id
    FROM department
    WHERE name = "${departmentName}"
  `;

    const [checkRows, checkFields] = await pool.query(checkSql);

    if (checkRows.length > 0) {
        console.log("A department with the same name already exists.");
        return;
    }

    const sql = `INSERT INTO department (name) VALUES ("${departmentName}")`;
    pool.query(sql);
}

function addRole() {
    return new Promise(async (resolve) => {
        inquirer
            .prompt({
                name: "roleName",
                message: "What is the title's name?",
            })
            .then(async (answer) => {
                positionName = answer.roleName;

                inquirer
                    .prompt({
                        name: "salaryNum",
                        message: "What is the salary for this role?",
                    })
                    .then(async (answer) => {
                        salary = answer.salaryNum;

                        inquirer
                            .prompt({
                                name: "department",
                                message:
                                    "Which department is this position in?",
                                type: "list",
                                choices: await getFromTable(
                                    "name",
                                    "department"
                                ),
                            })
                            .then(async (answer) => {
                                departmentID = await getIdFromDepartmentName(
                                    answer.department
                                );
                                const sql = `INSERT INTO employee_role (title, salary, department_id) VALUES ("${positionName}", "${salary}", ${departmentID})`;
                                resolve(pool.query(sql));
                            });
                    });
            });
    });
}

// DELETE FUNCTIONS
// ----------------------------------------------------------------------------------------
async function deleteDepartment() {
    return new Promise(async (resolve) => {
        inquirer
            .prompt({
                name: "departmentOption",
                message: "Which department would you like to delete?",
                type: "list",
                choices: await getFromTable("name", "department"),
            })
            .then((answer) => {
                const sql = `DELETE FROM department WHERE name = "${answer.departmentOption}"`;
                resolve(pool.query(sql));
            });
    });
}

async function deleteEmployee() {
    return new Promise(async (resolve) => {
        inquirer
            .prompt({
                name: "employeeOption",
                message: "Which employee would you like to delete?",
                type: "list",
                choices: await getFirstAndLastNameFromTable("employee"),
            })
            .then(async (answer) => {
                const empID = await getIdFromFullName(
                    "employee",
                    answer.employeeOption
                );
                const sql = `DELETE FROM employee WHERE id = "${empID}"`;
                resolve(pool.query(sql));
            });
    });
}

// UPDATE FUNCTIONS
// ----------------------------------------------------------------------------------------
async function updateEmployeeRole() {
    return new Promise(async (resolve) => {
        inquirer
            .prompt({
                name: "name",
                message: "Whose role would you like to change?",
                type: "list",
                choices: await getFirstAndLastNameFromTable("employee"),
            })
            .then(async (answer) => {
                const nameID = await getIdFromFullName("employee", answer.name);

                inquirer
                    .prompt({
                        name: "role",
                        message: "What is their new role?",
                        type: "list",
                        choices: await getFromTable("title", "employee_role"),
                    })
                    .then(async (answer) => {
                        const roleNameToIDQuery = `SELECT id FROM employee_role WHERE title = "${answer.role}"`;
                        const roleIDResult = await pool.query(
                            roleNameToIDQuery
                        );
                        const idResult = roleIDResult[0][0].id;
                        const sql = `
        UPDATE employee
        SET employee_role_id = ${idResult}
        WHERE id = ${nameID}
      `;
                        resolve(pool.query(sql));
                    });
            });
    });
}

// ASK PROMPT FUNCTIONS
// ----------------------------------------------------------------------------------------
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

function askManager() {
    return new Promise(async (resolve) => {
        const names = await getFirstAndLastNameFromTable("employee");
        names.push("null");
        inquirer
            .prompt({
                name: "managerName",
                message: "Which employee manages them?",
                type: "list",
                choices: names,
            })
            .then(async (answer) => {
                if (answer.managerName === "null") {
                    resolve(answer.managerName);
                } else {
                    managerID = await getIdFromFullName(
                        "employee",
                        answer.managerName
                    );
                    resolve(managerID);
                }
            });
    });
}

function askRole() {
    return new Promise(async (resolve) => {
        inquirer
            .prompt({
                name: "roleOption",
                message: "Which role would you like to pick?",
                type: "list",
                choices: await getFromTable("title", "employee_role"),
            })
            .then((answer) => {
                resolve(getIdFromRoleName(answer.roleOption));
            });
    });
}

// GET FUNCTIONS
// ----------------------------------------------------------------------------------------
async function getFromTable(column, table) {
    const sql = `SELECT ${column} FROM ${table}`;
    const [rows, fields] = await pool.query(sql);
    const dataList = rows.map((row) => row[column]);
    return dataList;
}

async function getIdFromDepartmentName(departmentName) {
    const sql = `SELECT id FROM department WHERE name = '${departmentName}'`;
    const [rows, fields] = await pool.query(sql);

    if (rows.length > 0) {
        return rows[0].id;
    } else {
        return null;
    }
}

async function getIdFromRoleName(roleName) {
    const sql = `SELECT id FROM employee_role WHERE title = "${roleName}"`;
    const [rows, fields] = await pool.query(sql);

    if (rows.length > 0) {
        return rows[0].id;
    } else {
        return null;
    }
}

async function getIdFromFullName(table, fullName) {
    const sql = `
    SELECT id
    FROM ${table}
    WHERE CONCAT(first_name, ' ', last_name) = "${fullName}"
  `;
    const [rows, fields] = await pool.query(sql);

    if (rows.length > 0) {
        return rows[0].id;
    } else {
        return null;
    }
}

async function getFirstAndLastNameFromTable(table) {
    const sql = `
      SELECT CONCAT(first_name, ' ', last_name) AS full_name
      FROM ${table}
    `;
    const [rows, fields] = await pool.query(sql);
    const nameList = rows.map((row) => row.full_name);
    return nameList;
}
