var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,

	user: "root",

	password: "Code17",
	database: "bamazon_db"
});

//establish connection
connection.connect(function(err) {
	if (err) throw err;
	
	showProducts();
});

function showProducts() {
//query database for all products
	connection.query("SELECT * FROM products", function(err, results){
		if (err) throw err;
		for (var i =0; i < results.length; i++) {
			console.log(results[i].item_id + " | " + results[i].product_name  + " | " + results[i].price);
		}

		inquirer
			.prompt([
				{
					name: "choice",
					type: "rawlist",
					choices: function() {
						var choiceArray = [];
						for (var i = 0; i < results.length; i++){
							choiceArray.push(results[i].product_name);
						}

						return choiceArray;
					},

					message: "Select the ID of the product you would like to buy."
				},
				{
					name: "qty",
					type: "input",
					message: "How many would you like to buy?",
					validate: function(value) {
			          if (isNaN(value) === false) {
			            return true;
			          }
			          return false;
			        }
				}

				])
				.then(function(answer) {
					var chosenItem;
					for (var i = 0; i < results.length; i++) {
					if (results[i].product_name === answer.choice) {
						chosenItem = results[i];
					}

					}

					var trueQty = chosenItem.stock_quantity-parseInt(answer.qty);

						if (chosenItem.stock_quantity > parseInt(answer.qty)) {
						
							connection.query("UPDATE products SET ? WHERE ?",[{
								stock_quantity : trueQty
								},{
								item_id : chosenItem.item_id
							}], function(error,res) {
              					if (error) throw err;
              					console.log("Items Available!! Total Cost of Purchase: $" + (chosenItem.price * parseInt(answer.qty)));
              					
              				}
              			);
					} else {
						console.log("**Insufficient Quantity!! Please place new order!!**");
						showProducts();	
							

					}
					

	})


})

};


