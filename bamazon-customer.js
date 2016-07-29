var inquirer = require('inquirer');
var mysql = require('mysql');
var Table = require('terminal-table');
var colors = require('colors');

var connection = mysql.createConnection({
  user: 'root',
  password: '',
  host: 'localhost',
  port: 3306,
  database: 'bamazon'
});



connection.connect(function (err) {
  if (err) throw err;
});

//show contents of db on startup
connection.query('SELECT * FROM products', function (err, results) {
  if (err) throw err;

  showTable(results);

  inquirer.prompt([{
    name: 'id',
    message: 'Please enter the id of the product you would like to buy'
  },
  {
    name: 'qty',
    message: 'how many?'
  }]).then(function(answers) {
    console.log(answers);
    checkIfEnough(answers.id, answers.qty);
  });
});




//FUNCTIONS
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

function checkIfEnough(itemId, proposedQty) {
  console.log('here');
  connection.query('SELECT * FROM products WHERE ?', {
    itemId: itemId
  }, function(err, results) {
    if (err) throw err;
    console.log(results);
    var currentQty = parseInt(results[0].stockQuantity, 10);
    var price = parseFloat(results[0].price);
    var proposedQtyNum = parseInt(proposedQty, 10);
    var newQty = currentQty - proposedQty;
    var department = results[0].departmentName;

    if (newQty >= 0) {   //there is enough
      updateQty(itemId, newQty, price, proposedQtyNum, department);
    } else {  //not enough
      console.log('Insufficient quantity!');
      connection.end();
    };
  })
};

function updateQty(id, newQty, price, qtyPurchased, department) {
  connection.query('UPDATE products SET ? WHERE ?', [{
    stockQuantity: newQty
  },
  {
    itemId: id
  }], function (err, results) {
    if (err) throw err;
    console.log('Thanks for your order.');
    console.log('price:','$'+parseFloat(price * qtyPurchased, 2));
    recordRevenue(price, qtyPurchased, department);
  });
};

function recordRevenue(price, quantity, department) {
  var revenue = price * quantity;
  connection.query('SELECT productSales FROM departments WHERE ?', {
    departmentName: department
  }, function (err, results) {
    if (err) throw err;
    var productSales = results[0].productSales;
    connection.query('UPDATE departments SET ? WHERE ?', [{
      productSales: productSales + revenue
    },
    {
      departmentName: department
    }], function (err, results) {
        if (err) throw err;
        connection.query('SELECT * FROM departments', function (err, results) {
          if (err) throw err;
          connection.end();
        });
    });
  })


  // connection.query('UPDATE departments SET ? WHERE ?', [{
  //   productSales: productSales + revenue
  // },
  // {
  //   departmentName: department
  // }], function (err, results) {
  //     if (err) throw err;
  //     connection.query('SELECT * FROM departments', function (err, results) {
  //       if (err) throw err;
  //       console.log(results);
  //       connection.end();
  //     });
  // });

}


module.exports = showTable;
