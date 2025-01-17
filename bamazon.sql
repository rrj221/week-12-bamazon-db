CREATE DATABASE bamazon;

USE bamazon;

DROP TABLE products;

CREATE TABLE products (
	itemId INTEGER(11) AUTO_INCREMENT NOT NULL,
    productName VARCHAR (100),
    departmentName VARCHAR (30),
    price DECIMAL(18, 2),
    stockQuantity INTEGER(11),
    PRIMARY KEY (itemId)
); 


CREATE TABLE departments (
	departmentId INTEGER(11) AUTO_INCREMENT NOT NULL,
    departmentName VARCHAR(100) NOT NULL,
    overheadCosts DECIMAL(18, 2),
    productSales DECIMAL(18, 2),
    PRIMARY KEY (departmentId)
);

INSERT INTO products (productName, departmentName, price, stockQuantity)
	VALUE ('Lord of The Rings: Fellowship of the Ring', 'Movies', 15.99, 10000);
INSERT INTO products (productName, departmentName, price, stockQuantity)
	VALUE ('Lord of The Rings: The Two Towers', 'Movies', 15.99, 10000);
INSERT INTO products (productName, departmentName, price, stockQuantity)
	VALUE ('Lord of The Rings: Return of the King', 'Movies', 16.99, 10010);
INSERT INTO products (productName, departmentName, price, stockQuantity)
	VALUE ('Nirvana Nevermind', 'Music', 11.99, 9000);
INSERT INTO products (productName, departmentName, price, stockQuantity)
	VALUE ('Adele 25', 'Music', 12.99, 11000);
INSERT INTO products (productName, departmentName, price, stockQuantity)
	VALUE ('Derek and the Dominoes Layla', 'Music', 9.99, 8000);
INSERT INTO products (productName, departmentName, price, stockQuantity)
	VALUE ('MacBook Air', 'Computers', 850.00, 5000);
INSERT INTO products (productName, departmentName, price, stockQuantity)
	VALUE ('MacBook Pro', 'Computers', 1299.99, 6000);
INSERT INTO products (productName, departmentName, price, stockQuantity)
	VALUE ('Samsung Galaxy', 'Phones', 749.99, 10000);
INSERT INTO products (productName, departmentName, price, stockQuantity)
	VALUE ('Elder Scrolls Skyrim', 'Video Games', 59.99, 700);
INSERT INTO products (productName, departmentName, price, stockQuantity)
	VALUE ('PS4', 'Video Games', 299.99, 500);
INSERT INTO products (productName, departmentName, price, stockQuantity)
	VALUE ('Toilet', 'Home Products', 299.99, 500);


SELECT * FROM products


INSERT INTO departments (departmentName, overheadCosts, productSales)
	VALUE ('Movies', 1000, 0);
INSERT INTO departments (departmentName, overheadCosts, productSales)
	VALUE ('Music', 900, 0);
INSERT INTO departments (departmentName, overheadCosts, productSales)
	VALUE ('Computers', 2000, 0);
INSERT INTO departments (departmentName, overheadCosts, productSales)
	VALUE ('Video Games', 1500, 0);
INSERT INTO departments (departmentName, overheadCosts, productSales)
	VALUE ('Home Products', 5000, 0);
INSERT INTO departments (departmentName, overheadCosts, productSales)
	VALUE ('Phones', 1000, 0);
    
    
SELECT * FROM departments
    


