var inquirer = require('inquirer');
var mysql = require('mysql');
var Table = require('terminal-table');
var colors = require('colors');

var Purchase = function Purchase(id, qtyPurchased) {
  this.id = id;
  this.price = 0;
  this.qtyPurchased = qtyPurchased;
  this.department = '';
  this.newQty = 0;
  this.currentQty = 0;
  this.revenue = 0;
}

Purchase.prototype.checkIfEnough = function () {
  var that = this;
  connection.query('SELECT * FROM products WHERE ?', {
    itemId: this.id
  }, function(err, results) {
    if (err) throw err;

    //save Purchase info to Purchase object
    that.currentQty = parseInt(results[0].stockQuantity, 10);
    that.price = parseFloat(results[0].price);
    that.qtyPurchased = parseInt(that.qtyPurchased, 10);
    that.saveNewQty();
    that.department = results[0].departmentName;

    //update qty if there is enough
    if (that.newQty >= 0) {   //there is enough
      that.updateQty();
    } else {  //not enough
      console.log('Insufficient quantity!');
      connection.end();
    };
  })
}

Purchase.prototype.saveNewQty = function() {
  this.newQty = this.currentQty - this.qtyPurchased;
}

Purchase.prototype.updateQty = function() {
  var that = this
  connection.query('UPDATE products SET ? WHERE ?', [{
    stockQuantity: that.newQty
  }, {
    itemId: that.id
  }], function (err, results) {
    if (err) throw err;
    console.log('Thanks for your order.');
    console.log('price:','$'+parseFloat(that.price * that.qtyPurchased, 2));
    that.recordRevenue();
  });
}

Purchase.prototype.recordRevenue = function() {
  this.revenue = this.price * this.qtyPurchased;
  var that = this;
  connection.query('SELECT productSales FROM departments WHERE ?', {
    departmentName: that.department
  }, function (err, results) {
    if (err) throw err;
    var productSales = results[0].productSales;
    connection.query('UPDATE departments SET ? WHERE ?', [{
      productsales: productSales + that.revenue
    },
    {
      departmentName: that.department
    }], function (err, results) {
        if (err) throw err;
        connection.end();
    });
  })
}

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

//START HERE - show contents of db on startup
connection.query('SELECT * FROM products', function (err, results) {
  if (err) throw err;

  showTable(results);

  inquirer.prompt([{
    name: 'id',
    message: 'Please enter the id of the product you would like to buy',
    validate: function (answer) {
      if (validateInt(answer))
        return true;
    }
  }, {
    name: 'qty',
    message: 'how many?',
    validate: function( answer) {
      if (validateInt(answer))
        return true;
    }
  }]).then(function (answers) {
    var customerPurchase = new Purchase(answers.id, answers.qty);
    customerPurchase.checkIfEnough();
  });
});



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

function validateInt(answer) {
  var answerNum = parseFloat(answer, 20);
  if (isInteger(answerNum)) {
    return true;
  } else {
    console.log('\nPlease enter a round number')
    return false;
  }
}


function isInteger(num) {
  return (typeof num === 'number') && (num % 1 === 0);
};

module.exports = showTable;
