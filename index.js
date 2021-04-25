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

const decision = [{
    type: "list",
    name: "decision",
    message: "What would you like to do?",
    choices: ["View All Employees", "View All Employees By Department", "Add Employee", "Update Employee Role", "View All Employees By Manager", "Update Employee Manager", "Remove Employee"]
}];

//Prompt Function
function makeDecision() {
    inquirer.prompt(decision).then(data => {

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

const updateEmployeeRol_db = () => {
    // console.log('Updating all Rocky Road quantities...\n');
    // const query = connection.query(
    //     'UPDATE products SET ? WHERE ?',
    //     [
    //         {
    //             quantity: 100,
    //         },
    //         {
    //             flavor: 'Rocky Road',
    //         },
    //     ],
    //     (err, res) => {
    //         if (err) throw err;
    //         console.log(`${res.affectedRows} products updated!\n`);
    //         // Call deleteProduct AFTER the UPDATE completes
    //         deleteProduct();
    //     }
    // );

    // // logs the actual query being run
    // console.log(query.sql);
};

//bonus extra
const removeEmployee_db = () => {
    // console.log('Deleting all strawberry icecream...\n');
    // connection.query(
    //   'DELETE FROM products WHERE ?',
    //   {
    //     flavor: 'strawberry',
    //   },
    //   (err, res) => {
    //     if (err) throw err;
    //     console.log(`${res.affectedRows} products deleted!\n`);
    //     // Call readProducts AFTER the DELETE completes
    //     readProducts();
    //   }
    // );
};

const updateEmployeeMng_db = () => {
    // console.log('Updating all Rocky Road quantities...\n');
    // const query = connection.query(
    //     'UPDATE products SET ? WHERE ?',
    //     [
    //         {
    //             quantity: 100,
    //         },
    //         {
    //             flavor: 'Rocky Road',
    //         },
    //     ],
    //     (err, res) => {
    //         if (err) throw err;
    //         console.log(`${res.affectedRows} products updated!\n`);
    //         // Call deleteProduct AFTER the UPDATE completes
    //         deleteProduct();
    //     }
    // );

    // // logs the actual query being run
    // console.log(query.sql);
};

const viewEmployeeMng = () => {
    console.log('Selecting all products...\n');
    connection.query('SELECT * FROM employee WHERE ?',
        {
            //
        }, (err, res) => {
            if (err) throw err;
            console.log(res);
            connection.end();
        });
};
