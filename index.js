const inquirer = require("inquirer");
const mysql = require("mysql");


const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '9133090736',
    database: 'tracker_DB',
});

connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}\n`);
    makeDecision();
});


//Prompt Function
function makeDecision() {
    inquirer.prompt([{
        type: "list",
        name: "decision",
        message: "What would you like to do?",
        choices: ["View All Employees", "View All Employees By Department", "Add Employee", "Update Employee Role", "View All Employees By Manager", "Update Employee Manager", "Remove Employee"]
    }]).then(data => {

        switch (data.decision) {
            case "View All Employees":
                viewEmployees();
                break;
            case "View All Employees By Department":
                viewEmployeeDpt();
                break;
            case "View All Employees By Manager":
                // viewEmployeeMng();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Remove Employee":
                // removeEmployee();
                break;
            case "Update Employee Role":
                updateEmployeeRol();
                break;
            case "Update Employee Manager":
                // updateEmployeeMng();
                break;
            default:
                return;
        }

    });
};

//how to reflect manager id to according choice
function addEmployee() {
    const query = connection.query("SELECT title, roles.id FROM roles", (err, roleData) => {
        if (err) throw err;
        console.log(roleData);
        connection.query("SELECT first_name, manager_id FROM employee WHERE manager_id IS NULL", (err, managers) => {
            if (err) throw err;
            let roleArray = [];
            for (let i = 0; i < roleData.length; i++) {
                roleArray.push(roleData[i].title);
            }
            let managerArray = [];
            for (let i = 0; i < managers.length; i++) {
                managerArray.push(managers[i].first_name);
            }
            console.log(roleArray);
            inquirer.prompt([{
                type: "input",
                name: "firstname",
                message: "Please insert first name:",
            },
            {
                type: "input",
                name: "lastname",
                message: "Please insert last name:",
            },
            {
                type: "list",
                name: "roleid",
                message: "Please select your role:",
                choices: roleArray,
            },
            {
                type: "list",
                name: "managerid",
                message: "Please select your manager",
                choices: managerArray,
            }]).then(data => {
                console.log(data.roleid);
                console.log(data.managerid);
                let addFirst = data.firstname;
                let addLast = data.lastname;
                //how to get the id??
                let addRoleid = data.roleid;
                let addMgrid = data.managerid;

                connection.query('INSERT INTO employee SET ?', {
                    first_name: `${addFirst}`,
                    last_name: `${addLast}`,
                    role_id: addRoleid,
                    manager_id: addMgrid,
                }, (err, addEmp) => {
                    if (err) throw err;
                    console.log(`${addEmp.first_name} inserted! \n`);
                    connection.end();
                });
            });
        });
    });

};

//DataBase Function

const viewEmployees = () => {
    console.log('Selecting all employees...\n');
    connection.query(`
    SELECT employee.id, employee.first_name, employee.last_name, roles.salary, roles.title, department.name, CONCAT(employee.first_name," ", employee.last_name ) AS manager 
    FROM employee 
    INNER JOIN roles ON employee.role_id = roles.id 
    INNER JOIN department ON roles.department_id = department.id 
    INNER JOIN employee manager ON employee.manager_id = manager.id`, (err, res) => {
        if (err) throw err;
        console.table(res);
        connection.end();
    });
};

const viewEmployeeDpt = () => {
    console.log('Selecting all ..\n');
    connection.query('SELECT name FROM department', (err, dptData) => {
        //promt
        //queries(select the columns i want to show)
        if (err) throw err;
        let departmentArray = [];
        for (let i = 0; i < dptData.length; i++) {
            departmentArray.push(dptData[i].name);
        }
        console.log(departmentArray);
        inquirer.prompt([{
            type: "list",
            name: "dptDecision",
            message: "Which Department would you like to see?",
            choices: departmentArray,
        }]).then(data => {
            console.log(data.dptDecision);
            connection.query(`SELECT department.name,employee.id, employee.first_name, employee.last_name,roles.title
            FROM employee
            INNER JOIN roles ON (employee.role_id = roles.id) 
            INNER JOIN department ON (roles.department_id = department.id)
            WHERE department.name = "${data.dptDecision}"
            `, (err, dptTable) => {
                console.table(dptTable);
                connection.end();
            });
        });
    });
};

const updateEmployeeRol = () => {
    const query = connection.query("SELECT title, roles.id FROM roles", (err, roleData) => {
        if (err) throw err;
        console.log(roleData);
        connection.query("SELECT first_name, manager_id FROM employee WHERE manager_id IS NULL", (err, managers) => {
            if (err) throw err;
            let roleArray = [];
            for (let i = 0; i < roleData.length; i++) {
                roleArray.push(roleData[i].title);
            }
            let managerArray = [];
            for (let i = 0; i < managers.length; i++) {
                managerArray.push(managers[i].first_name);
            }
            inquirer.prompt([{
                type: "input",
                name: "firstname",
                message: "Please update first name:",
            },
            {
                type: "input",
                name: "lastname",
                message: "Please update last name:",
            },
            {
                type: "list",
                name: "roleid",
                message: "Please update your role:",
                choices: roleArray,
            },
            {
                type: "list",
                name: "managerid",
                message: "Please update your manager",
                choices: managerArray,
            }]).then(data => {
                let addFirst = data.firstname;
                let addLast = data.lastname;
                //how to get the id??
                let addRoleid = data.roleid;
                let addMgrid = data.managerid;
                //how to format it correct?
                let first = first_name: `${addFirst}`;
                let last = last_name: `${addLast}`;
                let role = role_id: addRoleid;
                let manager = manager_id: addMgrid;
                if (data.firstname = "") {
                    first = ""
                };
                if (data.lasttname = "") {
                    last = ""
                };
                if (data.roleid = "") {
                    role = ""
                };
                if (data.managerid = "") {
                    manager = ""
                };
                connection.query('UPDATE products SET ? WHERE ?', {
                    first,
                    last,
                    role,
                    manager,
                }, (err, addEmp) => {
                    console.log(`${addEmp.first_name} inserted! \n`);
                })
            });
        });
    });
};

