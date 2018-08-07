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

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    startHere();
});


function startHere(){
    inquirer.prompt([{
        name: "supervisor",
        message: "what would you like to do?",
        type: "list",
        choices: ["View Product Sales by Department","Create New Department" , "Go home"]
    }]).then(answers => {
        console.log(answers.supervisor);
        if (answers.supervisor == "View Product Sales by Department") {
            viewProductSaleByDepart();
        } else if (answers.supervisor == "Create New Department"){
            creaetNewDepart();
        }else  {
            console.log("bye");
            connection.end();
        }
    });
};


function viewProductSaleByDepart(){
    console.log("still working on it");

    var query = "SELECT departments.department_id , departments.department_name , departments.over_head_costs , products.product_sales  ";

    connection.query(query , function(err ,res){





    });





    startHere();
};




function creaetNewDepart(){
    inquirer.prompt([{
        name: "newDepart",
        message: "what new Department would you like to create?",
        type: 'input',
        validate:function(a){
            if(a == ""){
                return false;
            }else{
                return true;
            }
        }
    },
    {
        name:"cost",
        message: "How much would be over head cost?",
        type:'input',
        validate: function (a) {
            if (isNaN(a) === false && a !== "") {
                return true;
            } else {
                return false;
            }
        }

    }
]).then(answers => {
        console.log(answers.newDepart , answers.cost);

        var  query_2 = "INSERT INTO departments(department_name ,over_head_costs) VALUE (\""
        + answers.newDepart  + "\",\"" + answers.cost + "\"," + ")";

    connection.query(query , function(err ,res){





    });





        startHere();
       
    });
    



    
}