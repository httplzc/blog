  var fs = require('fs');
  var path = require('path');
  module.exports = function(app){
   
    var fileNames = [];
	
	resolveFile(__dirname, fileNames);
	console.log(fileNames);
	fileNames.forEach(function(value){
		 app.get('/'+value, function(req, res){
            try{
              route(value,req, res);
            }catch(e){
              res.send("error:" + e);
            }
          })
	})
	

  //  resolveFile(__dirname, fileNames,);
  };

  function route(name, req, res){
	  console.log("require  "+name);
    var requestDeal = require("./" + name);
    if(requestDeal != null)
      requestDeal(res, req);
  else
	throw "找不到该页面"
  }

  function resolveFile(filePath, fileNames){

   //根据文件路径读取文件，返回文件列表
	var files= fs.readdirSync(filePath);
   
	//遍历读取到的文件列表
      files.forEach(function(filename){

          //获取当前文件的绝对路径
          var filedir = path.join(filePath, filename);

          //根据文件路径获取文件信息，返回一个fs.Stats对象
			var stats= fs.statSync(filedir);

              var isFile = stats.isFile();//是文件
              var isDir = stats.isDirectory();//是文件夹
              if(isFile && filename != "index.js"){
                fileNames.push(filename.split(".")[0]);
              }
              if(isDir){
                resolveFile(filedir,fileNames,callback);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
              }

        });
  }

