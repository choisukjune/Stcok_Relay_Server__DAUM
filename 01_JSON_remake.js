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

var _forder_root = './data/agency/';
var target_folder = _forder_root + target_date + "/";
var target_folder_csv = _forder_root + target_date + "/csv/"; 
var target_folder_json = _forder_root + target_date + "/json/"; 
var target_folder_bak = _forder_root + target_date + "/bak/"; 

if( !fs.existsSync( target_folder ) ) fs.mkdirSync( target_folder );
if( !fs.existsSync( target_folder_csv ) ) fs.mkdirSync( target_folder_csv );
if( !fs.existsSync( target_folder_json ) ) fs.mkdirSync( target_folder_json );
if( !fs.existsSync( target_folder_bak ) ) fs.mkdirSync( target_folder_bak );



global.target_file_list = fs.readdirSync( target_folder_csv )
var arr = [];
var csvToJson = function( fileNm, folderNm ){
	
	
	if( !fileNm ) return;
	folderNm = folderNm || target_date

	var filePath = target_folder_csv + fileNm;	

	console.log( dateFormat_YYMMDD_HHMMSS() )

	var d = fs.readFileSync( filePath ).toString();
	var _d = JSON.parse( d )
/*

      "INVST_TP_NM": "금융투자",
      "ASK_TRDVOL": "132",
      "BID_TRDVOL": "126",
      "NETBID_TRDVOL": "-6",
      "ASK_TRDVAL": "1,630,200",
      "BID_TRDVAL": "1,558,450",
      "NETBID_TRDVAL": "-71,750",
      "CONV_OBJ_TP_CD": ""


*/
    var cd = fileNm.split( "." )[0]

    var _to = {}
	var i = 0, iLen = _d.output.length,io;
	for(;i<iLen;++i){
		io = _d.output[ i ];
        
        // if( io.INVST_TP_NM == "기관합계" )
        // {
        //     io.INVST_TP_NM = "total_agency"
        // }
        if( !_to[ io.INVST_TP_NM ] ) _to[ io.INVST_TP_NM ] = {};
        _to[ io.INVST_TP_NM ].INVST_TP_NM     = io.INVST_TP_NM    //금융투자",
        _to[ io.INVST_TP_NM ].ASK_TRDVOL      = io.ASK_TRDVOL.replace(/\,/gi,"") * 1    //132",
        _to[ io.INVST_TP_NM ].BID_TRDVOL      = io.BID_TRDVOL.replace(/\,/gi,"") * 1    //126",
        _to[ io.INVST_TP_NM ].NETBID_TRDVOL   = io.NETBID_TRDVOL.replace(/\,/gi,"") * 1 //-6",
        _to[ io.INVST_TP_NM ].ASK_TRDVAL      = io.ASK_TRDVAL.replace(/\,/gi,"") * 1    //1,630,200",
        _to[ io.INVST_TP_NM ].BID_TRDVAL      = io.BID_TRDVAL.replace(/\,/gi,"") * 1    //1,558,450",
        _to[ io.INVST_TP_NM ].NETBID_TRDVAL   = io.NETBID_TRDVAL.replace(/\,/gi,"") * 1 //-71,750",
        _to[ io.INVST_TP_NM ].CONV_OBJ_TP_CD  = io.CONV_OBJ_TP_CD//	
    }	
    var _o = {};
    _o._id = cd;
    _o.data = _to			
	arr.push( _o );
		
	console.log( "[ E ] - " + Date.now() );



	if( target_file_list.length - 1 == csvToJson.cnt )
	{

        console.log( target_date + ".json");
        fs.writeFileSync( target_folder_json + target_date + ".json", JSON.stringify(arr,null,4),{flag :'w'} )	

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