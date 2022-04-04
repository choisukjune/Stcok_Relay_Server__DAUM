var fs = require('fs');
var execSync = require('child_process').execSync;
var iconv = require( "iconv-lite" );
var spawn = require('child_process').spawn;

var execSync = require('child_process').execSync;
var iconv = require( "iconv-lite" );
var spawn = require('child_process').spawn;


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

console.log( "[ S ] - " + Date.now() );

var target_date = process.argv[ 2 ];

var _forder_root = './data/sise/';
var target_folder = _forder_root + target_date + "/";
var target_folder_csv = _forder_root + target_date + "/csv/"; 
var target_folder_json = _forder_root + target_date + "/json/"; 
var target_folder_bak = _forder_root + target_date + "/bak/"; 

if( !fs.existsSync( target_folder ) ) fs.mkdirSync( target_folder );
if( !fs.existsSync( target_folder_csv ) ) fs.mkdirSync( target_folder_csv );
if( !fs.existsSync( target_folder_json ) ) fs.mkdirSync( target_folder_json );
if( !fs.existsSync( target_folder_bak ) ) fs.mkdirSync( target_folder_bak );



global.target_file_list = fs.readdirSync( target_folder_csv )

var csvToJson = function( fileNm, folderNm ){
	
	var arr = [];
	if( !fileNm ) return;
	folderNm = folderNm || target_date

	var filePath = target_folder_csv + fileNm;	

	console.log( dateFormat_YYMMDD_HHMMSS() )

	var d = fs.readFileSync( filePath ).toString();
	var _d = JSON.parse( d )
/*

ACC_TRDVAL: "567,531,280"
ACC_TRDVOL: "194,493"
CMPPREVDD_PRC: "5"
FLUC_RT: "0.17"
FLUC_TP_CD: "1"
ISU_ABBRV: "3S"
ISU_SRT_CD: "060310"
LIST_SHRS: "46,271,513"
MKTCAP: "135,806,890,655"
MKT_ID: "KSQ"
MKT_NM: "KOSDAQ"
SECT_TP_NM: "중견기업부"
TDD_CLSPRC: "2,935"
TDD_HGPRC: "2,965"
TDD_LWPRC: "2,850"
TDD_OPNPRC: "2,875"


*/

	var i = 0, iLen = _d.OutBlock_1.length,io;
	for(;i<iLen;++i){
		io = _d.OutBlock_1[ i ];

		io.ACC_TRDVAL 			= io.ACC_TRDVAL.replace(/\,/gi,"") * 1
		io.ACC_TRDVOL 			= io.ACC_TRDVOL.replace(/\,/gi,"") * 1
		io.CMPPREVDD_PRC 		= io.CMPPREVDD_PRC.replace(/\,/gi,"") * 1			
		io.FLUC_RT 				= io.FLUC_RT.replace(/\,/gi,"") * 1
		io.ACC_TRDVFLUC_TP_CDAL = io.FLUC_TP_CD.replace(/\,/gi,"") * 1
		io.ISU_ABBRV 			= io.ISU_ABBRV
		io.ISU_SRT_CD 			= io.ISU_SRT_CD
		io.LIST_SHRS 			= io.LIST_SHRS.replace(/\,/gi,"") * 1
		io.MKTCAP 				= io.MKTCAP.replace(/\,/gi,"") * 1
		io.MKT_ID 				= io.MKT_ID
		io.MKT_NM 				= io.MKT_NM
		io.SECT_TP_NM 			= io.SECT_TP_NM
		io.TDD_CLSPRC 			= io.TDD_CLSPRC.replace(/\,/gi,"") * 1
		io.TDD_HGPRC 			= io.TDD_HGPRC.replace(/\,/gi,"") * 1
		io.TDD_LWPRC 			= io.TDD_LWPRC.replace(/\,/gi,"") * 1
		io.TDD_OPNPRC 			= io.TDD_OPNPRC.replace(/\,/gi,"") * 1
		io._id = io.ISU_SRT_CD;			
		arr.push( io );
	}	
		
	console.log( fileNm + " --> " + fileNm + ".json");
	fs.writeFileSync( target_folder_json + fileNm + ".json", JSON.stringify(arr,null,4),{flag :'w'} )	

	console.log( "[ E ] - " + Date.now() );



	if( target_file_list.length - 1 == csvToJson.cnt )
	{
		console.log( "end" )
		csvToJson.cnt = 0
		//logic();
	}
	else
	{
		++csvToJson.cnt;
		csvToJson( global.target_file_list[ csvToJson.cnt ], target_date )
	}

}
csvToJson.cnt = 0;

var logic = function(){
	global.target_file_list = fs.readdirSync( target_folder_csv )
	if( global.target_file_list.length == 0 )
	{
		console.log("No Target! - Wait 10sec.")
		setTimeout(function(){
			logic();
		},10000)
	}
	else
	{
		csvToJson( global.target_file_list[ csvToJson.cnt ], "20220204" )	
	}
	
}

logic();