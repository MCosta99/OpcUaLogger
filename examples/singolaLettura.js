/*global require,console,setTimeout */
const opcua = require("node-opcua");
const async = require("async");

const endpointUrl = "opc.tcp://" + require("os").hostname() + ":4334/UA/MyLittleServer";
const client = opcua.OPCUAClient.create({
    endpoint_must_exist: false
});
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


let the_session, the_subscription;

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

],
function(err) {
    if (err) {
        console.log(" failure ",err);
    } else {
        console.log("done!");
    }
    client.disconnect(function(){});
}) ;