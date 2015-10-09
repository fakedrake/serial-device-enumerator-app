function createConnectionButton (port) {
    var connectionElement = document.getElementById('conn-' + port.path),
	buttonElement = document.getElementById('btn-' + port.path);

    function connect () {
	buttonElement.disabled = true;

	chrome.serial.connect(port.path, {name: port.path, bitrate: 9200}, function () {
	    buttonElement.innerHTML = "Connected";
	});
    }


    if (!buttonElement) {
	buttonElement = document.createElement('button');
	buttonElement.id = 'btn-' + port.path;
	buttonElement.innerHTML = 'Unknown state';
	buttonElement.disabled = true;
	connectionElement.appendChild(buttonElement);
    }

    chrome.serial.getConnections(function (connections) {
	var handlers = connections.filter(function (c) {return c == port.path;}),
	    handler = handlers.length > 0? handlers[0]: null,
	    connected = !!handler;

	function disconnect (handler) {
	    buttonElement.disabled = true;

	    chrome.serial.disconnect(handler, function () {
		buttonElement.innerHTML = "Disonnected";
	    });
	}

	// Set connected state and change it if we were wrong
	buttonElement.disabled = false;
	buttonElement.onclick = connect;
	buttonElement.innerHTML = "Connect";
	if (!connected) return;

	buttonElement.onclick = disconnect;
	buttonElement.innerHTML = "Disconnect";
    });
}

function createConnectionDiv (port) {
    var parent = document.getElementById('connections'),
	connectionElement = document.getElementById('conn-' + port.path);

    if (!connectionElement) {
	connectionElement = document.createElement('div');
	connectionElement.innerHTML = port.path;
	connectionElement.id = 'conn-' + port.path;
	parent.appendChild(connectionElement);
    }

    createConnectionButton(port);
}

function updateDevices () {
    var devices = document.getElementById('devices');
    chrome.serial.getDevices(function(ports) {
        devices.innerHTML = JSON.stringify(ports, null, 2);
    }); 
}

function updateConnections () {
    var econnections = document.getElementById('connections'),
	connectionDict = {};
    chrome.serial.getDevices(function(ports) {
	ports.forEach(createConnectionDiv);
    }); 

}

function receiveErrorHandler (info) {
    var errs = document.getElementById('receive-errors');
    errs.innerHTML = "[" + new Date.toTimeString() + "] " + JSON.stringify(info, null, 2);
}

window.onload = function () {
    chrome.serial.onReceiveError.addListener(receiveErrorHandler);
    setInterval(updateConnections, 500);
    setInterval(updateDevices, 500);
}
