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
var https = require( 'https' );

//-------------------------------------------------------;
// VARIABLE;
//-------------------------------------------------------;

var ROOT_PATH = process.cwd();

var CP_COMMAND = {};
	//CP_COMMAND.MONGO = "..\\Binary\\Mongodb\\mongodb-win32-x86_64-windows-4.4.3\\bin\\mongo";
	CP_COMMAND.MONGO = "mongo";

var DBJS_DIRECTORY_PATH = ROOT_PATH + "/dbjs/";
var _tDbjs_PATH = ROOT_PATH + "/tdbjs/";

var _ELASTIC_URL_ = "search-product-data-store-awaytc2qk5yknesel25x6q2p24.ap-northeast-2.es.amazonaws.com";


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

/*
 * @function
 * @param {Object} option
 {
	hostname: 'yourwebsite.com',
	port: 443,
	path: '/todos',
	method: 'POST',
 }
 * @param {Object} data
 {
	"a" : "b"
 }
 * @return {Function} cbFunction;
 */
var requestHTTPS_POST = function( option, data, cbFunction ){
	
	option.headers = {};
	option.headers[ 'Content-Type' ] = 'application/json';
	option.headers[ 'Content-Length' ] = data.length;

	var req = https.request( option, function( res ){
		console.log(`statusCode: ${res.statusCode}`)
		res.on('data', function( d ){
			//process.stdout.write(d)
			cbFunction( d )
		})
	});

	req.on('error', function(error){ console.error(error);  });
	req.write(data)
	req.end()
	
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
	global.server.addRouter("/all/search",function( req, res ){

		var routerNm = req.url.split("?")[0];
		var paramsO = paramToObject( req.url );		

		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		
		var option =  {
			hostname: _ELASTIC_URL_,
			port: 443,
			path: '/_all/_search?pretty',
			method: 'POST',
		};
		var data = JSON.stringify({
		  "query": {
			"match_all": {}
		  }
		});

		requestHTTPS_POST(option, data, function(d){
			console.log( d.toString() );
			res.end( d )		
		});
	});
})();

//-------------------------------------------------------;
if( console ) console.log( "[ E ] - " + fileNm + "----------" );
//-------------------------------------------------------;
