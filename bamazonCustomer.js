var inquirer = require("inquirer");
var mysql = require("mysql");

var Table = require('cli-table');

var connection = mysql.createConnection({
	host: "localhost",
	port: 8889,
	user: "root",
	password: "root",
	database: "Bamazon"
});

connection.connect(function(err) {
	if (err) throw err;
});

function reset() {
	inquirer.prompt({
    name: "again",
    type: "confirm",
    message: "Would you like to buy another item?"
  }).then(function(answer) {
  	if (answer.again === true) {
  		displayItems();
  	} else {
			console.log("Goodbye!");
			process.exit();
		}
  });	
}

function displayItems() {
	var table = new Table({
	    head: ['ID', 'Name', 'Department', 'Price', 'Qty.']
	  , colWidths: [8, 40, 25, 15, 8]
	});
	var query = "SELECT * FROM products";
	connection.query(query, function(err, res) {
	  for (var i = 0; i < res.length; i++) {
		  table.push(
		  	[res[i].item_id, res[i].product_name, 
		  	res[i].department_name, 
		  	res[i].price, 
		  	res[i].stock_quantity]);
		};
		inquirer.prompt({
			name: "product",
			type: "input",
			message: "Enter the ID of the product you would like to buy.\n" + table.toString()
			+ "\n"
		}).then(function(answer) {
			var bought = answer.product;
			if (!isNaN(bought)) {
				inquirer.prompt({
			    name: "quantity",
			    type: "input",
			    message: "How many items would you like to buy?"
			  }).then(function(answer) {
			  	var query = "SELECT stock_quantity FROM products WHERE item_id =" + bought;
			  	connection.query(query, function(err, res) {
				  	if ((res[0].stock_quantity - answer.quantity) >= 0) {
					  	var query = "UPDATE products SET stock_quantity = stock_quantity -" + answer.quantity + 
					  		" WHERE `item_id` = " + bought;
					  	connection.query(query, function(err, res) {
					  		var purchasedItem = "SELECT product_name FROM products WHERE item_id =" + bought;
					  		var purchasedAmt = answer.quantity;
					  		console.log("Your purchase has been completed!");
					  	});
					  } else {
					  	console.log("Sorry, we don't have that many of your requested item in stock.");
					  };
					  		setTimeout(function() {
					  			reset();
					  		}, 1000);
					});
			  });
			};
		});
	});
};

displayItems();