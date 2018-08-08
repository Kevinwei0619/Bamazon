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
    buyOrGoHome();
});

function buyOrGoHome() {
    inquirer.prompt([{
        name: "buyOrGo",
        message: "what would you like to do?",
        type: "list",
        choices: ["Buy something", "Go home"]
    }]).then(answers => {
        console.log(answers.buyOrGo);
        if (answers.buyOrGo == "Buy something") {
            startHere();
        } else {
            console.log("bye");
            connection.end();
        }
    });
};





function startHere() {
    var quierys = "SELECT * FROM products ";
    connection.query(quierys, function (err, res) {
        if (err) throw err;
        var stockList;
        // console.log(res);
        var buyingList = [];

        for(var i = 0 ; i < res.length ; i++){
            buyingList.push(res[i].product_name);
            console.log("ID: " + res[i].item_id + "||" + " name: " +res[i].product_name + "||" + 
            " Price: " + res[i].price);
        }
        inquirer.prompt([
            {
            name: "number",
            message: "what would you like to buy?",
            type: "input",
            validate: function (a) {
                if (isNaN(a) === false || a !== "" ) {
                    if(a <= res.length && a > 0){
                        return true;
                    }else{
                        return false;
                    }
                } else {
                    return false;
                }
            }
            },
        //     {
        //     name: "chosen",
        //     message: "what would you like to buy?",
        //     type: "rawlist",
        //     choices: function () {
        //         var buyingList = [];
        //         for (var i = 0; i < res.length; i++) {
        //             buyingList.push(res[i].product_name);
        //         };
        //         return buyingList;
        //     }
        // },
         {
            name: "howMany",
            message: "How many units of the product would you like to buy? ",
            type: 'input',
            validate: function (a) {
                if (isNaN(a) === false && a !== "") {
                    return true;
                } else {
                    return false;
                }
            }
        }]).then(answers => {
            // console.log(answers.chosen + answers.howMany);
            for (var i = 0; i < res.length; i++) {
                stockList = res[i];
                if(stockList.item_id == answers.number){
                    if (stockList.stock_quantity >= answers.howMany) {
                        // console.log((stockList.price + "  " + stockList.product_name));
                        var amount = parseFloat(stockList.price) * parseInt(answers.howMany);
                        var product_sales_amount = (parseFloat(stockList.product_sales) + amount).toFixed(2);
                        var totalLeft = parseInt(stockList.stock_quantity) - parseInt(answers.howMany);
                        // console.log(totalLeft);
                        // var quantity = "stock_quantity";
                        var table = "products";
                        var query_2 = "UPDATE ?? SET ? WHERE ? ";
                        connection.query(query_2,[
                            table,
                            {
                                product_sales:product_sales_amount

                            },{
                                item_id: answers.number
                            }
                        ] , function(err , res){
                            console.log("your total product_sales: "+product_sales_amount);
                        });

                        connection.query(query_2, [
                            table,
                            {
                                stock_quantity:totalLeft
                            },
                            {
                                
                                item_id: answers.number
                            }
                        ], function (err, res1) {
                            console.log("updated!!!\n" + "remaining quantity: " + totalLeft);
                            console.log("you need to pay: " + amount.toFixed(2) + " without tax!!");
                            

                            
                            // console.log(res1);
                            buyOrGoHome();
    
                        });
                    }else {
    
                        console.log("Sorry we dont have that much , Insufficient quantity!!!!");
    
                            buyOrGoHome();
                    }
                }
            }
        });
    });
};