// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron');
const opcua = require("node-opcua");
const path = require('path');
const async = require("async");

let mainWindow;

//opcua client variables
let endpointUrl;  //url of opcua server
let varName;      //variable to watch
let the_session;  //connection session

//create the client object
let opcuaClient = opcua.OPCUAClient.create({
  endpoint_must_exist: false
});

//OPCUA Client Backoff
client.on("backoff", (retry, delay) =>
  console.log(
    "still trying to connect to ",
    endpointUrl,
    ": retry =",
    retry,
    "next attempt in ",
    delay / 1000,
    "seconds"
  )
);

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
    mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


ipcMain.handle('SendServerInfo', (event, arg) => {
  console.log(arg) // prints "ping"
  
  
  async.series([
    // step 1 : connect to
    function(callback)  {
      client.connect(endpointUrl, function(err) {
        if (err) {
          console.log(" cannot connect to endpoint :", endpointUrl);
        } else {
          console.log("connected !");
        }
        callback(err);
      });
  },

  // step 2 : createSession
  function(callback) {
      client.createSession(function(err, session) {
        if (err) {
          return callback(err);
        }
        the_session = session;
        callback();
      });
  },

  // step 4 : read a variable with readVariableValue
  function(callback) {
     the_session.readVariableValue("ns=1;s=free_memory", function(err, dataValue) {
       if (!err) {
         console.log(" free mem % = ", dataValue.value.value.toString());
       }
       callback(err);
     });
  },
  // close session
  function(callback) {
      the_session.close(function(err) {
        if (err) {
          console.log("closing session failed ?");
        }
        callback();
      });
  }
  ],function(err) {
    if (err) {
        console.log(" failure ",err);
    } else {
        console.log("done!");
    }
    client.disconnect(function(){});
  });
});