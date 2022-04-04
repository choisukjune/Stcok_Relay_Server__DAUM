//--------------------------------------------------;
// REQUIRE;
//--------------------------------------------------;
var fs = require( "fs" );
var execSync = require('child_process').execSync;
var iconv = require( "iconv-lite" );
var spawn = require('child_process').spawn;

//--------------------------------------------------;
// VARIABLE;
//--------------------------------------------------;

global.CONST = {};
global.CONST.MongoDB = {};
global.CONST.MongoDB.OPTIONS = {
	"self" : { ID : "tjrwns", PWD : "123qweasdzxc", HOST : "localhost", PORT : 59320 }	
};

var ROOT_PATH = process.cwd();

var CP_COMMAND = {};
	CP_COMMAND.MONGO = "..\\Binary\\Mongodb\\mongodb-win32-x86_64-windows-4.4.3\\bin\\mongo";

var DBJS_DIRECTORY_PATH = ROOT_PATH + "/dbjs/";
var _tDbjs_PATH = ROOT_PATH + "/tdbjs/";
//var _JSON_PATH = ROOT_PATH.replace( /\\/gi, "/" ) + "/../crawler_sale_data/";

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
	var FILE_PATH = ROOT_PATH + "\\dbjs\\" + DBJS_NM;

	var _t_command = CP_COMMAND.MONGO + " --username <!=ID=!> --password <!=PWD=!> --authenticationDatabase admin --host <!=HOST=!> --port <!=PORT=!> admin <!=FILE_PATH=!>";
	if( bResult ) _t_command = _t_command + " > " + dbjsNm + "__" + Date.now() + ".result";
	
	var command = _t_command.replace( "<!=ID=!>", global.CONST.MongoDB.OPTIONS.self.ID )
		.replace( "<!=PWD=!>", global.CONST.MongoDB.OPTIONS.self.PWD )
		.replace( "<!=HOST=!>", global.CONST.MongoDB.OPTIONS.self.HOST )
		.replace( "<!=PORT=!>", global.CONST.MongoDB.OPTIONS.self.PORT )
		.replace( "<!=FILE_PATH=!>", FILE_PATH );
	//console.log( command )
	var r = execSync( command ).toString();
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
	var a = r.split("&");
	var o = {};
	var i = 0,iLen = a.length,io;
	
	for(;i<iLen;++i){
		io = a[ i ];
		var _ta = io.split( "=" );
		o[ _ta[0] ] = _ta[ 1 ];
	}
	console.log( o )
	return o;
};

		
var curDateTime = function(){
	var a = new Date()
	return a.getFullYear()
	+ String( a.getMonth() + 1 ).padStart(2, '0')
	+ String( a.getDate() ).padStart(2, '0')
	//+ String( a.getHours() ).padStart(2, '0')
	//+ String( a.getMinutes() ).padStart(2, '0')
	//+ String( a.getSeconds() ).padStart(2, '0');
}

var dateFormat_YYMMDDHHMMSS = function( date ){
	date = date || new Date();

	var YYYY = date.getFullYear();
	var MM = pad( date.getMonth() + 1, 2 );
	var DD = pad( date.getDate(), 2 );
	var H = pad( date.getHours(), 2 );
	var M = pad( date.getMinutes(), 2 );
	var S = pad( date.getSeconds(), 2 );

	return YYYY + MM + DD + H +  M + S;
};


var dateFormat_YYMMDD_HHMMSS = function( date ){
	date = date || new Date();

	var YYYY = date.getFullYear();
	var MM = pad( date.getMonth() + 1, 2 );
	var DD = pad( date.getDate(), 2 );
	var H = pad( date.getHours(), 2 );
	var M = pad( date.getMinutes(), 2 );
	var S = pad( date.getSeconds(), 2 );

	return YYYY + "-" + MM+ "-" + DD+ " " + H + ":" + M + ":" + S;
};


var dateFormat_HHMMSS = function( date ){
	date = date || new Date();

	var YYYY = date.getFullYear();
	var MM = pad( date.getMonth() + 1, 2 );
	var DD = pad( date.getDate(), 2 );
	var H = pad( date.getHours(), 2 );
	var M = pad( date.getMinutes(), 2 );
	var S = pad( date.getSeconds(), 2 );

	return (H +  M + S) * 1;
};

var dateFormat_Object = function( date ){
	date = date || new Date();
	var r = {
		y : date.getFullYear()
		, m : date.getMonth() + 1
		, d : date.getDate()
		, h : date.getHours()
		, mi : date.getMinutes()
		, s : date.getSeconds()
	
	};
	return r;
};

var dateString_Object = function( str ){
	if( !str ) return;

	var r = {
		y : str.substr(0,4) * 1
		, m : str.substr(4,2) * 1
		, d : str.substr(6,2) * 1
		, h : str.substr(8,2) * 1
		, mi : str.substr(10,2) * 1
		, s : str.substr(12,2) * 1
	
	};
	return r;
};

var dateFormat_YYMMDD = function( date ){
	date = date || new Date();

	var YYYY = date.getFullYear();
	var MM = pad( date.getMonth() + 1, 2 );
	var DD = pad( date.getDate(), 2 );
//	var H = pad( date.getHours(), 2 );
//	var M = pad( date.getMinutes(), 2 );
//	var S = pad( date.getSeconds(), 2 );

	return YYYY + MM + DD;// + H +  M + S;
};

var pad = function(n, width){
	n = n + '';
	return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}

var target_date = process.argv[2];

var _forder_root = './data/agency/';
var target_folder = _forder_root + target_date;
var target_folder_csv = _forder_root + target_date + "/csv/"; 
var target_folder_json = _forder_root + target_date + "/json/"; 
var target_folder_bak = _forder_root + target_date + "/bak/"; 

global.target_file_list = fs.readdirSync( target_folder_json ).reverse();

var JSONtoDb = function( filename ){

	console.log( "[ S ] - " + Date.now() );
	console.log( filename )
	var filePath = target_folder_json + filename;
	var _tdbjs_nm = "01_JSON_to_DB";
	var _tQuery = fs.readFileSync( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ).toString();
	var data = fs.readFileSync( filePath ).toString();
	var col_nm = target_date;
	var query = _tQuery.replace( "<!=DATA=!>", data )
			.replace( "<!=COL_NM=!>", col_nm )
	var dbjs_nm = _tdbjs_nm + ".dbjs";

	var FILE_PATH = DBJS_DIRECTORY_PATH + dbjs_nm;
	
	fs.writeFileSync( FILE_PATH , query, { flag : "w" } );
	var r = exec_query_DB( dbjs_nm )

	console.log( "[ E ] - " + Date.now() );
	
	//var command = "move " + filePath.replace(/\//gi,"\\") +  " " + target_folder_bak.replace(/\//gi,"\\");
	
	//var r = execSync( command );
	//console.log( iconv.decode( r, 'EUC-KR').toString() );
	
	if( global.target_file_list.length - 1 == JSONtoDb.cnt )
	{
		console.log( "end" )
		JSONtoDb.cnt = 0;
		//logic();
	}
	else
	{
		++JSONtoDb.cnt;
		JSONtoDb( global.target_file_list[ JSONtoDb.cnt ] )
	}
}
JSONtoDb.cnt = 0;


var logic = function(){
	global.target_file_list = fs.readdirSync( target_folder_json ).reverse();
	
	if( global.target_file_list.length == 0 )
	{
		console.log("No Target! - Wait 10sec.")
		setTimeout(function(){
			logic();
		},10000)
	}
	else
	{
		JSONtoDb( target_file_list[ JSONtoDb.cnt ] )
	}
}

logic();