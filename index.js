//----------------------------------------------------------------------------------------------------;
var fileNm = "Server/index.js";
if( console ) console.log( "[ S ] - " + fileNm + "----------" );
//----------------------------------------------------------------------------------------------------;
//-------------------------------------------------------;
// REQUIRE;
//-------------------------------------------------------;

var cp = require( "child_process" );
var fs = require('fs');
var http = require('http');
var path = require('path');
var WebSocket = require('ws');

//-------------------------------------------------------;
// VARIABLE;
//-------------------------------------------------------;
// 정리해야함 ---- 생각나는데로 하고있음.....;
//-------------------------;
//-------------------------;
//-------------------------;
//-------------------------;

global.server = {};
global.server.addRouter = function(a,b){ return global.ROUTER_LIST[ a ] = b; };

//-------------------------;
//-------------------------;
//-------------------------;
//-------------------------;
//-------------------------;

global.ROUTER_LIST = {};

//-------------------------;
//-------------------------;
//-------------------------;
//-------------------------;
//-------------------------;


global.CONST = {};
global.CONST.MongoDB = {};
global.CONST.MongoDB.OPTIONS = {
	"self" : { ID : "admin", PWD : "tjrwns2482", HOST : "localhost", PORT : 59320 }	
};

//-------------------------;
//-------------------------;
//-------------------------;
//-------------------------;

var CWD = global.process.cwd();
var server_port = 8885;

var ROUTER_DIRECTORY_PATH = CWD + "/js/";

global.Stock = {};
global.Stock.BasicInfo = {};

//router등록을 한다.
(function(){
	var ROUTER_FILE_LIST = fs.readdirSync( ROUTER_DIRECTORY_PATH );
	var i =0,iLen = ROUTER_FILE_LIST.length,io;
	for(;i<iLen;++i){
		//라우터를 등록한다;
		eval( fs.readFileSync( ROUTER_DIRECTORY_PATH + ROUTER_FILE_LIST[ i ] ).toString() );
	}
})();
//-------------------------;
//-------------------------;
//-------------------------;
//-------------------------;

//-------------------------------------------------------;
// LOGIC;
//-------------------------------------------------------;
onload = function(){
	
	var webview = document.querySelector('webview')
	
	webview.addEventListener('did-finish-load', () => {

	//webview.loadURL( "https://m.stock.naver.com" );
	global.getStockInfoByCd = function(cd,cbFunction){
		webview.executeJavaScript(`

		new Promise((resolve, reject) => {
			var xhr = new XMLHttpRequest();
			xhr.onload = function() {
			  if (xhr.status === 200 || xhr.status === 201) {
				resolve( xhr.responseText )
			  } else {
				console.error(xhr.responseText);
			  }
			};

			xhr.open('GET', 'https://finance.daum.net/api/quotes/A${cd}?summary=true&changeStatistics=true');
			xhr.send();
		});

		`
		).then(function(data){
			
			//여기서처리해야함
			console.log( JSON.parse( data ) )
			cbFunction( data );
		})
	}


	/*
window.data = {}
window.data.wics = {};
window.data._wics = {};
window.data.wicsStocks = {};


var getWicsData = function( cbFunction ){
   var xhr = new XMLHttpRequest();

   xhr.open("GET" , encodeURI("https://finance.daum.net/api/sector/wics?perPage=100&page=1&fieldName=changeRate&order=desc") , true);

   xhr.onreadystatechange = function(){

      if(xhr.readyState == 4 && xhr.status == 200)
      {
         var d = JSON.parse( xhr.responseText );
         window.data._wics = d
         var i = 0,iLen = d.data.length,io;
         for(;i<iLen;++i){
            io = d.data[ i ];
            window.data.wics[ io.sectorCode ] = io;
            window.data.wics[ io.sectorCode ].stocks = [];
         }

         cbFunction( d );
      }

   }

   xhr.send();
}

var getWicsDataByStocks = function(){

   if( getWicsDataByStocks.wicsCnt == window.data._wics.data.length )
   {
      console.log( "all - end" )
      return;
   }

   var wcd = window.data._wics.data[ getWicsDataByStocks.wicsCnt ].sectorCode;
   
   var xhr = new XMLHttpRequest();
    xhr.open("GET" , encodeURI(`https://finance.daum.net/api/sector/wics/${wcd}/stocks?order=desc&perPage=100&page=${getWicsDataByStocks.page}`) , true);
    xhr.onreadystatechange = function(){

        if(xhr.readyState == 4 && xhr.status == 200)
        {

            var d = JSON.parse( xhr.responseText );
         
         var i = 0,iLen = d.data.length,io;
         for(;i<iLen;++i){
            io = d.data[ i ];
            debugger;
            window.data.wics[ wcd ].stocks.push(io)
         }

         if( d.pageSize == 100 && d.totalCount > 100 )
         {
            console.log( wcd + " - 100이초과 다음페이지 진행" )
            ++getWicsDataByStocks.page;
            getWicsDataByStocks( wcd );
         }
         else
         {
            console.log( wcd + " - end" )
            getWicsDataByStocks.page = 1;
            ++getWicsDataByStocks.wicsCnt;
            getWicsDataByStocks()
         }
        }

    }

    xhr.send();
}
getWicsDataByStocks.page = 1;
getWicsDataByStocks.wicsCnt = 0;



getWicsData( getWicsDataByStocks )
	*/

	global.getWicsData = function(cbFunction){
		webview.executeJavaScript(`

		new Promise((resolve, reject) => {
			   var xhr = new XMLHttpRequest();

			   xhr.open("GET" , encodeURI("https://finance.daum.net/api/sector/wics?perPage=100&page=1&fieldName=changeRate&order=desc") , true);

			   xhr.onreadystatechange = function(){

				  if(xhr.readyState == 4 && xhr.status == 200)
				  {
					 resolve( xhr.responseText );
				  }

			   }

			   xhr.send();
		});

		`
		).then(function(data){
			
			//여기서처리해야함
			//console.log( data )
			// var i = 0,iLen=_tmp.OutBlock_1.length,io
			// for(;i<iLen;++i){
			// 	io = _tmp.OutBlock_1[ i ];
			// 	global.Stock.BasicInfo[ io.ISU_SRT_CD ] = io;
			// }
			cbFunction( data );
		})
	}

	global.getWicsDataByCd = function(cd,cbFunction){
		console.log( cd );
		webview.executeJavaScript(`
		window.data = {};
		window.data.wics = {};
		window.data.wics.stocks = [];

		var getWicsDataByCd = function( cd, cbFunction ){
			var xhr = new XMLHttpRequest();
			xhr.open("GET" , encodeURI("https://finance.daum.net/api/sector/wics/" + cd + "/stocks?order=desc&perPage=100&page=" + getWicsDataByCd.page) , true);
			xhr.onreadystatechange = function(){
				if(xhr.readyState == 4 && xhr.status == 200)
				{
					var d = JSON.parse( xhr.responseText );
					var i = 0,iLen = d.data.length,io;
					for(;i<iLen;++i){
						io = d.data[ i ];
						window.data.wics.stocks.push(io)
					}

					if( d.pageSize == 100 && d.totalCount > 100 )
					{
						++getWicsDataByCd.page;
						getWicsDataByCd( cd, cbFunction );
					}
					else
					{
						cbFunction( window.data.wics.stocks )
					}
				}

			}

			xhr.send();
		}
		getWicsDataByCd.page = 1;
		
		new Promise((resolve, reject) => {
			getWicsDataByCd("${cd}",function(d){
				resolve( JSON.stringify( d ) );
			})
		});

		`
		).then(function(data){
			
			//여기서처리해야함
			//console.log( data )
			// var i = 0,iLen=_tmp.OutBlock_1.length,io
			// for(;i<iLen;++i){
			// 	io = _tmp.OutBlock_1[ i ];
			// 	global.Stock.BasicInfo[ io.ISU_SRT_CD ] = io;
			// }
			cbFunction( data );
		})
	}

	global.getAllStockInfo = function(cd,cbFunction){
		webview.executeJavaScript(`

		new Promise((resolve, reject) => {
			var xhr = new XMLHttpRequest();
			//var param = "bld=dbms/MDC/STAT/standard/MDCSTAT01901&locale=ko_KR&mktId=ALL&share=1&csvxls_isNo=false"

			xhr.onload = function() {
			  if (xhr.status === 200 || xhr.status === 201) {
				resolve( xhr.responseText )
			  } else {
				console.error(xhr.responseText);
			  }
			};

			xhr.open('GET', 'https://finance.daum.net/content/news?page=1&perPage=10&category=economy&searchType=all&keyword=A${cd}&pagination=true');
			//xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			xhr.send();
		});

		`
		).then(function(data){
			
			//여기서처리해야함
			var _tmp = JSON.parse( data );


			console.log( _tmp )
			
			// var i = 0,iLen=_tmp.OutBlock_1.length,io
			// for(;i<iLen;++i){
			// 	io = _tmp.OutBlock_1[ i ];
			// 	global.Stock.BasicInfo[ io.ISU_SRT_CD ] = io;
			// }
			cbFunction( data );
		})
	}

	global.getStockSearch = function(q,cbFunction){
		var _q = decodeURIComponent( q )
		webview.executeJavaScript(`

		new Promise((resolve, reject) => {
			var xhr = new XMLHttpRequest();
			//var param = "bld=dbms/MDC/STAT/standard/MDCSTAT01901&locale=ko_KR&mktId=ALL&share=1&csvxls_isNo=false"

			xhr.onload = function() {
			  if (xhr.status === 200 || xhr.status === 201) {
				resolve( xhr.responseText )
			  } else {
				console.error(xhr.responseText);
			  }
			};
			
			xhr.open('GET', "https://finance.daum.net/api/search?q=${_q}&pagination=false&page=1&perPage=30");
			//xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			xhr.send();
		});

		`
		).then(function(data){
			
			//여기서처리해야함
			var _tmp = JSON.parse( data );


			console.log( _tmp )
			
			// var i = 0,iLen=_tmp.OutBlock_1.length,io
			// for(;i<iLen;++i){
			// 	io = _tmp.OutBlock_1[ i ];
			// 	global.Stock.BasicInfo[ io.ISU_SRT_CD ] = io;
			// }
			cbFunction( data );
		})
	}

	global.getMarketIndex = function(cbFunction){
		webview.executeJavaScript(`

		new Promise((resolve, reject) => {
			var xhr = new XMLHttpRequest();
			xhr.onload = function() {
			  if (xhr.status === 200 || xhr.status === 201) {
				resolve( xhr.responseText )
			  } else {
				console.error(xhr.responseText);
			  }
			};
			
			xhr.open('GET', "https://finance.daum.net/api/quotes/today?type=DOMESTIC");
			xhr.send();
		});

		`
		).then(function(data){
			
			//여기서처리해야함
			var _tmp = JSON.parse( data );
			console.log( _tmp )
			
			// var i = 0,iLen=_tmp.OutBlock_1.length,io
			// for(;i<iLen;++i){
			// 	io = _tmp.OutBlock_1[ i ];
			// 	global.Stock.BasicInfo[ io.ISU_SRT_CD ] = io;
			// }
			cbFunction( data );
		})
	}

	global.getMarketIndexGlobal = function(cbFunction){
		webview.executeJavaScript(`

		new Promise((resolve, reject) => {
			var xhr = new XMLHttpRequest();
			xhr.onload = function() {
			  if (xhr.status === 200 || xhr.status === 201) {
				resolve( xhr.responseText )
			  } else {
				console.error(xhr.responseText);
			  }
			};
			
			xhr.open('GET', "https://finance.daum.net/api/global/quotes?isMobile=true");
			xhr.send();
		});

		`
		).then(function(data){
			
			//여기서처리해야함
			var _tmp = JSON.parse( data );
			console.log( _tmp )
			
			// var i = 0,iLen=_tmp.OutBlock_1.length,io
			// for(;i<iLen;++i){
			// 	io = _tmp.OutBlock_1[ i ];
			// 	global.Stock.BasicInfo[ io.ISU_SRT_CD ] = io;
			// }
			cbFunction( data );
		})
	}

	global.getCandle5 = function(cd,cbFunction){
		// var _q = decodeURIComponent( q )
		webview.executeJavaScript(`

		new Promise((resolve, reject) => {
			var xhr = new XMLHttpRequest();
			//var param = "bld=dbms/MDC/STAT/standard/MDCSTAT01901&locale=ko_KR&mktId=ALL&share=1&csvxls_isNo=false"

			xhr.onload = function() {
			  if (xhr.status === 200 || xhr.status === 201) {
				resolve( xhr.responseText )
			  } else {
				console.error(xhr.responseText);
			  }
			};
			
			xhr.open('GET', "https://finance.daum.net/api/charts/A${cd}/5/minutes?limit=200&adjusted=true");
			//xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			xhr.send();
		});

		`
		).then(function(data){
			
			//여기서처리해야함
			var _data = JSON.parse( data );


			console.log( _data )
			
			// var i = 0,iLen=_tmp.OutBlock_1.length,io
			// for(;i<iLen;++i){
			// 	io = _tmp.OutBlock_1[ i ];
			// 	global.Stock.BasicInfo[ io.ISU_SRT_CD ] = io;
			// }
			cbFunction( _data.data );
		})
	}


	global.getTraderRank = function(cd,cbFunction){
		// var _q = decodeURIComponent( q )
		webview.executeJavaScript(`
		
		window._r = {};
		new Promise((resolve, reject) => {
			var xhr = new XMLHttpRequest();
			//var param = "bld=dbms/MDC/STAT/standard/MDCSTAT01901&locale=ko_KR&mktId=ALL&share=1&csvxls_isNo=false"

			xhr.onload = function() {
			  if (xhr.status === 200 || xhr.status === 201) {
				window._r.a = JSON.parse( xhr.responseText )
				//resolve( xhr.responseText )
				resolve()
			  } else {
				console.error(xhr.responseText);
			  }
			};
			
			xhr.open('GET', "https://finance.daum.net/api/trader/ranks?symbolCode=A${cd}&BidFieldName=bidAccTradeVolume&BidOrder=asc&AskFieldName=askAccTradeVolume&AskOrder=asc&intervalType=TODAY&limit=10");
			//xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			xhr.send();
		}).then(function(d){
			return new Promise((resolve, reject) => {
			var xhr = new XMLHttpRequest();
			//var param = "bld=dbms/MDC/STAT/standard/MDCSTAT01901&locale=ko_KR&mktId=ALL&share=1&csvxls_isNo=false"

			xhr.onload = function() {
			  if (xhr.status === 200 || xhr.status === 201) {
				window._r.b = JSON.parse( xhr.responseText )
				//resolve( xhr.responseText )
				resolve()
			  } else {
				console.error(xhr.responseText);
			  }
			};
			
			xhr.open('GET', "https://finance.daum.net/api/trader/ranks?symbolCode=A${cd}&BidFieldName=bidAccTradeVolume&BidOrder=desc&AskFieldName=askAccTradeVolume&AskOrder=desc&intervalType=TODAY&limit=10");
			//xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			xhr.send();
			})
		})
		.then(function(d){
			return window._r
		});

		`
		).then(function(data){
			
			//여기서처리해야함
			//var _data = JSON.parse( data );

			var o = {};
			if( data.a.BID.data == null || data.a.ASK.data == null ) cbFunction( o )
			var nArr = data.a.ASK.data.concat( data.b.ASK.data ).concat( data.a.BID.data ).concat( data.b.BID.data )

			var i = 0,iLen = nArr.length,io;
			for(;i<iLen;++i){
				io = nArr[ i ];
				o[ io.traderName ] = io;
			}

			// console.log( o )
			cbFunction( o );
		})
	}
	
	// global.getAgencyInfo = function(cd,date,cbFunction){
		
	// 	var param00 = encodeURIComponent( cd + "/" + global.Stock.BasicInfo[ cd ].ISU_ABBRV )
	// 	var param01 = encodeURIComponent( global.Stock.BasicInfo[ cd ].ISU_ABBRV )
	// 	var cd00 = global.Stock.BasicInfo[ cd ].ISU_CD;
	// 	var cd01 = global.Stock.BasicInfo[ cd ].ISU_CD;
	// 	var date =  date || "20220128"

	// 	webview.executeJavaScript(`

	// 	new Promise((resolve, reject) => {
	// 		var xhr = new XMLHttpRequest();
	// 		var param = "bld=dbms/MDC/STAT/standard/MDCSTAT02301&locale=ko_KR&inqTpCd=1&trdVolVal=2&askBid=3&tboxisuCd_finder_stkisu0_2=${param00}&isuCd=${cd00}&isuCd2=${cd01}&codeNmisuCd_finder_stkisu0_2=%EC%B9%B4%EC%B9%B4%EC%98%A4&param1isuCd_finder_stkisu0_2=ALL&strtDd=${date}&endDd=${date}&share=1&money=1&csvxls_isNo=false"

	// 		xhr.onload = function() {
	// 		  if (xhr.status === 200 || xhr.status === 201) {
	// 			resolve( xhr.responseText )
	// 		  } else {
	// 			console.error(xhr.responseText);
	// 		  }
	// 		};

	// 		xhr.open('POST', 'http://data.krx.co.kr/comm/bldAttendant/getJsonData.cmd');
	// 		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	// 		xhr.send(param);
	// 	});

	// 	`
	// 	).then(function(data){
			
	// 		//여기서처리해야함
	// 		console.log( JSON.parse( data ) )
	// 		cbFunction( data );
	// 	})
	// }
	

	// global.getAllAgencyInfoByDaily = function( date ){

	// 	var cd = global.getAllAgencyInfoByDaily.keyArr[ global.getAllAgencyInfoByDaily.cnt ];
	// 	console.log( cd );
	// 	global.getAgencyInfo( cd,date,function(d){
	// 		fs.writeFileSync( "./data/agency/" + date + "/" + cd + ".json",d,{flag : "w"} )
	// 		if( global.getAllAgencyInfoByDaily.keyArr.length - 1 == global.getAllAgencyInfoByDaily.cnt )
	// 		{
	// 			console.log( "end" )
	// 			return;
	// 		}
	// 		else
	// 		{
	// 			++global.getAllAgencyInfoByDaily.cnt;
	// 			setTimeout(function(){
	// 				global.getAllAgencyInfoByDaily( date );
	// 			},1000)
				
	// 		}
	// 	} )
	// }

	// global.getAllAgencyInfoByDaily.init = function(){
	// 	if( Object.keys( global.Stock.BasicInfo ).length > 0 )
	// 	{
	// 		console.log( "global.Stock.BasicInfo is Loaded!" )
	// 		global.getAllAgencyInfoByDaily.cnt = 0;
	// 		global.getAllAgencyInfoByDaily.keyArr = Object.keys( global.Stock.BasicInfo )	
	// 	}
	// 	else
	// 	{
	// 		console.log( "global.Stock.BasicInfo is not Load!" )
	// 		setTimeout(function(){
	// 			global.getAllAgencyInfoByDaily.init();
	// 		},1000)
	// 	}
	// }
	
	// global.getAllAgencyInfoByDaily.init();

	
	

	global.server = http.createServer(function(req, res){

		req.on('error', function( err ){
			console.error(err);
			res.statusCode = 400;
			res.end('400: Bad Request');
			return;
		});
	
		res.on('error', function( err ){ console.error(err); });
		
	
		req.url = decodeURIComponent(req.url);
		//var routerNm = req.url.replace(/\//,"");
		var routerNm = req.url.split("?")[0];
	
		if (req.method == 'POST') {
			var _d = '';
	
			req.on('data', function (data) {
				_d += data;
			});
	
			req.on('end', function () {
				//console.log(JSON.parse(_d));
				res.statusCode = 200;
				global.ROUTER_LIST[ routerNm ]( req, res, _d );
			});
		}
		else
		{
			if( req.url == "/" )
			{
				//res.end( JSON.stringify( fs.readdirSync( ROUTER_DIRECTORY_PATH ) ) );
				res.writeHead(200, { 'Content-Type': 'text/html;charset=UTF-8' });	
	
				fs.readFile("./index.html", function(error, content) {
					if(error)
					{
						if(error.code == 'ENOENT')
						{
							res.statusCode = 404;
							res.end('404: File Not Found');
						}
						else
						{
							res.writeHead(500);
							res.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
							res.end(); 
						}
					}
					else
					{
						res.end(content.toString(), 'utf-8');
					}
				});
			}
			else if( global.ROUTER_LIST[ routerNm ] )
			{
				res.statusCode = 200;
				global.ROUTER_LIST[ routerNm ]( req, res );
			}
			else
			{
				var filePath = '.' + req.url.split("?")[0];
				console.log( filePath );
				var extname = path.extname(filePath);
				
				var _oContentTypes = {
					".aac": "audio/aac",
					".abw": "application/x-abiword",
					".arc": "application/octet-stream",
					".avi": "video/x-msvideo",
					".azw": "application/vnd.amazon.ebook",
					".bin": "application/octet-stream",
					".bz": "application/x-bzip",
					".bz2": "application/x-bzip2",
					".csh": "application/x-csh",
					".css": "text/css",
					".csv": "text/csv",
					".doc": "application/msword",
					".epub": "application/epub+zip",
					".gif": "image/gif",
					".html": "text/html",
					".htm": "text/html",
					".ico": "image/x-icon",
					".ics": "text/calendar",
					".jar": "application/java-archive",
					".jpeg.jpg": "image/jpeg",
					".jpg.jpg": "image/jpeg",
					".js": "application/js",
					".json": "application/json",
					".midi": "audio/midi",
					".mid": "audio/midi",
					".mpeg": "video/mpeg",
					".mpkg": "application/vnd.apple.installer+xml",
					".odp": "application/vnd.oasis.opendocument.presentation",
					".ods": "application/vnd.oasis.opendocument.spreadsheet",
					".odt": "application/vnd.oasis.opendocument.text",
					".oga": "audio/ogg",
					".ogv": "video/ogg",
					".ogx": "application/ogg",
					".pdf": "application/pdf",
					".ppt": "application/vnd.ms-powerpoint",
					".rar": "application/x-rar-compressed",
					".rtf": "application/rtf",
					".sh": "application/x-sh",
					".svg": "image/svg+xml",
					".swf": "application/x-shockwave-flash",
					".tar": "application/x-tar",
					".tiff": "image/tiff",
					".tif": "image/tiff",
					".ttf": "application/x-font-ttf",
					".vsd": "application/vnd.visio",
					".wav": "audio/x-wav",
					".weba": "audio/webm",
					".webm": "video/webm",
					".webp": "image/webp",
					".woff": "application/x-font-woff",
					".xhtml": "application/xhtml+xml",
					".xls": "application/vnd.ms-excel",
					".xml": "application/xml",
					".xul": "application/vnd.mozilla.xul+xml",
					".zip": "application/zip",
				//    ".3gp": "video/3gpp\naudio/3gpp if it doesn't contain video",
				//    ".3g2": "video/3gpp2\naudio/3gpp2 if it doesn't contain video",
					".7z": "application/x-7z-compressed"
				};
				var contentType = _oContentTypes[ extname ];
				res.writeHead(200, { 'Content-Type': contentType + ';charset=UTF-8' });	
	
				fs.readFile(filePath, function(error, content) {
					if(error)
					{
						if(error.code == 'ENOENT')
						{
							res.statusCode = 404;
							res.end('404: File Not Found');
						}
						else
						{
							res.writeHead(500);
							res.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
							res.end(); 
						}
					}
					else
					{
						res.end(content.toString(), 'utf-8');
					}
				});
			}
		}
	

		return;

	})

	//--------------------------------------------------;
	//--------------------------------------------------;
	//--------------------------------------------------;
	//--------------------------------------------------;
	//--------------------------------------------------;
	//웹소켓연결부분;

	//global.wss = new WebSocket.Server({ server : global.server });
	//global.ws = {};
	//global.ws.clients = {};
	//global.wss.on('connection', function connection( ws ) {

	//  ws.on('message', function incoming( message ){
	//	console.log('received: %s', message);
	//  });
	//   ws.on('close', function close() {
	//	console.log('disconnected SOCKET - PORT : 5000');
	//  });
	//  //var r = {	type : "connection", data : id };
	//  //global.ws.send( JSON.stringify( r ) );
	//});
	//--------------------------------------------------;
	//--------------------------------------------------;
	//--------------------------------------------------;
	//--------------------------------------------------;
	//--------------------------------------------------;
	//--------------------------------------------------;
	console.log( global.server )
	global.server.listen( server_port );
	
	//Stock-기본정보로드;
	//global.getAllStockInfo(function(d){ console.log("Basic Data Load Complete!")  });

	})
}


//-------------------------;
//-------------------------;
//-------------------------;
//-------------------------;
//----------------------------------------------------------------------------------------------------;
if( console ) console.log( "[ E ] - " + fileNm + "----------" );
//----------------------------------------------------------------------------------------------------;