const express=require('express');
const mysql=require('mysql');
const bodyParser=require('body-parser');
const app=express();
const connection=require('./connect');
const cookies=require('cookies');
app.use(bodyParser.urlencoded({extended:true}));
app.use((req,res,next)=>{
  req.cookies=new cookies(req,res);
  req.checkinfo={};
  req.userinfo={};
  if(req.cookies.get('user')){
    try{
      req.userinfo=JSON.parse(req.cookies.get('user'));
      if(req.cookies.get('checkid')){
        try{
          req.checkinfo=JSON.parse(req.cookies.get('checkid'));
          next();
        }catch(e){
          next();
        }
      }else{
        next();
      }
    }catch(e){
      next();
    }
  }else{
    next();
  }
});
app.use(express.static('./public'));
app.use('/game',require('./router/game'));//游戏管理
app.use('/money',require('./router/money'));//充值管理
app.use('/infos',require('./router/infos'));//用户管理和消息管理
app.use('/imgs',require('./router/imgs'));//图片管理
app.listen(8089, function () {
  console.log("app is listening");
});