const { AttributeIds, OPCUAClient, TimestampsToReturn } = require("/Users/aengin/Desktop/Project/opcua-remix/node_modules/node-opcua");
const endpointUrl = "opc.tcp://192.168.54.54:49320";
const {writeFileSync, readFileSync,appendFileSync, writeFile}=require("fs")
const app=require("express")()
const port=5000




let client, session, subscription;
const data=[[0,0],[0,0]]
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

    const itemsToMonitor = [
        {
            nodeId: "ns=2;s=MelaminPres5.KOM3060-S0.PRESLENEN_LEVHA_ADET",
            //attributeId: AttributeIds.Value,
        },
        {
            nodeId: "ns=2;s=MelaminPres5.KOM3060-S0.HIDROLIK_YAG_SICAKLIGI",
            //attributeId: AttributeIds.Value,
        }
    ];

    
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
      
      
      //console.log(monitoredItem.itemToMonitor.nodeId.value);
      //console.log(dataValue.value.value)
      //console.log(dataValue)
      data[index][0]=(monitoredItem.itemToMonitor.nodeId.value)
      data[index][1]=(dataValue.value.value)
      console.log(data)
      
      //console.log(data)
      writeFile("./data_async.json",JSON.stringify({data}),{encoding:'utf-8',flag:'w'},(res)=>{console.log(res)})
      //writeFileSync("./data.json",JSON.stringify({index:index,value:(dataValue.value.value),item:(monitoredItem.itemToMonitor.nodeId.value)}),'utf-8')
      //appendFileSync("./data.json",JSON.stringify({"index":index,"value":(dataValue.value.value),"item":(monitoredItem.itemToMonitor.nodeId.value)}),'utf-8')
      
      data_json=JSON.parse(readFileSync('./data_async.json', 'utf8'));
      app.get('/api', (req, res) => {
      res.json(data_json)
      
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