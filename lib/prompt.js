const inquirer = require("inquirer");

function addEmployee() {
    inquirer.prompt(addEmpl).then(data => {
        let a = data.firstname;
        let b = data.lastname;
        let c = data.roleid;
        let d = data.managerid;
        addEmployee_db(a,b,c,d);
    });
};