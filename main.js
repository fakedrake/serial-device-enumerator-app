window.onload = function() {
    chrome.serial.getDevices(function(ports) {
        var devices = document.getElementById('devices');
        devices.innerHTML = JSON.stringify(ports, null, 2);
    });
}
