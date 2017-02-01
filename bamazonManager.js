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

function lowerThanFive (data) {
	return data < 5;
}

function managerView() {
	var table = new Table({
		    head: ['ID', 'Name', 'Department', 'Price', 'Qty.']
		  , colWidths: [8, 40, 25, 15, 8]
		});
	
	inquirer.prompt({
	    name: "menu",
	    type: "list",
	    message: "What would you like to do?",
	    choices: ["View Products for Sale", 
	    "View Low Inventory", "Add to Inventory",
	    "Add New Product"]
	  }).then(function(answer) {
	  	var query = "SELECT item_id, product_name, department_name, price, stock_quantity FROM products";
	  	connection.query(query, function(err, res) {
	  // 		for (var i = 0; i < res.length; i++) {
			//   table.push(
			//   	[res[i].item_id, res[i].product_name, 
			//   	res[i].department_name, 
			//   	res[i].price, 
			//   	res[i].stock_quantity]);
			// };
		  	switch (answer.menu) {
		  		case "View Products for Sale":
			  		res.toString();
			  	case "View Low Inventory":
			  		// console.log(res.forEach(lowerThanFive(res.stock_quantity)));
			  	default:
			  		// res.forEach(console.log(res.toString()));
				break;

		  	}
		})
	  });
}

managerView();