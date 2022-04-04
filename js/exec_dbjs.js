//-------------------------------------------------------;
var fileNm = "js/exec_dbjs.js";
if( console ) console.log( "[ S ] - " + fileNm + "----------" );
//-------------------------------------------------------;
(function(){
//-------------------------------------------------------;
// REQUIRE;
//-------------------------------------------------------;

var fs = require( "fs" );

//-------------------------------------------------------;
// VARIABLE;
//-------------------------------------------------------;

var ROOT_PATH = process.cwd();

var CP_COMMAND = {};
	CP_COMMAND.MONGO = "..\\Binary\\Mongodb\\mongodb-win32-x86_64-windows-4.4.3\\bin\\mongo";

var DBJS_DIRECTORY_PATH = ROOT_PATH + "/dbjs/";

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
	
	var DBJS_NM = dbjsNm + ".dbjs";
	var FILE_PATH = DBJS_DIRECTORY_PATH + DBJS_NM;

	var _t_command = CP_COMMAND.MONGO + " --username <!=ID=!> --password <!=PWD=!> --authenticationDatabase admin --host <!=HOST=!> --port <!=PORT=!> admin <!=FILE_PATH=!>";
	if( bResult ) _t_command = _t_command + " > " + dbjsNm + "__" + Date.now() + ".result";
	
	var command = _t_command.replace( "<!=ID=!>", global.CONST.MongoDB.OPTIONS.self.ID )
		.replace( "<!=PWD=!>", global.CONST.MongoDB.OPTIONS.self.PWD )
		.replace( "<!=HOST=!>", global.CONST.MongoDB.OPTIONS.self.HOST )
		.replace( "<!=PORT=!>", global.CONST.MongoDB.OPTIONS.self.PORT )
		.replace( "<!=FILE_PATH=!>", FILE_PATH );

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
var paramToObject = function( url ){
	
	var r =  url.split("?")[ 1 ];
	var a = r.split("=");
	var o = {};
	var i = 0,iLen = a.length,io;
	
	for(;i<iLen;++i){
		io = a[ i ];
		if( i % 2 == 0 ) o[ io ] = "";
		else o[ a[ i - 1] ] = io;
	}

	return o;
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
		http://localhost:8888/exec_dbjs?dbjs=getAlldbList
	* </code>
	*/
	global.server.addRouter("/exec_dbjs",function( req, res ){
		
		var routerNm = req.url.split("?")[0];
		var paramsO = paramToObject( req.url );

		var DBJS_NM = paramsO.dbjs + ".dbjs";
		var FILE_PATH = DBJS_DIRECTORY_PATH + DBJS_NM;
		console.log( FILE_PATH )
		if( fs.existsSync( FILE_PATH ) )
		{
			console.log( routerNm + " - Exec Query - " + paramsO.dbjs + ".dbjs - " + Date.now() );
			res.statusCode = 200;
			res.setHeader( "Access-Control-Allow-Headers", "Content-Type" )
			res.setHeader( "Access-Control-Allow-Origin", "*" )
			res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" )

			var r = exec_query_DB( paramsO.dbjs )
			console.log( "data : " +  r );
			console.log( typeof( r ) )
			res.end( r )	
		}
		else
		{
			console.log( routerNm + " - DBJS File Not Found! - " + paramsO.dbjs + ".dbjs - " + Date.now() );
			res.end( "DBJS File Not Found!" )
		}
		

	});
})();

//-------------------------------------------------------;
if( console ) console.log( "[ E ] - " + fileNm + "----------" );
//-------------------------------------------------------;
