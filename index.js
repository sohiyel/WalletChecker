require('dotenv').config();

const https = require('https');
const projectId = process.env.API_KEY;
const data = JSON.stringify({
    "jsonrpc":"2.0","method":"eth_blockNumber","params": [],"id":1
  })

const options = {
    host: 'mainnet.infura.io',
    port: 443,
    path: '/v3/' + projectId,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
      },
};
const getBlockNumber = https.request(options, getBlockNumber => {
    console.log(`statusCode: ${getBlockNumber.statusCode}`)

    getBlockNumber.on('data', d => {
    process.stdout.write(d)

    var obj = JSON.parse(d);
    var latestBlock = parseInt(obj["result"],16) - 1
    var latestCompleteBlock = "0x"+latestBlock.toString(16)
    var getBlock = {
        "jsonrpc":"2.0",
        "method":"eth_getBlockByNumber",
        "params": [latestCompleteBlock,true],
        "id":1
    }
    getTransactions.write(JSON.stringify(getBlock))
    getTransactions.end()
    })
  })

  

  getBlockNumber.on('error', error => {
    console.error(error)
  })

  const getTransactions = https.request(options, getTransactions => {
    let chunks = '';
    console.log(`statusCode: ${getTransactions.statusCode}`)
    getTransactions.on('data', d => {
        chunks += d;
    })
    getTransactions.on('end', ()=>{
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
  })

  

  getTransactions.on('error', error => {
    console.error(error)
  })
  const walletAddress = '0xa7206d878c5c3871826dfdb42191c49b1d11f466'
  getBlockNumber.write(data)
  getBlockNumber.end()
//   getTransactions.write(getBlock)