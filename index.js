require('dotenv').config();

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

blockTransactionsCallback = function(response){
    let chunks = '';
    console.log(`statusCode: ${response.statusCode}`)
    response.on('data', d => {
        chunks += d;
    })
    response.on('end', ()=>{
        let schema = JSON.parse(chunks);
        let transactions = schema['result']['transactions']
        // console.log(transactions)
        console.log(transactions.length)
        for (let i = 0; i < transactions.length; i++) {
            if(transactions[i]["to"] == walletAddress || transactions[i]["from"] == walletAddress){
                console.log(transactions[i])
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
const walletAddress = '0xa7206d878c5c3871826dfdb42191c49b1d11f466'
let previousBlock = 0;
var the_interval = 5 * 1000;
setInterval(getLatestBlockNumber, the_interval);