const mysql = require("mysql");

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '9133090736',
    database: 'tracker_DB',
});

const viewEmployees = () => {
    console.log('Selecting all products...\n');
    connection.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        console.table(res);
        connection.end();
    });
};

const viewEmployeeDpt = () => {
    console.log('Selecting all products...\n');
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        console.log(res);
        connection.end();
    });
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

const addEmployee_db = (a,b,c,d) => {
    console.log('Inserting a new product...\n');
    const query = connection.query(
      'INSERT INTO employee SET ?',
      {
        first_name: `${a}`,
        last_name: `${b}`,
        role_id: c,
        manager_id:d,
      },
      (err, res) => {
        if (err) throw err;
        console.log(`${res.affectedRows} product inserted!\n`);
      }
    );
    console.log(query.sql);
};

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


connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}\n`);
});