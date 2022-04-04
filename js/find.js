//-------------------------------------------------------;
var fileNm = "js/find.js";
if( console ) console.log( "[ S ] - " + fileNm + "----------" );
//-------------------------------------------------------;
(function(){
//-------------------------------------------------------;
// REQUIRE;
//-------------------------------------------------------;

var fs = require( "fs" );
var url = require('url');

//-------------------------------------------------------;
// VARIABLE;
//-------------------------------------------------------;

var ROOT_PATH = process.cwd();

var CP_COMMAND = {};
	//CP_COMMAND.MONGO = "..\\Binary\\Mongodb\\mongodb-win32-x86_64-windows-4.4.3\\bin\\mongo";
	CP_COMMAND.MONGO = "mongo";

var DBJS_DIRECTORY_PATH = ROOT_PATH + "/dbjs/";
var _tDbjs_PATH = ROOT_PATH + "/tdbjs/";

//-------------------------------------------------------;
// FUNCTION;
//-------------------------------------------------------;
//-------------------------;
//-------------------------;
//-------------------------;
//-------------------------;
//-------------------------;

/*
 * @function
 * @param {String} dbjsNm
 * @param {boolean} bResult
 * @return {String} r
 */
var exec_query_DB = function( dbjsNm, bResult ){

	var DBJS_NM = dbjsNm;
	var FILE_PATH = ROOT_PATH + "/dbjs/" + DBJS_NM;

	var _t_command = CP_COMMAND.MONGO + " --username <!=ID=!> --password <!=PWD=!> --authenticationDatabase admin --host <!=HOST=!> --port <!=PORT=!> admin \"<!=FILE_PATH=!>\"";
	if( bResult ) _t_command = _t_command + " > " + dbjsNm + "__" + Date.now() + ".result";
	
	var command = _t_command.replace( "<!=ID=!>", global.CONST.MongoDB.OPTIONS.self.ID )
		.replace( "<!=PWD=!>", global.CONST.MongoDB.OPTIONS.self.PWD )
		.replace( "<!=HOST=!>", global.CONST.MongoDB.OPTIONS.self.HOST )
		.replace( "<!=PORT=!>", global.CONST.MongoDB.OPTIONS.self.PORT )
		.replace( "<!=FILE_PATH=!>", FILE_PATH );
	console.log( command )
	var r = cp.execSync( command ).toString();
		r = deleteLines( r , 4 )
	return r;
};

//-------------------------;
//-------------------------;
//-------------------------;
//-------------------------;
//-------------------------;
/*
 * @function
 * @param {String} str
 * @param {Number} n
 * @return {String} str
 */
var deleteLines = function( str, n ){
	var i = 0,iLen = n,io;
	for(;i<iLen;++i){ str = str.slice(str.indexOf("\n") + 1, str.length ); }
	//str = str.replace( /\t/g, '' );
	//str = str.replace( /\r\n/g, '' );
	return str;
};
//-------------------------;
//-------------------------;
//-------------------------;
//-------------------------;
//-------------------------;
/*
 * @function
 * @param {String} url
 * @return {Object} o
 */
var paramToObject = function( _url ){
	
//	var r =  url.split("?")[ 1 ];
//	var a = r.split("&");
//	var o = {};
//	var i = 0,iLen = a.length,io;
//	
//	for(;i<iLen;++i){
//		io = a[ i ];
//		var _ta = io.split( "=" );
//		o[ _ta[0] ] = _ta[ 1 ];
//	}
//	console.log( o )
	var queryData = url.parse( _url, true).query;
	return queryData;
};
//-------------------------;
//-------------------------;
//-------------------------;
//-------------------------;
//-------------------------;

//-------------------------------------------------------;
// ROUTER;
//-------------------------------------------------------;
//-------------------------;
//-------------------------;
//-------------------------;
//-------------------------;
//-------------------------;
	/**
	 * 쿼리파일을 실행하는 라우터
	 * @function
	 * @param {http.ClientRequest} req
	 * <code>
		{

		}
	* </code>
	*
	* @param {http.ClientResponse} res
	* <code>
		{

		}
	* </code>
	*
	* @example
	* <code>
		http://localhost:8888/find?brand=varihope&page=1
	* </code>
	*/
	global.server.addRouter("/find",function( req, res ){

		var routerNm = req.url.split("?")[0];
		var paramsO = paramToObject( req.url );
		var _tdbjs_nm = "find";
				

		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		console.log( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ); 
		
		try
		{
			var _tQuery = fs.readFileSync( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ).toString();
		}
		catch( err )
		{
			console.log( routerNm + " - DBJS File Not Found! - " + err );
			res.end("{ sucess : 0, data : null }");
		}
		
		var query = _tQuery.replace( "<!=BRAND_NM=!>", paramsO.brandNm )
		.replace( "<!=PAGE=!>", paramsO.page );
		var dbjs_nm = "find_" + paramsO.brandNm + ".dbjs";

		var FILE_PATH = DBJS_DIRECTORY_PATH + dbjs_nm;
		
		console.log( FILE_PATH )

		fs.writeFileSync( DBJS_DIRECTORY_PATH + dbjs_nm , query, { flag : "w" } );
		var r = exec_query_DB( dbjs_nm )
		res.end( r )	

	});
	/**
	 * 쿼리파일을 실행하는 라우터
	 * @function
	 * @param {http.ClientRequest} req
	 * <code>
		{

		}
	* </code>
	*
	* @param {http.ClientResponse} res
	* <code>
		{

		}
	* </code>
	*
	* @example
	* <code>
		http://localhost:8888/findHashTag?tag=...&page=1
	* </code>
	*/
	global.server.addRouter("/findHashTag",function( req, res ){
		debugger;
		var routerNm = req.url.split("?")[0];
		var paramsO = paramToObject( decodeURIComponent( req.url  ));
		var _tdbjs_nm = "findHashTag";
				
		var _tag = decodeURIComponent( paramsO.tag )

		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		console.log( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ); 
		
		try
		{
			var _tQuery = fs.readFileSync( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ).toString();
		}
		catch( err )
		{
			console.log( routerNm + " - DBJS File Not Found! - " + err );
			res.end("{ sucess : 0, data : null }");
		}
		
		var query = _tQuery.replace( "<!=TAG=!>", decodeURIComponent( paramsO.tag ) )
		.replace( "<!=PAGE=!>", paramsO.page )
		.replace( "<!=LIMIT=!>", paramsO.limit );
		var dbjs_nm = "find_" + _tag.replace(/\s/gi,"_") + ".dbjs";

		var FILE_PATH = DBJS_DIRECTORY_PATH + dbjs_nm;
		
		console.log( FILE_PATH )

		fs.writeFileSync( DBJS_DIRECTORY_PATH + dbjs_nm , query, { flag : "w" } );
		var r = exec_query_DB( dbjs_nm )
				
		res.end( r )


	});

	/**
	 * 쿼리파일을 실행하는 라우터
	 * @function
	 * @param {http.ClientRequest} req
	 * <code>
		{

		}
	* </code>
	*
	* @param {http.ClientResponse} res
	* <code>
		{

		}
	* </code>
	*
	* @example
	* <code>
		http://localhost:8888/findContentsAll?page=1
	* </code>
	*/
	global.server.addRouter("/findContentsAll",function( req, res ){
		debugger;
		var routerNm = req.url.split("?")[0];
		var paramsO = paramToObject( req.url );
		var _tdbjs_nm = "findContentsAll";
				
		var _tag = decodeURIComponent( paramsO.tag )

		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		console.log( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ); 
		
		try
		{
			var _tQuery = fs.readFileSync( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ).toString();
		}
		catch( err )
		{
			console.log( routerNm + " - DBJS File Not Found! - " + err );
			res.end("{ sucess : 0, data : null }");
		}
		
		var query = _tQuery.replace( "<!=PAGE=!>", paramsO.page );
		var dbjs_nm = _tdbjs_nm + ".dbjs";

		var FILE_PATH = DBJS_DIRECTORY_PATH + dbjs_nm;
		
		console.log( FILE_PATH )

		fs.writeFileSync( DBJS_DIRECTORY_PATH + dbjs_nm , query, { flag : "w" } );
		var r = exec_query_DB( dbjs_nm )
		res.end( r )	

	});

	/**
	 * 쿼리파일을 실행하는 라우터
	 * @function
	 * @param {http.ClientRequest} req
	 * <code>
		{

		}
	* </code>
	*
	* @param {http.ClientResponse} res
	* <code>
		{

		}
	* </code>
	*
	* @example
	* <code>
		http://localhost:8888/findAll?page=1
	* </code>
	*/
	global.server.addRouter("/findAll",function( req, res ){
		debugger;
		var routerNm = req.url.split("?")[0];
		var paramsO = paramToObject( req.url );
		var _tdbjs_nm = "findAll";
				

		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		console.log( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ); 
		
		try
		{
			var _tQuery = fs.readFileSync( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ).toString();
		}
		catch( err )
		{
			console.log( routerNm + " - DBJS File Not Found! - " + err );
			res.end("{ sucess : 0, data : null }");
		}
		
		var query = _tQuery.replace( "<!=PAGE=!>", paramsO.page )
				.replace( "<!=LIMIT=!>", paramsO.limit );
		var dbjs_nm = _tdbjs_nm + ".dbjs";

		var FILE_PATH = DBJS_DIRECTORY_PATH + dbjs_nm;
		
		console.log( FILE_PATH )

		fs.writeFileSync( DBJS_DIRECTORY_PATH + dbjs_nm , query, { flag : "w" } );
		var r = exec_query_DB( dbjs_nm )
		res.end( r )	

	});

	/**
	 * 쿼리파일을 실행하는 라우터
	 * @function
	 * @param {http.ClientRequest} req
	 * <code>
		{

		}
	* </code>
	*
	* @param {http.ClientResponse} res
	* <code>
		{

		}
	* </code>
	*
	* @example
	* <code>
		http://localhost:8888/find_report_All_by_brand?brand=varihope
	* </code>
	*/
	global.server.addRouter("/getTotalCount",function( req, res ){
		
		var routerNm = req.url.split("?")[0];
		var paramsO = paramToObject( req.url );
		var _tdbjs_nm = "getTotalCount";
				

		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		console.log( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ); 
		
		try
		{
			var _tQuery = fs.readFileSync( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ).toString();
		}
		catch( err )
		{
			console.log( routerNm + " - DBJS File Not Found! - " + err );
			res.end("{ sucess : 0, data : null }");
		}
		
		var query = _tQuery.replace( "<!=COL_NM=!>", paramsO.colNm )
				.replace( "<!=DB_NM=!>", paramsO.dbNm );
		var dbjs_nm = "find_" + paramsO.colNm + ".dbjs";

		var FILE_PATH = DBJS_DIRECTORY_PATH + dbjs_nm;
		
		console.log( FILE_PATH )

		fs.writeFileSync( DBJS_DIRECTORY_PATH + dbjs_nm , query, { flag : "w" } );
		var r = exec_query_DB( dbjs_nm )
		res.end( r )	

	});

	/**
	 * 쿼리파일을 실행하는 라우터
	 * @function
	 * @param {http.ClientRequest} req
	 * <code>
		{

		}
	* </code>
	*
	* @param {http.ClientResponse} res
	* <code>
		{

		}
	* </code>
	*
	* @example
	* <code>
		http://localhost:8888/getHtml?fileNm=report_varihope_202008
	* </code>
	*/
	global.server.addRouter("/getHtml",function( req, res ){
		
		var routerNm = req.url.split("?")[0];
		var paramsO = paramToObject( req.url );
				
		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		
		try
		{
			var _tHtml = fs.readFileSync( _thtml_PATH + "/" + paramsO.fileNm + ".thtml" ).toString();
		}
		catch( err )
		{
			console.log( routerNm + " - thtml File Not Found! - " + err );
			res.end("{ sucess : 0, data : null }");
		}

		res.end( _tHtml )	

	});

	/**
	 * 쿼리파일을 실행하는 라우터
	 * @function
	 * @param {http.ClientRequest} req
	 * <code>
		{

		}
	* </code>
	*
	* @param {http.ClientResponse} res
	* <code>
		{

		}
	* </code>
	*
	* @example
	* <code>
		http://localhost:8888/getTags
	* </code>
	*/
	global.server.addRouter("/getTags",function( req, res ){
		
		var routerNm = req.url.split("?")[0];
		//var paramsO = paramToObject( req.url );
		var _tdbjs_nm = "getTags";
				

		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		console.log( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ); 
		
		try
		{
			var _tQuery = fs.readFileSync( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ).toString();
		}
		catch( err )
		{
			console.log( routerNm + " - DBJS File Not Found! - " + err );
			res.end("{ sucess : 0, data : null }");
		}
		
		var query = _tQuery//.replace( "<!=COL_NM=!>", paramsO.colNm );
		var dbjs_nm = "find_" + _tdbjs_nm + ".dbjs";

		var FILE_PATH = DBJS_DIRECTORY_PATH + dbjs_nm;
		
		console.log( FILE_PATH )

		fs.writeFileSync( DBJS_DIRECTORY_PATH + dbjs_nm , query, { flag : "w" } );
		var r = exec_query_DB( dbjs_nm )
		res.end( r )	

	});
	/**
	 * 쿼리파일을 실행하는 라우터
	 * @function
	 * @param {http.ClientRequest} req
	 * <code>
		{

		}
	* </code>
	*
	* @param {http.ClientResponse} res
	* <code>
		{

		}
	* </code>
	*
	* @example
	* <code>
		http://localhost:8888/findContentsAll?page=1
	* </code>
	*/
	global.server.addRouter("/searchProduct",function( req, res ){
		debugger;
		var routerNm = req.url.split("?")[0];
		var paramsO = paramToObject( decodeURIComponent( req.url  ));
		var _tdbjs_nm = "searchProduct";

		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		console.log( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ); 
		
		try
		{
			var _tQuery = fs.readFileSync( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ).toString();
		}
		catch( err )
		{
			console.log( routerNm + " - DBJS File Not Found! - " + err );
			res.end("{ sucess : 0, data : null }");
		}
		
		var query = _tQuery.replace( "<!=PAGE=!>", paramsO.page )
			.replace( "<!=LIMIT=!>", paramsO.limit )
			.replace( "<!=KEYWORD=!>", paramsO.keyword )
			.replace( "<!=PAGE=!>", paramsO.page );
		var dbjs_nm = _tdbjs_nm + ".dbjs";

		var FILE_PATH = DBJS_DIRECTORY_PATH + dbjs_nm;
		
		console.log( FILE_PATH )

		fs.writeFileSync( DBJS_DIRECTORY_PATH + dbjs_nm , query, { flag : "w" } );
		var r = exec_query_DB( dbjs_nm )

		res.end( r )	

	});
	/**
	 * 쿼리파일을 실행하는 라우터
	 * @function
	 * @param {http.ClientRequest} req
	 * <code>
		{

		}
	* </code>
	*
	* @param {http.ClientResponse} res
	* <code>
		{

		}
	* </code>
	*
	* @example
	* <code>
		http://localhost:8888/findContentsAll?page=1
	* </code>
	*/
	global.server.addRouter("/searchByShop",function( req, res ){
		
		var routerNm = req.url.split("?")[0];
		var paramsO = paramToObject( decodeURIComponent( req.url  ));
		var _tdbjs_nm = "searchByShop";

		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		console.log( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ); 
		
		try
		{
			var _tQuery = fs.readFileSync( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ).toString();
		}
		catch( err )
		{
			console.log( routerNm + " - DBJS File Not Found! - " + err );
			res.end("{ sucess : 0, data : null }");
		}
		
		var query = _tQuery.replace( "<!=PAGE=!>", paramsO.page )
			.replace( "<!=LIMIT=!>", paramsO.limit )
			.replace( "<!=SHOP=!>", paramsO.shop )
			.replace( "<!=PAGE=!>", paramsO.page );
		var dbjs_nm = _tdbjs_nm + ".dbjs";

		var FILE_PATH = DBJS_DIRECTORY_PATH + dbjs_nm;
		
		console.log( FILE_PATH )

		fs.writeFileSync( DBJS_DIRECTORY_PATH + dbjs_nm , query, { flag : "w" } );
		var r = exec_query_DB( dbjs_nm )


		res.end( r )	

	});
	/**
	 * 쿼리파일을 실행하는 라우터
	 * @function
	 * @param {http.ClientRequest} req
	 * <code>
		{

		}
	* </code>
	*
	* @param {http.ClientResponse} res
	* <code>
		{

		}
	* </code>
	*
	* @example
	* <code>
		http://localhost:8888/findContentsAll?page=1
	* </code>
	*/
	global.server.addRouter("/searchByBrand",function( req, res ){
		debugger;
		var routerNm = req.url.split("?")[0];
		var paramsO = paramToObject( decodeURIComponent( req.url  ));
		var _tdbjs_nm = "searchByBrand";

		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		console.log( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ); 
		
		try
		{
			var _tQuery = fs.readFileSync( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ).toString();
		}
		catch( err )
		{
			console.log( routerNm + " - DBJS File Not Found! - " + err );
			res.end("{ sucess : 0, data : null }");
		}
		
		var query = _tQuery.replace( "<!=PAGE=!>", paramsO.page )
			.replace( "<!=LIMIT=!>", paramsO.limit )
			.replace( "<!=BRAND=!>", paramsO.brand )
			.replace( "<!=PAGE=!>", paramsO.page );
		var dbjs_nm = _tdbjs_nm + ".dbjs";

		var FILE_PATH = DBJS_DIRECTORY_PATH + dbjs_nm;
		
		console.log( FILE_PATH )

		fs.writeFileSync( DBJS_DIRECTORY_PATH + dbjs_nm , query, { flag : "w" } );
		var r = exec_query_DB( dbjs_nm )

		res.end( r )	

	});
	/**
	 * 쿼리파일을 실행하는 라우터
	 * @function
	 * @param {http.ClientRequest} req
	 * <code>
		{

		}
	* </code>
	*
	* @param {http.ClientResponse} res
	* <code>
		{

		}
	* </code>
	*
	* @example
	* <code>
		http://localhost:8888/getStockInfo?cd=035720
	* </code>
	*/
	global.server.addRouter("/getStockInfo",function( req, res ){

		var routerNm = req.url.split("?")[0];
		var paramsO = paramToObject( req.url );

		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
		global.getStockInfo( paramsO.cd, function(d){

			res.end( d )		
		})
		

	});
		/**
	 * 쿼리파일을 실행하는 라우터
	 * @function
	 * @param {http.ClientRequest} req
	 * <code>
		{

		}
	* </code>
	*
	* @param {http.ClientResponse} res
	* <code>
		{

		}
	* </code>
	*
	* @example
	* <code>
		http://localhost:8888/getStockInfo?cd=035720
	* </code>
	*/
	global.server.addRouter("/getAgencyInfo",function( req, res ){

		var routerNm = req.url.split("?")[0];
		var paramsO = paramToObject( req.url );

		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
		var date = null
		global.getAgencyInfo( paramsO.cd, date, function(d){

			res.end( d )		
		})
		

	});
	/**
	 * 쿼리파일을 실행하는 라우터
	 * @function
	 * @param {http.ClientRequest} req
	 * <code>
		{

		}
	* </code>
	*
	* @param {http.ClientResponse} res
	* <code>
		{

		}
	* </code>
	*
	* @example
	* <code>
		http://localhost:8888/getStockInfo?cd=035720
	* </code>
	*/
	

	global.server.addRouter("/getAllStockInfo",function( req, res ){

		var routerNm = req.url.split("?")[0];
		var paramsO = paramToObject( req.url );

		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
		global.getAllStockInfo( paramsO.cd, function(d){
			
			res.end( d )		
		})
	})
	/**
	 * 쿼리파일을 실행하는 라우터
	 * @function
	 * @param {http.ClientRequest} req
	 * <code>
		{

		}
	* </code>
	*
	* @param {http.ClientResponse} res
	* <code>
		{

		}
	* </code>
	*
	* @example
	* <code>
		http://localhost:8888/getStockInfo?cd=035720
	* </code>
	*/
	

	global.server.addRouter("/getStockSearch",function( req, res ){

		var routerNm = req.url.split("?")[0];
		var paramsO = paramToObject( req.url );

		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
		global.getStockSearch( paramsO.q, function(d){
			
			res.end( d )		
		})
	})
	/**
	 * 쿼리파일을 실행하는 라우터
	 * @function
	 * @param {http.ClientRequest} req
	 * <code>
		{

		}
	* </code>
	*
	* @param {http.ClientResponse} res
	* <code>
		{

		}
	* </code>
	*
	* @example
	* <code>
		http://localhost:8888/getStockInfo?cd=035720
	* </code>
	*/
	

	global.server.addRouter("/getCandle5",function( req, res ){

		var routerNm = req.url.split("?")[0];
		var paramsO = paramToObject( req.url );

		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
		global.getCandle5( paramsO.cd, function(d){
			
			res.end( JSON.stringify( d ) )		
		})
	})
	/**
	 * 쿼리파일을 실행하는 라우터
	 * @function
	 * @param {http.ClientRequest} req
	 * <code>
		{

		}
	* </code>
	*
	* @param {http.ClientResponse} res
	* <code>
		{

		}
	* </code>
	*
	* @example
	* <code>
		http://localhost:8888/getStockInfo?cd=035720
	* </code>
	*/
	

	global.server.addRouter("/getTraderRank",function( req, res ){

		var routerNm = req.url.split("?")[0];
		var paramsO = paramToObject( req.url );

		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
		global.getTraderRank( paramsO.cd, function(d){
			
			res.end( JSON.stringify( d ) )		
		})
	})
		/**
	 * 쿼리파일을 실행하는 라우터
	 * @function
	 * @param {http.ClientRequest} req
	 * <code>
		{

		}
	* </code>
	*
	* @param {http.ClientResponse} res
	* <code>
		{

		}
	* </code>
	*
	* @example
	* <code>
		http://localhost:8888/getStockInfo?cd=035720
	* </code>
	*/
	

	global.server.addRouter("/getStockInfoByCd",function( req, res ){

		var routerNm = req.url.split("?")[0];
		var paramsO = paramToObject( req.url );

		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
		global.getStockInfoByCd( paramsO.cd, function(d){
			
			res.end( d )		
		})
	})
			/**
	 * 쿼리파일을 실행하는 라우터
	 * @function
	 * @param {http.ClientRequest} req
	 * <code>
		{

		}
	* </code>
	*
	* @param {http.ClientResponse} res
	* <code>
		{

		}
	* </code>
	*
	* @example
	* <code>
		http://localhost:8888/getStockInfo?cd=035720
	* </code>
	*/
	

	global.server.addRouter("/getWicsData",function( req, res ){

		var routerNm = req.url.split("?")[0];
		//var paramsO = paramToObject( req.url );

		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
		global.getWicsData(function(d){
			res.end( d )		
		})
	})
	/**
	 * 쿼리파일을 실행하는 라우터
	 * @function
	 * @param {http.ClientRequest} req
	 * <code>
		{

		}
	* </code>
	*
	* @param {http.ClientResponse} res
	* <code>
		{

		}
	* </code>
	*
	* @example
	* <code>
		http://localhost:8888/getStockInfo?cd=035720
	* </code>
	*/
	

	global.server.addRouter("/getWicsDataByCd",function( req, res ){

		var routerNm = req.url.split("?")[0];
		var paramsO = paramToObject( req.url );

		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
		global.getWicsDataByCd( paramsO.cd, function(d){
			
			res.end( d )		
		})
	})

	/**
	 * 쿼리파일을 실행하는 라우터
	 * @function
	 * @param {http.ClientRequest} req
	 * <code>
		{

		}
	* </code>
	*
	* @param {http.ClientResponse} res
	* <code>
		{

		}
	* </code>
	*
	* @example
	* <code>
		http://localhost:8888/getMarketIndex
	* </code>
	*/
	
	global.server.addRouter("/getMarketIndex",function( req, res ){

		var routerNm = req.url.split("?")[0];
		//var paramsO = paramToObject( req.url );

		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
		global.getMarketIndex(function(d){
			res.end( d )		
		})
	})
	/**
	 * 쿼리파일을 실행하는 라우터
	 * @function
	 * @param {http.ClientRequest} req
	 * <code>
		{

		}
	* </code>
	*
	* @param {http.ClientResponse} res
	* <code>
		{

		}
	* </code>
	*
	* @example
	* <code>
		http://localhost:8888/getMarketIndex
	* </code>
	*/
	
	global.server.addRouter("/getMarketIndexGlobal",function( req, res ){

		var routerNm = req.url.split("?")[0];
		//var paramsO = paramToObject( req.url );

		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
		global.getMarketIndexGlobal(function(d){
			res.end( d )		
		})
	})
})();

//-------------------------------------------------------;
if( console ) console.log( "[ E ] - " + fileNm + "----------" );
//-------------------------------------------------------;
