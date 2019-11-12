/**
 * Clustering Node.js instances.
 */

const cluster = require('cluster');

require('dotenv').config();     // Load environment variables from .env file.

if (cluster.isMaster) {
    const storeEnv = process.env.ENV || 'MOCK';   // Can be MOCK, LOCAL, or PRODUCTION. Fallback to mock data.
    const numCPUs = storeEnv === 'PRODUCTION' ? require('os').cpus().length : 1;
    console.log(`Master ${process.pid} is running on ${numCPUs} core instance\n`);

    // Fork workers.
    for (let w = 0; w < numCPUs; w++) {
        cluster.fork();
    }

    cluster.on('online', function(worker) {
        console.log('Worker ' + worker.process.pid + ' is online');
    });

    // If a worker dies, restart it.
    cluster.on('exit', (worker, code, signal) => {
      console.log(`worker ${worker.process.pid} died unexpectedly. Restarting...`);
      cluster.fork();
    });
    
} else {
    console.log(`Worker ${process.pid} started`);
    
    const fs = require('fs');
    const path = require('path');
    
    // Create an App instance with Fastify.
    let fastifyConfig = {
      logger: false
    };
    
    if (process.env.PROTOCOL === 'HTTPS') {
        console.log(`HTTPS is enabled.`);
        
        fastifyConfig.https = {
            key: fs.readFileSync(path.join(__dirname, 'server.key')),
            cert: fs.readFileSync(path.join(__dirname, 'server.crt'))
        }
    }
        
        
    const App = require('fastify')(fastifyConfig);
    
    // Recursively load all routes from ./routes folder. Each folder under ./routes must contain an index.js file that defines 
    // routes used in that sub-module. So, each sub-module is simply a folder under ./routes with an index.js file.
    
    const recursivelyFindRoutes = (folderName) => {
        fs.readdirSync(folderName).forEach(file => {
            const fullName = path.join(folderName, file);
            const stat = fs.lstatSync(fullName);

            if (stat.isDirectory()) {
                recursivelyFindRoutes(fullName);
            } else if (file.toLowerCase().indexOf('index.js') === 0) {
                // "require" index.js, so all the routes will be registered automatically.
                require('./' + fullName)(App);
            }
        });
    }
    
    // Find all routes and register the routes.
    recursivelyFindRoutes('./routes'); 
      
    // Now, start the App instance. If https is enabled it will be accessed as https://. 
    App.listen(3000, (err, address) => {
      if (err) throw err;
      App.log.info(`server listening on ${address}`);
    })
}

