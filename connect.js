var mysql=require('mysql');
var connection=mysql.createConnection({
	host:'localhost',
	user:'root2',
	password:'a46369339',
	database:'xingyi'
});
connection.connect();
module.exports=connection;