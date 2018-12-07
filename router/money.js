var express=require('express');
var router=express.Router();
var connection=require('./../connect');
var message={
	type:"",
	code:0
};
router.get('/marketing',(req,res,next)=>{
	connection.query('select * from blog_sale',(err,rows,fields)=>{
		if(err){
			console.log(err);
		}else{
			res.send(rows);
		}
	});
});
module.exports=router;