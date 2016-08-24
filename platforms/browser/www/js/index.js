if(window.localStorage.getItem("token") == null || window.localStorage.getItem("token") == "") {
    phonon.options({
        navigator: {
            defaultPage: 'home',
            animatePages: true,
            enableBrowserBackButton: true,
            templateRootDirectory: './tpl'
        },
        i18n: null // for this example, we do not use internationalization
    });
} else {
    phonon.options({
        navigator: {
            defaultPage: 'pagetwo',
            animatePages: true,
            enableBrowserBackButton: true,
            templateRootDirectory: './tpl'
        },
        i18n: null // for this example, we do not use internationalization
    });
}

var app = phonon.navigator();

app.on({page: 'home', preventClose: false, content: null}, function(activity) {
	activity.onCreate(function() {
		if(window.localStorage.getItem("token") != null || window.localStorage.getItem("token") == "") {
			document.getElementById("index-content").innerHTML = "<p>Welcome back!</p>";
			phonon.navigator().changePage('pagetwo');
		}
	});
});

app.on({page: 'registration', preventClose: true, content: 'registration.html'});

app.on({page: 'pagetwo', preventClose: true, content: 'pagetwo.html', readyDelay: 1});

app.on({page: 'myhousing', preventClose: true, content: 'myHousing.html', readyDelay: 1});

app.on({page: 'roomassignment', preventClose: true, content: 'roomassignment.html', readyDelay: 1}, function(activity) {
    var onAction = function(evt) {
    };

    activity.onCreate(function() {
	var authInfo = JSON.parse(window.localStorage.getItem("token"));
	var req = $.ajax({
		    method: 'GET',
		    contentType: "application/json",
		    data: {"username": authInfo.username, "password": authInfo.password},
		    url: 'https://jrvcd.xyz:9000/assignment',
		    crossDomain: true,
		    success: function(res) {
			document.getElementById("roomassignment-loading").remove();
			document.getElementById("roomassignment").innerHTML = '<li class="padded-list"><b>Room: </b>' + res.assignment.room + '</li>';
			document.getElementById("roomassignment").innerHTML += '<li class="padded-list"><b>Room Type: </b>' + res.assignment.type + '</li>';
			document.getElementById("roomassignment").innerHTML += '<li class="padded-list"><b>Meal Plan: </b>' + res.assignment.mealPlan + '</li>';
			document.getElementById("roomassignment").innerHTML += '<li class="padded-list"><b>Address: </b>' + res.assignment.address + '</li>';
		    }
	    });
	});

    activity.onClose(function(self) {
    });
});

app.on({page: 'pinchange', preventClose: true, content: 'pinchange.html', readyDelay: 1});

app.start();

function login() {
    // Get data ex: var value = window.localStorage.getItem("key");
    var user = document.getElementById("username").value;
    var pass = document.getElementById("password").value;
    var dataToSend = JSON.stringify({"username": user, "password": pass});
    window.localStorage.setItem("token", dataToSend);
    location.href = "#!pagetwo"
/*    
    var req = $.ajax({
	method: 'POST',
	contentType: "application/json",
	data: dataToSend,
	url: 'https://jrvcd.xyz:9001/login',
	crossDomain: true,
	dataType: 'json',
	success: function(res) {
	    window.localStorage.setItem("token", dataToSend);
	    location.href = "#!pagetwo"
	}
    });
*/
}

function register() {
    // Get data ex: var value = window.localStorage.getItem("key");
    var user = document.getElementById("username-reg").value;
    var email = document.getElementById("email-reg").value;
    var pass = document.getElementById("password-reg").value;
    
    var req = $.ajax({
	    method: 'POST',
	    contentType: "application/json",
	    data: JSON.stringify({"username": user, "email": email, "password": pass}),
	    url: 'https://jrvcd.xyz:9001/register',
	    crossDomain: true,
	    dataType: 'json',
	    success: function(res) {
		phonon.notif('Please check your email for a confirmation link', 3000, false);
		location.href = "#!home";
	    },
	});
    }

function changePin() {
    var authInfo = JSON.parse(window.localStorage.getItem("token"));
    var req = $.ajax({
		method: 'POST',
		contentType: "application/json",
		data: JSON.stringify({"username": authInfo.username, "password": authInfo.password}),
		url: 'https://jrvcd.xyz:9000/pin/change',
		crossDomain: true,
		dataType: 'json',
		success: function(res) {
			phonon.notif('Your new pin is ' + res.newPin + '.', 5000, false);
		}
	});
}
