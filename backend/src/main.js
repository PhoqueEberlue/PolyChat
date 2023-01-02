let express = require('express');
let bodyParser = require('body-parser');

const db_controller = require('./database/DB_Controller');

let controller = new db_controller.DB_Controller();

(async () => {
	await controller.initDBConnection();
})();
let app = express();

app.use(bodyParser.json({type: ['application/json', 'text/plain']}));
app.use(bodyParser.urlencoded({ extended: true }));


app.post('/signup', (req, res) => { // Specifies which URL to listen for
  // req.body -- contains form data
	let username = req.body.username;
	let password = req.body.password;
	console.log(username + password);
});

app.post('/login', (req, res) => {
	//console.log(res);
	console.log(req.body);
	let username = req.body.username;
	let password = req.body.password;
})


	
app.get('/login', (req, res) => {
	console.log("something");

	console.log(req.headers);
  res.send('Hello World!')

})

app.listen(3000);
