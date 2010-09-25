var sessionToken = '';
var checkDelay = 3000;

var symbols = [
//USD/JPY, GBP/USD, AUD/USD, USD/CHF
	{ key: "EUR/USD", data: null, scale: 1.308, color: [0, 1, 81, 103]}, // default blue color:  0, 1, 81, 103 
	{ key: "USD/CAD", data: null, scale: 1.026, color: [81, 1, 0, 103]},
	{ key: "USD/CHF", data: null, scale: 1.014, color: [11, 100, 0, 103]},
//	{ key: "USD/JPY", data: null, scale: 84.0, color: [81, 19, 0, 103]},
	{ key: "GBP/USD", data: null, scale: 1.563, color: [41, 30, 200, 103]},
	//{ key: "AUD/USD", data: null, scale: 0.900, color: [10, 100, 10, 103]} 
];

// refresh the data table
function refreshTable() {
	$.each(symbols,
		function(i, symbol) {
			if (symbol.data) {
				$('#datatable tr[data-symbol='+ symbol.key +'] td.ask').html(symbol.data.ask);
			}
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
	OANDA.rate.quote(sessionToken, [symbol.key], function(rateResponse)  {
		symbol.data = rateResponse.prices[0];
		setTimeout(function(){getRate(symbol);}, checkDelay);
	});	
}

$(document).ready(function(){
	OANDA.user.login("testusr2", "Passw0rd", function(loginResponse) {
			// hide splash page and show the main canvas
			$('#splash').fadeOut('fast', function() { $('#main').fadeIn('slow');  });
			sessionToken = loginResponse.session_token;
			startGettingRates();
	});	
}); 
