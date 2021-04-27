const inquirer = require("inquirer");
const mysql = require("mysql");
require("console.table");

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
        choices: ["View All Employees", "View All Employees By Department", "View All Employees By Role", "View All Employees By Manager", "Update Employee Role", "Update Employee Manager", "Add Employee", "Add Department", "Add Role", "Remove Employee", "Remove Department", "Remove Role"]
    }]).then(data => {

        switch (data.decision) {
            case "View All Employees":
                viewEmployees();
                break;
            case "View All Employees By Department":
                viewEmployeeDpt();
                break;
            case "View All Employees By Role":
                viewEmployeeRle();
                break;
            case "View All Employees By Manager":
                viewEmployeeMng();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Add Role":
                addRole();
                break;
            case "Add Department":
                addDepartment();
                break;
            case "Remove Employee":
                removeEmployee();
                break;
            case "Remove Department":
                removeDepartment();
                break;
            case "Remove Role":
                removeRole();
                break;
            case "Update Employee Role":
                updateEmployeeRol();
                break;
            case "Update Employee Manager":
                updateEmployeeMng();
                break;
            default:
                return;
        }

    });
};

//DataBase Function
const addEmployee = () => {
    const query = connection.query("SELECT title, roles.id FROM roles", (err, roleData) => {
        if (err) throw err;
        connection.query("SELECT id,first_name, last_name, manager_id FROM employee WHERE manager_id IS NULL",
            (err, managers) => {
                if (err) throw err;
                let roleArray = roleData.map(({ id, title }) => ({
                    name: title,
                    value: id
                }));

                let managerArray = managers.map(({ id, first_name }) => (
                    {
                        name: first_name,
                        value: id
                    }));
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
                    let addFirst = data.firstname;
                    let addLast = data.lastname;
                    let addRoleid = data.roleid;
                    let addMgrid = data.managerid;

                    connection.query('INSERT INTO employee SET ?', {
                        first_name: `${addFirst}`,
                        last_name: `${addLast}`,
                        role_id: addRoleid,
                        manager_id: addMgrid,
                    }, (err, res) => {
                        if (err) throw err;
                        console.log(`employee inserted! \n`);
                        connection.end();
                    });
                });

            });
    });
};

const addDepartment = () => {
    inquirer.prompt([{
        type: "input",
        name: "department",
        message: "Please insert the new department name:",
    }]).then(data => {
        let addDpt = data.department;

        connection.query('INSERT INTO department SET ?', {
            name: `${addDpt}`,
        }, (err, res) => {
            if (err) throw err;
            console.log(`New department inserted! \n`);
            connection.end();
        });
    });
};

const addRole = () => {
    const query = connection.query("SELECT id, name FROM department",
        (err, dptData) => {
            if (err) throw err;
            let departmentArray = dptData.map(({ id, name }) => ({
                name: name,
                value: id
            }));

            inquirer.prompt([{
                type: "list",
                name: "dptid",
                message: "Please select the department you want to creat role.",
                choices: departmentArray,
            },
            {
                type: "input",
                name: "rolename",
                message: "Please insert role's name:",
            }]).then(data => {
                let addTitle = data.rolename;
                let dptid = data.dptid;

                connection.query('INSERT INTO roles SET ?', {
                    title: `${addTitle}`,
                    department_id: dptid,
                }, (err, res) => {
                    if (err) throw err;
                    console.log(`role inserted! \n`);
                    connection.end();
                });
            });

        });

};

const viewEmployees = () => {
    console.log('Selecting all employees...\n');
    connection.query(`
    SELECT employee.id, employee.first_name, employee.last_name, roles.salary, roles.title, department.name, CONCAT(manager.first_name," ", manager.last_name ) AS manager 
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
    console.log('Selecting Department for the employee ..\n');
    connection.query('SELECT name FROM department', (err, dptData) => {
        if (err) throw err;
        let departmentArray = [];
        for (let i = 0; i < dptData.length; i++) {
            departmentArray.push(dptData[i].name);
        }
        inquirer.prompt([{
            type: "list",
            name: "dptDecision",
            message: "Which Department would you like to see?",
            choices: departmentArray,
        }]).then(data => {
            connection.query(`SELECT department.name,employee.id, employee.first_name, employee.last_name,roles.title
            FROM employee
            INNER JOIN roles ON (employee.role_id = roles.id) 
            INNER JOIN department ON (roles.department_id = department.id)
            WHERE department.name = "${data.dptDecision}"
            `, (err, dptTable) => {
                if (err) throw err;
                console.table(dptTable);
                connection.end();
            });
        });
    });
};

const viewEmployeeRle = () => {
    console.log('Selecting Role for the employee ..\n');
    connection.query('SELECT title FROM roles', (err, rleData) => {
        if (err) throw err;
        let roleArray = [];
        for (let i = 0; i < rleData.length; i++) {
            roleArray.push(rleData[i].title);
        }
        inquirer.prompt([{
            type: "list",
            name: "rleDecision",
            message: "Which Role would you like to see?",
            choices: roleArray,
        }]).then(data => {
            connection.query(`SELECT department.name,employee.id, employee.first_name, employee.last_name,roles.title
            FROM employee
            INNER JOIN roles ON (employee.role_id = roles.id) 
            INNER JOIN department ON (roles.department_id = department.id)
            WHERE roles.title = "${data.rleDecision}"
            `, (err, rleTable) => {
                if (err) throw err;
                console.table(rleTable);
                connection.end();
            });
        });
    });
};

const viewEmployeeMng = () => {
    console.log('Selecting Manager for the employee ..\n');
    connection.query('SELECT id,first_name, last_name, manager_id FROM employee WHERE manager_id IS NULL', (err, mgrData) => {
        if (err) throw err;
        let managerArray = mgrData.map(({ id, first_name }) => ({
            name: first_name,
            value: id
        }));
        inquirer.prompt([{
            type: "list",
            name: "mgrDecision",
            message: "Which Manager would you like to see?",
            choices: managerArray,
        }]).then(data => {
            connection.query(`SELECT employee.id, employee.first_name, employee.last_name,roles.title
            FROM employee
            INNER JOIN roles ON (employee.role_id = roles.id) 
            INNER JOIN department ON (roles.department_id = department.id)
            WHERE manager_id = "${data.mgrDecision}"
            `, (err, mgrTable) => {
                if (err) throw err;
                console.table(mgrTable);
                connection.end();
            });
        });
    });
};

const updateEmployeeRol = () => {
    const query = connection.query("SELECT title, roles.id FROM roles", (err, roleData) => {
        if (err) throw err;
        connection.query("SELECT id, first_name, last_name, role_id FROM employee", (err, employee) => {
            if (err) throw err;
            let employeeArray = employee.map(({ id, first_name }) => (
                {
                    name: first_name,
                    value: id
                }));
            inquirer.prompt([
                {
                    type: "list",
                    name: "managerid",
                    message: "Who do you want to update employee",
                    choices: employeeArray,
                }]).then(data => {
                    let addEmpid = data.managerid;
                    let roleArray = roleData.map(({ id, title }) => ({
                        name: title,
                        value: id
                    }));
                    inquirer.prompt([{
                        type: "list",
                        name: "roleid",
                        message: "Which role you want to pick",
                        choices: roleArray,
                    }]).then(roleData => {
                        connection.query('UPDATE employee SET role_id = ? WHERE id= ?', [
                            roleData.roleid,
                            addEmpid
                        ], (err, res) => {
                            if (err) throw err;
                            console.log(`Employee's role updated! \n`);
                            connection.end();
                        })
                    })
                });
        });
    });
};

const updateEmployeeMng = () => {
    const query = connection.query("SELECT id, first_name, last_name, role_id FROM employee", (err, employeeData) => {
        if (err) throw err;
        connection.query("SELECT id,first_name, last_name, manager_id FROM employee WHERE manager_id IS NULL", (err, managerData) => {
            if (err) throw err;
            let employeeArray = employeeData.map(({ id, first_name }) => ({
                name: first_name,
                value: id
            }));
            inquirer.prompt([
                {
                    type: "list",
                    name: "managerid",
                    message: "Which employee do you want to update manager?",
                    choices: employeeArray,
                }]).then(data => {
                    let addEmpid = data.managerid;
                    let managerArray = managerData.map(({ id, first_name }) => (
                        {
                            name: first_name,
                            value: id
                        }));
                    inquirer.prompt([{
                        type: "list",
                        name: "upmanager",
                        message: "Which manager you want to change to?",
                        choices: managerArray,
                    }]).then(Data => {
                        connection.query('UPDATE employee SET manager_id = ? WHERE id= ?', [
                            Data.upmanager,
                            addEmpid
                        ], (err, res) => {
                            if (err) throw err;
                            console.log(`Employee's Manger get updated! \n`);
                            connection.end();
                        })
                    })
                });
        });
    });
};

const removeEmployee = () => {
    console.log('Deleting the selected employee info...\n');
    connection.query("SELECT id, first_name, last_name, role_id FROM employee", (err, employee) => {
        if (err) throw err;
        let employeeArray = employee.map(({ id, first_name }) => (
            {
                name: first_name,
                value: id
            }));
        inquirer.prompt([
            {
                type: "list",
                name: "pickemployee",
                message: "Which employee do you want to remove from database",
                choices: employeeArray,
            }]).then(data => {
                let addEmpid = data.pickemployee;
                connection.query('DELETE FROM employee WHERE id= ?', [
                    addEmpid
                ], (err, res) => {
                    if (err) throw err;
                    console.log(`Selected employee deleted! \n`);
                    connection.end();
                })

            });
    });
};

const removeDepartment = () => {
    console.log('Deleting the selected Department info...\n');
    connection.query("SELECT id, name FROM department", (err, dptData) => {
        if (err) throw err;
        let departmentArray = dptData.map(({ id, name }) => (
            {
                name: name,
                value: id
            }));
        inquirer.prompt([
            {
                type: "list",
                name: "pickdepartment",
                message: "Which department do you want to remove from database",
                choices: departmentArray,
            }]).then(data => {
                let removedpt = data.pickdepartment;
                connection.query('DELETE FROM department WHERE id= ?', [
                    removedpt
                ], (err, res) => {
                    if (err) throw err;
                    console.log(`Selected department deleted! \n`);
                    connection.end();
                })

            });
    });
};

const removeRole = () => {
    console.log('Deleting the selected roles info...\n');
    connection.query("SELECT id, title FROM roles", (err, roleData) => {
        if (err) throw err;
        let roleArray = roleData.map(({ id, title }) => (
            {
                name: title,
                value: id
            }));
        inquirer.prompt([
            {
                type: "list",
                name: "pickrole",
                message: "Which role do you want to remove from database",
                choices: roleArray,
            }]).then(data => {
                let addRleid = data.pickrole;
                connection.query('DELETE FROM roles WHERE id= ?', [
                    addRleid
                ], (err, res) => {
                    if (err) throw err;
                    console.log(`Selected role deleted! \n`);
                    connection.end();
                })

            });
    });
};