DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  stock_quantity INT UNSIGNED NOT NULL DEFAULT 0,
  product_sales DECIMAL(10,2) NOT NULL DEFAULT 0,
  PRIMARY KEY (item_id)
);


INSERT INTO products(product_name ,department_name , price ,stock_quantity) 
        VALUE ("mouse" , "Electronics" , 9.99, 100),
              ("keyboard" , "Electronics" , 10.99 , 200),
              ("PC" , "Electronics" , 999.99 , 10),
              ("apple" , "food", 0.99 , 1),
              ("coffee" , "food" , 3.99 ,400),
              ("bread" , "food" , 3.5 , 1000),
              ("shirt" , "Clothing" , 3.99 ,100),
              ("pants" , "Clothing" , 10.99, 2000),
              ("cake" , "food" , 5.99 , 4);


SELECT  SUM(product_sales) AS Total_Sales FROM products WHERE department_name = "Electronics";
SELECT  SUM(product_sales) AS Total_Sales FROM products WHERE department_name = "food";
SELECT  SUM(product_sales) AS Total_Sales FROM products WHERE department_name = "Clothing";


CREATE TABLE departments(
    department_id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(100) NOT NULL,
    over_head_costs DECIMAL(10,4) NOT NULL DEFAULT 0,
    PRIMARY KEY (department_id)
);

INSERT INTO departments(department_name ,over_head_costs) 
        VALUE("Electronics" , 5000),("Clothing" , 2000) ,("food" , 1200);



-- USE bamazon;
SELECT * FROM products;

SELECT * FROM departments;



SELECT departments.department_id , departments.department_name , departments.over_head_costs , products.product_sales , products.product_sales
