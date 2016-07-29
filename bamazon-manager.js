var inquirer = require('inquirer');
var mysql = require('mysql');
var Table = require('terminal-table');
var colors = require('colors');
// var customer = require('./bamazon-customer.js');
var menuOptions = ['View Products for Sale', 'Low Inventory', 'Add to Inventory', 'Add New Product'];

var connection = mysql.createConnection({
  user: 'root',
  password: '',
  host: 'localhost',
  port: 3306,
  database: 'bamazon'
});


//start of application for user
inquirer.prompt([{
  name: 'startOptions',
  type: 'list',
  message: 'Menu',
  choices: menuOptions
}]).then(function (answers) {
    console.log(answers);
    console.log(answers.startOptions);
    if (answers.startOptions === menuOptions[0]) {   //view products for sale
      console.log('view products');
      viewProducts();
    } else if(answers.startOptions === menuOptions[1]) {   //low inventory
      connection.query('SELECT * FROM products WHERE stockQuantity < ?', [10000], function(err, results) {
        if (err) throw err;
        console.log('Low Inventory');
        showTable(results);
        connection.end();
      });
    } else if (answers.startOptions === menuOptions[2]) {   //add inventory
      addInventory();
    } else if (answers.startOptions === menuOptions[3]) {    //add item
      createItem();
    };
});




//FUNCTIONS
function addInventory() {
  connection.query('SELECT * FROM products', function (err, results) {
    if (err) throw err;
    console.log('Products for Sale');

    showTable(results);

    inquirer.prompt([{
      name: 'itemToAddTo',
      message: 'Please enter the id of the product you would like to add more of'
    },
    {
      name: 'qty',
      message: 'Please enter the quanity you would like to add'
    }]).then(function (answers) {
      var id = parseInt(answers.itemToAddTo);
      var qtyToAdd = parseInt(answers.qty);
      addInvToDb(id, qtyToAdd);
    })
  });
}


function viewProducts() {
  connection.query('SELECT * FROM products', function (err, results) {
    if (err) throw err;
    console.log('Products for Sale');

    showTable(results);
    connection.end();

    // inquirer.prompt([{
    //   name: 'itemToAddTo',
    //   message: 'Please enter the id of the product you would like to add more of'
    // },
    // {
    //   name: 'qty',
    //   message: 'Please enter the quanity you would like to add'
    // }]).then(function (answers) {
    //   var id = parseInt(answers.itemToAddTo);
    //   var qtyToAdd = parseInt(answers.qty);
    //   addInvToDb(id, qtyToAdd);
  //   })
  });
}

//i need to figure out why the entire customer file executed when i required it
function showTable(results) {
  var table = new Table();
  table.push([
    'ID'.bgRed,
    'Item Name'.bgRed,
    'Department Name'.bgRed,
    'Price'.bgRed,
    'Stock Quantity'.bgRed]);
  results.forEach(function (row) {
    table.push([
      row.itemId,
      row.productName,
      row.departmentName,
      row.price,
      row.stockQuantity
    ]);
  });
  console.log('' + table);
};

function addInvToDb(itemId, qtyToAdd) {
  console.log(typeof itemId, itemId);
  connection.query('SELECT stockQuantity from products WHERE ?', {
    itemId: itemId
  }, function(err, results) {
    if (err) throw err;
    console.log(results);
    var oldQty = results[0].stockQuantity;
    var newQty = oldQty + qtyToAdd;
    connection.query('UPDATE products SET ? WHERE ?', [{
      stockQuantity: newQty
    },
    {
      itemId: itemId
    }], function (err, results) {
      if (err) throw err;
      console.log('New Quantities');
      connection.query('SELECT * FROM products', function (err, results) {
        if (err) throw err;
        showTable(results);
        connection.end();
      });
    });
  });
}

function createItem() {
	connection.query('SELECT DISTINCT departmentName from departments', function (err, results) {
		if (err) throw err;
		var departmentsArray = [];
		console.log(results);
		results.forEach(function (row) {
			departmentsArray.push(row.departmentName);
		});
		console.log(departmentsArray);

	  inquirer.prompt([{
	    name: 'productName',
	    message: 'What is the name of the product you would like to add?'
	  },
	  {
	    name: 'departmentName',
	    type: 'list',
	    message: 'What is the department name of the product?', 
	    choices: departmentsArray
	  },
	  {
	    name: 'price',
	    message: 'What is the price of the product?'
	  },
	  {
	    name: 'stockQuantity',
	    message: 'How many are you adding?'
	  }]).then(function(answers) {
	    addProdToDB(answers);
	  })
	});
}

function addProdToDB(answers) {
  connection.query('INSERT INTO products SET ?', {
    productName: answers.productName,
    departmentName: answers.departmentName,
    price: answers.price,
    stockQuantity: answers.stockQuantity
  }, function (err, results) {
    if (err) throw err;
    console.log('Updated Products List');
    connection.query('SELECT * FROM products', function (err, results) {
      showTable(results);
      connection.end();
    });
  });
}
