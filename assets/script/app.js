const getValueButton = document.getElementById("getValueButton");
const startMonitorButton = document.getElementById("startMonitorButton");
const stopMonitorButton = document.getElementById("stopMonitorButton");

const serverIP = document.getElementById("serverIP");
const varName = document.getElementById("varName");
const monitoringTime = document.getElementById("monitoringTime");
const pollingTime = document.getElementById("pollingTime");

const { ipcRenderer } = require('electron');




getValueButton.addEventListener("click", function(){

    ipcRenderer.invoke("SendServerInfo", [
        serverIP.value.toString(),
        varName.value.toString(),
        parseInt(monitoringTime.value),
        parseInt(pollingTime.value)
    ]);

});