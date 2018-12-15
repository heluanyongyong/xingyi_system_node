var express=require('express');
var router=express.Router();
var connection=require('./../connect');
var message={
	type:"",
	code:0
};
// 获取公共读取数据方法
function public_get(req,res,public){
	// 页数
	var page=req.query.page||1;
	// 每页显示多少条数据
	var limit=10;
	// 当前页从第几条数据开始读取
	var this_page=(page-1)*limit;
	// 查询总条数
	connection.query(`select count(${public.id}) as count from ${public.table} where ${public.where}`,(err,rows,fields)=>{
		if(err){
			console.log(err);
		}else{
			// 总页数
			var pages=Math.ceil(rows[0].count/limit);
			// 查询数据 where为查询条件(搜索+筛选)
			connection.query(`select * from ${public.table} where ${public.where} limit ${this_page},${limit}`,(err,rows,fields)=>{
				if(err){
					console.log(err);
				}else{
					var obj={
						rows:rows,
						pages:pages
					}
					res.send(obj);
				}
			});
		}
	});
}
// 提交数据公共方法
function public_post(req,res,sql){
	connection.query(sql,(err,rows,fields)=>{
		if(err){
			message.code=1;
			message.type='操作异常，提交失败';
			res.send(message);
		}else{
			message.type='提交成功！';
			res.send(message);
		}
	});
}
// 获取用户数据列表数据
router.get('/user_list_get',(req,res,next)=>{
	// 初始化查询条件
	var where=`userId<>''`;
	// 筛选条件-----登陆类型
	var loginType=req.query.loginType;
	if(loginType!=''){
		where+=` and loginType="${loginType}"`;
	}
	// 筛选条件-----用户状态
	var userState=req.query.userState;
	if(userState!=''){
		where+=` and userState="${userState}"`;
	}
	// 筛选条件-----时间范围
	var time=req.query.time;
	if(time!=''&&time!="null"){
		where+=` and (registerTime between "${time.split(',')[0]}" and "${time.split(',')[1]}")`;
	}
	// 查询条件-----查询类别和查询内容
	var searchType=req.query.searchType;
	var searchContent=req.query.searchContent;
	if(searchType!=''&&searchContent!=''){
		switch(searchType){
			case '账号':var type='userAccount';break;
			case '手机号':var type='phone';break;
			case '真实姓名':var type='userName';break;
		}
		where+=` and ${type}="${searchContent}"`;
	}
	// 传参给公共读取方法
	var public={
		id:'userId',
		table:'user_list',
		where:where
	};
	public_get(req,res,public);
});
// 获取游戏列表数据
router.get('/game_list_get',(req,res,next)=>{
	// 初始化查询条件
	var where=`gameId<>''`;
	// 筛选条件-----游戏类型
	var gameType=req.query.gameType;
	if(gameType!=''){
		where+=` and gameType="${gameType}"`;
	}
	// 筛选条件-----是否为热门游戏
	var isHot=req.query.isHot;
	if(isHot!=''){
		where+=` and isHot="${isHot}"`;
	}
	// 筛选条件-----游戏类型
	var gameClass=req.query.gameClass;
	if(gameClass!=''){
		where+=` and gameClass="${gameClass}"`;
	}
	// 筛选条件-----热门标签
	var hotTag=req.query.hotTag;
	if(hotTag!=''){
		where+=` and hotTag="${hotTag}"`;
	}
	// 筛选条件-----是否显示
	var isShow=req.query.isShow;
	if(isShow!=''){
		where+=` and isShow="${isShow}"`;
	}
	// 筛选条件-----时间范围
	var time=req.query.time;
	if(time!=''&&time!="null"){
		where+=` and (onlineTime between "${time.split(',')[0]}" and "${time.split(',')[1]}")`;
	}
	// 查询条件-----查询类别和查询内容
	var searchType=req.query.searchType;
	var searchContent=req.query.searchContent;
	if(searchType!=''&&searchContent!=''){
		switch(searchType){
			case '游戏名称':var type='gameName';break;
			case '运营代理商':var type='operateName';break;
		}
		where+=` and ${type}="${searchContent}"`;
	}
	var public={
		id:'gameId',
		table:'game_list',
		where:where
	};
	public_get(req,res,public);
});
// 获取热门标签列表数据
router.get('/game_hotTag_get',(req,res,next)=>{
	var where=`hotTagsId<>''`;
	// 查询-----标签内容
	var tag=req.query.tag;
	if(tag!=''){
		where+=` and tag="${tag}"`;
	}
	// 筛选条件-----是否显示
	var isShow=req.query.isShow;
	if(isShow!=''){
		where+=` and isShow="${isShow}"`;
	}
	var public={
		id:'hotTagsId',
		table:'game_hottags',
		where:where
	};
	public_get(req,res,public);
});
// 获取游戏类型列表数据
router.get('/game_type_get',(req,res,next)=>{
	var where=`gameTypeId<>''`;
	// 查询-----游戏类型
	var type=req.query.type;
	if(type!=''){
		where+=` and type="${type}"`;
	}
	// 筛选条件-----是否显示
	var isShow=req.query.isShow;
	if(isShow!=''){
		where+=` and isShow="${isShow}"`;
	}
	var public={
		id:'gameTypeId',
		table:'game_type',
		where:where
	};
	public_get(req,res,public);
});
// 获取开服表列表数据
router.get('/game_begin_get',(req,res,next)=>{
	var where=`gameBeginId<>''`;
	// 查询-----游戏名称
	var gameName=req.query.gameName;
	if(gameName!=''){
		where+=` and gameName="${gameName}"`;
	}
	// 筛选条件-----是否显示
	var isShow=req.query.isShow;
	if(isShow!=''){
		where+=` and isShow="${isShow}"`;
	}
	// 筛选条件-----时间范围
	var time=req.query.time;
	if(time!=''&&time!="null"){
		where+=` and (beginTime between "${time.split(',')[0]}" and "${time.split(',')[1]}")`;
	}
	var public={
		id:'gameBeginId',
		table:'game_begin',
		where:where
	};
	public_get(req,res,public);
});
// 修改用户数据列表状态
router.post('/user_list_post',(req,res,next)=>{
	var state=req.body.state;
	var userId=req.body.userId;
	var sql=`update user_list set userState="${state}" where userId=${userId}`;
	public_post(req,res,sql);
});
// 新增游戏列表
router.post('/game_list_add',(req,res,next)=>{
	var gameName=req.body.gameName;
	var gameIcon=req.body.gameIcon;
	var gameType=req.body.gameType;
	var isHot=req.body.isHot;
	var gameClass=req.body.gameClass;
	var linkEwm=req.body.linkEwm;
	var hotTag=req.body.hotTag;
	var operateName=req.body.operateName;
	var onlineTime=req.body.onlineTime;
	var onlinePeople=req.body.onlinePeople;
	var isShow=req.body.isShow;
	var miniPic=req.body.miniPic;
	var gameIntroduce=req.body.gameIntroduce;
	var skill=req.body.skill;
	var gameBackground=req.body.gameBackground;
	var featureGameplay=req.body.featureGameplay;
	var roleInfos=req.body.roleInfos;
	var gameWallpapers=req.body.gameWallpapers;
	var gameWallpaperl=req.body.gameWallpaperl;
	var gameScreenshots=req.body.gameScreenshots;
	var gameScreenshotl=req.body.gameScreenshotl;
	var sql=`insert into game_list(gameName,gameIcon,gameType,isHot,gameClass,linkEwm,hotTag,
		operateName,onlineTime,onlinePeople,isShow,miniPic,gameIntroduce,skill,gameBackground) 
		values("${gameName}","${gameIcon}","${gameType}","${isHot}","${gameClass}","${linkEwm}",
		"${hotTag}","${operateName}","${onlineTime}",${onlinePeople},"${isShow}","${miniPic}",
		"${gameIntroduce}","${skill}","${gameBackground}")`
	public_post(req,res,sql);
});
// 新增热门标签
router.post('/game_hotTag_add',(req,res,next)=>{
	var tag=req.body.tag;
	var isShow=req.body.isShow;
	var sql=`insert into game_hottags(tag,isShow) values("${tag}","${isShow}")`;
	public_post(req,res,sql);
});
// 修改热门标签
router.post('/game_hotTag_modify',(req,res,next)=>{
	var hotTagsId=req.body.hotTagsId;
	var tag=req.body.tag;
	var isShow=req.body.isShow;
	var sql=`update game_hottags set tag="${tag}",isShow="${isShow}" where hotTagsId=${hotTagsId}`;
	public_post(req,res,sql);
});
// 新增游戏类型
router.post('/game_type_add',(req,res,next)=>{
	var type=req.body.type;
	var isShow=req.body.isShow;
	var sql=`insert into game_type(type,isShow) values("${type}","${isShow}")`;
	public_post(req,res,sql);
});
// 修改游戏类型
router.post('/game_type_modify',(req,res,next)=>{
	var gameTypeId=req.body.gameTypeId;
	var type=req.body.type;
	var isShow=req.body.isShow;
	var sql=`update game_type set type="${type}",isShow="${isShow}" where gameTypeId=${gameTypeId}`;
	public_post(req,res,sql);
});
// 新增开服表
router.post('/game_begin_add',(req,res,next)=>{
	var gameName=req.body.gameName;
	var deptName=req.body.deptName;
	var beginTime=req.body.beginTime;
	var isShow=req.body.isShow;
	var sql=`insert into game_begin(gameName,deptName,beginTime,isShow) 
	values("${gameName}","${deptName}","${beginTime}","${isShow}")`;
	public_post(req,res,sql);
});
// 修改开服表
router.post('/game_begin_modify',(req,res,next)=>{
	console.log(req.body);
	console.log(req.body.beginTime);
	var gameBeginId=req.body.gameBeginId;
	var gameName=req.body.gameName;
	var deptName=req.body.deptName;
	var beginTime=req.body.beginTime;
	var isShow=req.body.isShow;
	var sql=`update game_begin set gameName="${gameName}",deptName="${deptName}",beginTime="${beginTime}",isShow="${isShow}" where gameBeginId=${gameBeginId}`;
	public_post(req,res,sql);
});
module.exports=router;