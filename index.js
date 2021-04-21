const inquirer = require("inquirer");

const decision = [{
    type: "list",
    name: "decision",
    message: "What would you like to do?",
    choices: ["View All Employees", "View All Employees By Department", "View All Employees By Manager", "Add Employee", "Remove Employee", "Update Employee Role", "Update Employee Manager",]
}];

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
                viewEmployeeDptMng();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Remove Employee":
                removeEmployee();
                break;
            case "Update Employee Role":
                updateEmployee();
                break;
            case "Update Employee Manager":
                updateEmployeeMng();
                break;
            default:
                return;
        }

    });
};