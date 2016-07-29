var inquirer = require('inquirer');
var mysql = require('mysql');
var Table = require('terminal-table');
var colors = require('colors');
var accounting = require('accounting');

var connection = mysql.createConnection({
  user: 'root',
  password: '',
  host: 'localhost',
  port: 3306,
  database: 'bamazon'
});

//user input
var choices = ['View Product Sales By Department', 'Create New Department'];
inquirer.prompt([{
  type: 'list',
  name: 'choices',
  choices: choices,
  message: 'What would you like to do?'
}]).then(function (answers) {
  if (answers.choices === choices[0]) {    //view product sales by Department
    console.log('Sales By Department');
    showDeptTable();
  } else if (answers.choices === choices[1]) {   //create new department
    createDepartment();
  }
});

function showDeptTable() {
  connection.query('SELECT * FROM departments', function (err, results) {
    if (err) throw err;
    var table = new Table();
    table.push([
      'Department ID'.bgRed,
      'Department Name'.bgRed,
      'Overhead Costs'.bgRed,
      'Product Sales'.bgRed,
      'Total Profit'.bgRed]);
    results.forEach(function (row) {
      var profit = row.productSales - row.overheadCosts;

      //colors give context 
      if (profit < 0) {
        profit = accounting.formatMoney(profit).red;
      } else {
        profit = accounting.formatMoney(profit).green;
      }

      table.push([
        row.departmentId,
        row.departmentName,
        accounting.formatMoney(row.overheadCosts),
        accounting.formatMoney(row.productSales),
        profit
      ]);
    });
    console.log('' + table);
    connection.end();
  });
}

function createDepartment() {
  inquirer.prompt([{
    name: 'departmentName',
    message: 'Department Name?'
  }, {
    name: 'overheadCosts',
    message: 'Overhead Costs?'
  }]).then(function (answers) {
    connection.query('INSERT INTO departments SET ?', {
      departmentName: answers.departmentName,
      overheadCosts: answers.overheadCosts,
      productSales: 0
    }, function (err, results) {
      if (err) throw err;
      console.log(results);
      console.log('Updated Departments List');
      showDeptTable(results);
    });
  });
};
