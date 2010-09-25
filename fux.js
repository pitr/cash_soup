var sessionToken = '';
var checkDelay = 3000;

var symbols = [
//EUR/USD, USD/JPY, GBP/USD, AUD/USD, USD/CHF and USD/CAD
	{ key: "EUR/USD", data: null},
	{ key: "USD/CAD", data: null}
];

function refreshTable() {
	$.each(symbols,
		function(i, symbol) {
			$('#datatable tr[data-symbol='+ symbol.key +'] td.ask').html(symbol.data.ask);
		}
	);
}

function startGettingRates() {
	$.each(symbols,
		function(i, symbol) {
			setTimeout(function() { getRate(symbol) }, checkDelay);
		}
	);
	setInterval(refreshTable, 1000);
}

// Get the rate from OANDA for a given Symbol, and then set a timeout to call itself
function getRate(symbol) {
	console.log('getting rate for: ' + symbol.key);
	OANDA.rate.quote(sessionToken, [symbol.key], function(rateResponse)  {
		symbol.data = rateResponse.prices[0];
		console.log(symbol.data);
		setTimeout(function(){getRate(symbol);}, checkDelay);
	});	
}

$(document).ready(function(){
	OANDA.user.login("testusr2", "Passw0rd", function(loginResponse) {
	/*        OANDA.account.list(loginResponse.session_token, function(accountListResponse) {
	            OANDA.trade.list(loginResponse.session_token, accountListResponse.account_list[0].id, function(tradeListResponse) {
	                console.log(tradeListResponse);
	            });
	        });
	*/		
			// hide splash page and show the main canvas
			$('#splash').fadeOut('fast', function() { $('#main').fadeIn('slow');  });
			sessionToken = loginResponse.session_token;
			startGettingRates();
	});	
}); 
