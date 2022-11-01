require('dotenv').config();
const { App } = require('@slack/bolt')
const https = require('https');
const projectId = process.env.API_KEY;

const options = {
    host: 'mainnet.infura.io',
    port: 443,
    path: '/v3/' + projectId,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
      },
}
const slackApp = new App({
    token: process.env.BOT_OAUTH_TOKEN,
    signingSecret: process.env.SIGNING_SECRET
  });

blockTransactionsCallback = function(response){
    const walletAddress = "0x503828976d22510aad0201ac7ec88293211d23da";
    let chunks = '';
    console.log(`statusCode: ${response.statusCode}`)
    response.on('data', d => {
        chunks += d;
    })
    response.on('end', ()=>{
        let schema = JSON.parse(chunks);
        let transactions = schema['result']['transactions'];
        // console.log(transactions)
        console.log(transactions.length);
        for (let i = 0; i < transactions.length; i++) {
            // console.log(transactions[i]["from"]);
            // console.log(walletAddress);
            if(transactions[i]["to"] == walletAddress || transactions[i]["from"] == walletAddress){
                console.log(transactions[i]);
                (async () => {
                    const result = await slackApp.client.chat.postMessage({
                      token: process.env.BOT_OAUTH_TOKEN,
                      channel: "C049E92RDLH",
                      text: transactions[i]
                    });
                    console.log(result);
                  })();
            }
          }
    })
    response.on('error', error => {
        console.error(error)
    })
}

function getTransactions(latestCompleteBlock){
    let blockNumber = "0x"+latestCompleteBlock.toString(16);
    const data = JSON.stringify({
        "jsonrpc":"2.0",
        "method":"eth_getBlockByNumber",
        "params": [blockNumber,true],
        "id":1
    })
    var req = https.request(options, blockTransactionsCallback);
    req.write(data);
    req.end();
}

latestBlockCallback = function(response){
    console.log(`statusCode: ${response.statusCode}`)
    response.on('data', d => {
        var obj = JSON.parse(d);
        latestBlock = parseInt(obj["result"],16)
        if(latestBlock != previousBlock){
            console.log(latestBlock);
            getTransactions(previousBlock);
            previousBlock = latestBlock;
        }
    })
    response.on('error', error => {
        console.error(error)
    })
}
function getLatestBlockNumber(){
    const data = JSON.stringify({
        "jsonrpc":"2.0","method":"eth_blockNumber","params": [],"id":1
      })
    var req = https.request(options, latestBlockCallback);
    req.write(data);
    req.end();
     
  }

let previousBlock = 0;
var the_interval = 5 * 1000;
setInterval(getLatestBlockNumber, the_interval);