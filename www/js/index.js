if(window.localStorage.getItem("token") == null) {
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
		if(window.localStorage.getItem("token") != null) {
			document.getElementById("index-content").innerHTML = "<p>Welcome back!</p>";
			phonon.navigator().changePage('pagetwo');
		}
	});
});

app.on({page: 'registration', preventClose: true, content: 'registration.html'});

app.on({page: 'pagetwo', preventClose: true, content: 'pagetwo.html', readyDelay: 1}, function(activity) {
    var onAction = function(evt) {
    };

    activity.onCreate(function() {
    });

    activity.onClose(function(self) {
    });
});

app.on({page: 'myhousing', preventClose: true, content: 'myHousing.html', readyDelay: 1}, function(activity) {
    var onAction = function(evt) {
    };

    activity.onCreate(function() {
    });

    activity.onClose(function(self) {
    });
});

app.on({page: 'pinchange', preventClose: true, content: 'pinchange.html', readyDelay: 1}, function(activity) {
    var onAction = function(evt) {
    };

    activity.onCreate(function() {
    });

    activity.onClose(function(self) {
    });
});

app.start();

function login() {
    console.log("asdf");
    // Get data ex: var value = window.localStorage.getItem("key");
    var user = document.getElementById("username").value;
    var pass = document.getElementById("password").value;
    var dataToSend = JSON.stringify({"username": user, "password": pass});
    
    var req = $.ajax({
	method: 'POST',
	contentType: "application/json",
	data: dataToSend,
	dataType: 'json',
	url: 'https://jrvcd.xyz:9001/login',
	crossDomain: true,
	dataType: 'json',
	success: function(res) {
	    window.localStorage.setItem("token", dataToSend);
	    location.href = "#!pagetwo"
	}
    });
}

function register() {
    // Get data ex: var value = window.localStorage.getItem("key");
    var user = document.getElementById("username-reg").value;
    var email = document.getElementById("email-reg").value;
    var pass = document.getElementById("password-reg").value;
    
    var req = $.ajax({
	    method: 'POST',
	    data: {"username": user, "email": email, "password": pass},
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
    var authInfo = window.localStorage.getItem("token");
    var req = $.ajax({
		method: 'POST',
        data: {"username": authInfo.username, "password": authInfo.password},
		url: 'https://jrvcd.xyz:9000/pin/change',
		crossDomain: true,
		dataType: 'json',
		success: function(res) {
			phonon.notif('Your new pin is ' + res.newPin + '. Make sure to get your MaineCard re-programmed in your building lobby.', 5000, false);
		}
	});
}
