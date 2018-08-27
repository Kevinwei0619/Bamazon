var mysql = require('mysql');
var inquirer = require('inquirer');



var connection = mysql.createConnection({
    host: "127.0.0.1",
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "root",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connection successful!");
    makeTable();
  });
  
  function makeTable() {
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      console.table(res);
      promptSupervisor();
    });
  }
  
  function promptSupervisor() {
    inquirer
      .prompt([
        {
          type: "list",
          name: "choice",
          message: "What would you like to do?",
          choices: ["View Product Sales by Department", "Create New Department", "Quit"]
        }
      ])
      .then(function(val) {
        // Checking to see what option the user chose and running the appropriate function
        if (val.choice === "View Product Sales by Department") {
          viewSales();
        }
        else if (val.choice === "Create New Department") {
          addDepartment();
        }
        else {
          console.log("Goodbye!");
          process.exit(0);
        }
      });
  }
  
  function addDepartment() {
    // Asking the user about the department they would like to add
    inquirer
      .prompt([
        {
          type: "input",
          name: "name",
          message: "What is the name of the department?"
        },
        {
          type: "input",
          name: "overhead",
          message: "What is the overhead cost of the department?",
          validate: function(val) {
            return val > 0;
          }
        }
      ])
      .then(function(val) {
        connection.query(
          "INSERT INTO departments (department_name, over_head_costs) VALUES (?, ?)",
          [val.name, val.overhead],
          function(err) {
            if (err) throw err;
            // If successful, alert the user, run makeTable again
            console.log("ADDED DEPARTMENT!");
            makeTable();
          }
        );
      });
  }
  
  function viewSales() {
      var query_3 =  "SELECT departments.department_id, departments.department_name, departments.over_head_costs, "
      + "SUM(departments.product_sales) as product_sales, "
      + "(SUM(departments.product_sales) - departments.over_head_costs) as "
      + "total_profit FROM (SELECT departments.department_id, departments.department_name, departments.over_head_costs, "
      + "IFNULL(products.product_sales, 0) as "
      + "product_sales FROM products RIGHT JOIN departments ON products.department_name = departments.department_name) as "
      + "departments GROUP BY department_id";
      //explain whole query
    connection.query(query_3 , function(err, res) {
        console.table(res);  //what is table() function ?
        promptSupervisor();
      }
    );
  }




// connection.connect(function (err) {
//     if (err) throw err;
//     console.log("connected as id " + connection.threadId + "\n");
//     startHere();
// });

// function makeTable() {
//     // Displaying an initial list of products for the user, calling promptSupervisor
//     connection.query("SELECT * FROM products", function(err, res) {
//       if (err) throw err;
//       console.table(res);
//       startHere();
//     });
//   }


// function startHere(){
//     inquirer.prompt([{
//         name: "supervisor",
//         message: "what would you like to do?",
//         type: "list",
//         choices: ["View Product Sales by Department","Create New Department" , "Go home"]
//     }]).then(answers => {
//         console.log(answers.supervisor);
//         if (answers.supervisor == "View Product Sales by Department") {
//             viewProductSaleByDepart();
//         } else if (answers.supervisor == "Create New Department"){
//             creaetNewDepart();
//         }else  {
//             console.log("bye");
//             connection.end();
//         }
//     });
// };


// function viewProductSaleByDepart(){
//     console.log("still working on it");

//     var query = "SELECT departments.department_id , departments.department_name , departments.over_head_costs , products.product_sales  ";

//     connection.query(query , function(err ,res){





//     });





//     startHere();
// };




// function creaetNewDepart(){
//     inquirer.prompt([{
//         name: "newDepart",
//         message: "what new Department would you like to create?",
//         type: 'input',
//         validate:function(a){
//             if(a == ""){
//                 return false;
//             }else{
//                 return true;
//             }
//         }
//     },
//     {
//         name:"cost",
//         message: "How much would be over head cost?",
//         type:'input',
//         validate: function (a) {
//             if (isNaN(a) === false && a !== "") {
//                 return true;
//             } else {
//                 return false;
//             }
//         }

//     }
// ]).then(answers => {
//         console.log(answers.newDepart , answers.cost);

//         var  query_2 = "INSERT INTO departments(department_name ,over_head_costs) VALUE (\""
//         + answers.newDepart  + "\",\"" + answers.cost + "\"," + ")";

//     connection.query(query , function(err ,res){





//     });





//         startHere();
       
//     });
    



    
// }