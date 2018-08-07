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
    start();
});

function start() {
    inquirer.prompt([{
        name: "manager",
        message: "what would you like to do?",
        type: "list",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "EXIT"]
    }]).then(answers => {
        console.log(answers.manager);

        switch (answers.manager) {

            case "View Products for Sale":
                viewProductForSale();
                break;

            case "View Low Inventory":
                viewLowInventory();
                break;

            case "Add to Inventory":
                addToIncentory();
                break;

            case "Add New Product":
                addNewProduct();
                break;

            default:
                console.log("Bye")
                connection.end();
                break;
        };
    });
};


function viewProductForSale() {
    var query = "SELECT * FROM products ";
    connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log("ID: " + res[i].item_id + "||" + " product_name: " + res[i].product_name + "||" +
                " Price: " + res[i].price + "||" + "stock_quantity: " + res[i].stock_quantity + "|| " + " product_sales: " + res[i].product_sales);
            console.log("========================================================================================")
        }
        start();
    });
};

function viewLowInventory() {
    var query = "SELECT * FROM products WHERE stock_quantity < 5";
    connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log("ID: " + res[i].item_id + "||" + " product_name: " + res[i].product_name + "||" +
                " Price: " + res[i].price + "||" + "stock_quantity: " + res[i].stock_quantity + "|| " + " product_sales: " + res[i].product_sales);
            console.log("======================================================================================")
        }
        start();
    });
};

function addToIncentory() {
  
    var quierys = "SELECT * FROM products ";
    connection.query(quierys, function (err, res) {
        inquirer.prompt([{
            name: "nameOfProduct",
            message: "what do you want to add?",
            type: "list",
            choices: function () {
                var buyingList = [];
                for (var i = 0; i < res.length; i++) {
                    buyingList.push(res[i].product_name);
                };
                return buyingList;
            }
        },
        {
            name: "add",
            message: "How many do you want to add?",
            type: 'input',
            validate: function (a) {
                if (isNaN(a) === false && a !== "") {
                    return true;
                } else {
                    return false;
                }
            }
        }
    ]).then(answers => {
        var stockList;
        for (var i = 0; i < res.length; i++) {
            stockList = res[i];
            if(answers.nameOfProduct == stockList.product_name){
                var total = parseInt(answers.add) + parseInt(stockList.stock_quantity);
                var table = "products";
                var query_2 = "UPDATE ?? SET ? WHERE ? ";
                connection.query(query_2 , [
                    table,
                {
                    stock_quantity:total
                },{
                    product_name:answers.nameOfProduct
                }], function(err , res){
                    // console.log(res);
                    console.log("goood");
                    console.log("you have total: " + total + " " + answers.nameOfProduct);
                    start();
                });
            }
        };
    });
    });
};





function addNewProduct(){
        inquirer.prompt([{
            name: "newName",
            message: "what do you want to add?",
            type: 'input',
            validate: function (a) {
                if(a == ""){
                    return false;
                }else if(isNaN(a) == true){
                    return true;
                }else{
                    return false;
                }
             
            }
        },
        {
            name: "newdepartment",
            message: "what department is for this product?",
            type: 'input',
            validate: function (a) {
                if(a == ""){
                    return false;
                }else if(isNaN(a) == true){
                    return true;
                }else{
                    return false;
                }
             
            }
        },{
            name: "newPrice",
            message: "How much is for this product?",
            type: 'input',
            validate: function (a) {
                if (isNaN(a) === false && a !== "") {
                    return true;
                } else {
                    return false;
                }
            }
        },{
            name: "newQuantity",
            message: "How many do you have for this product?",
            type: 'input',
            validate: function (a) {
                if (isNaN(a) === false && a !== "") {
                    return true;
                } else {
                    return false;
                }
            }
        }
    ]).then(answers => {

        // var table = "products";
        // var table = table + "(product_name ,department_name , price ,stock_quantity)";
        var  query_3 = "INSERT INTO products(product_name ,department_name , price ,stock_quantity) VALUE (\""
         + answers.newName  + "\",\"" + answers.newdepartment + "\"," + parseFloat(answers.newPrice) + "," + parseInt(answers.newQuantity)+ ")";
        var test = connection.query(query_3 , 
        //     [
        //     table,
        //     {
        //         product_name:answers.newName,
        //         department_name:answers.newdepartment,
        //         price:parseFloat(answers.newPrice),
        //         stock_quantity:parseInt(answers.newQuantity)
        //     }
        // ], 
        function(err ,res){

            // console.log(res);

            console.log("gooood");
            start();




        });

        console.log(test.sql);





    });

    






};


// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.