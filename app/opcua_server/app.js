const { OPCUAClient, TimestampsToReturn } = require("node-opcua");
const {readFileSync, writeFile}=require("fs")
const app=require("express")()
const _=require("lodash")
const {itemsToMonitor}=require('./items')
const endpointUrl = "opc.tcp://192.168.54.54:49320";
//const endpointUrl = "opc.tcp://192.168.241.1:49320";
const port=5000

let client, session, subscription;
const data=_.times(itemsToMonitor.length,_.stubArray)

async function createOPCUAClient() {
    
    client = OPCUAClient.create({
      endpointMustExist: false,
    });
    client.on("backoff", (retry, delay) => {
      console.log("Retrying to connect to ", endpointUrl, " attempt ", retry);
    });
    console.log(" connecting to ", endpointUrl);
    await client.connect(endpointUrl);
    console.log(" connected to ", endpointUrl);
  
    session = await client.createSession();
    console.log(" session created");
  
    subscription = await session.createSubscription2({
      requestedPublishingInterval: 250,
      requestedMaxKeepAliveCount: 50,
      requestedLifetimeCount: 6000,
      maxNotificationsPerPublish: 1000,
      publishingEnabled: true,
      priority: 10,
    });
  
    subscription
      .on("keepalive", function () {
        console.log("keepalive");
      })
      .on("terminated", function () {
        console.log(" TERMINATED ------------------------------>");
      });


    
    const parameters = {
      samplingInterval: 100,
      discardOldest: true,
      queueSize: 100,
    };
    const monitoredItem = await subscription.monitorItems(
      itemsToMonitor,
      parameters,
      TimestampsToReturn.Both
    );
    
    monitoredItem.on("changed", (monitoredItem,dataValue,index) => {
      
      data[index][0]=(monitoredItem.itemToMonitor.nodeId.value)
      data[index][1]=(dataValue.value.value)
      console.log(data)
      const datasUpdated = data.map(kk => {
        const dataCopy = { ...kk };
        return dataCopy;
      });
      
      writeFile("./data_async.json",JSON.stringify(datasUpdated),{encoding:'utf-8',flag:'w'},(res)=>{console.log(res)})
      
      console.log(typeof file)
      app.get('/api', (req, res) => {
        
        res.json(JSON.parse(readFileSync('./data_async.json', 'utf8')));
        
    })
    });    
  }
  
  async function stopOPCUAClient() {
    if (subscription) await subscription.terminate();
    if (session) await session.close();
    if (client) await client.disconnect();
  }

  (async () => {
    try {

      app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
      })

      createOPCUAClient();
     
  
      // detect CTRL+C and close
      process.once("SIGINT", async () => {
        console.log("shutting down client");
  
        await stopOPCUAClient();
        console.log("Done");
        process.exit(0);
      });
    } catch (err) {
      console.log("Error" + err.message);
      console.log(err);
      process.exit(-1);
    }
  })();