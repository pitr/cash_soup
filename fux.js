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
	$('#splashstatus').html('Getting Rates!');
	$.each(symbols,
		function(i, symbol) {
			setTimeout(function() { startDemo(); getRate(symbol) }, checkDelay);
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

function startDemo() {
	$('#splashstatus').html('Displaying Canvas!');
	$('#splash').fadeOut('fast', function() { $('#main').fadeIn('slow');  });
	started = true;
}

$(document).ready(function(){
	$('#splashstatus').html('Connecting!');
	$('#splashimage').fadeTo(3000, 1.0);
	OANDA.user.login("testusr2", "Passw0rd", function(loginResponse) {
			// hide splash page and show the main canvas
			sessionToken = loginResponse.session_token;
			startGettingRates();
	});	
}); 
