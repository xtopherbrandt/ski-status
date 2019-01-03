const http = require('http');

module.exports = function (context, myTimer) {
    var timeStamp = new Date().toISOString();
    const requestBody = "{}";
    const options = {
        host: 'skistatus.azurewebsites.net',
        path: '/api/ski-status-webhook?code=ZbhT/p42bID8kTS3MVEUdwSizM3uBZ/j452FDFprtvHIOg0qiEpISg==',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': requestBody.length
        }
    };
       
    req = http.request(options, (res) => {
        context.log('Keep Alive completed.');
        context.done(); 
    });

    req.on('error', (e) => {
        context.log(`problem with request: ${e.message}`);
      });

    context.log('Keep Alive started', timeStamp);   

    req.end(requestBody);

};