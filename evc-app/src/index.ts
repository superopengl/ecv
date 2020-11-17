import { createAppInstance } from './app';
import * as http from 'http';
import * as path from 'path';
import { connectDatabase } from './db';
import * as dotenv from 'dotenv';
import { restartCronService } from './services/cronService';
import { createWebsocketServer } from './ws';
import * as WebSocket from 'ws';

function validateEnvVars() {
  const requiredEnvVars = [
    'AWS_DEFAULT_REGION',
    'GIT_HASH',
    'EVC_WEB_DOMAIN_NAME',
    'EVC_API_DOMAIN_NAME',
    'EVC_S3_BUCKET',
    'EVC_FILE_PREFIX',
    'EVC_GOOGLE_SSO_CLIENT_SECRET',
  ];

  const missingVars = requiredEnvVars.map(v => process.env[v]).filter(x => !x);

  if (missingVars.length) {
    throw new Error(`Env vars missing: ${missingVars.join(', ')}`);
  }
}

function loadEnv() {
  const env = (process.env.NODE_ENV || 'dev').toLowerCase();
  const isNonProd = env !== 'prod' && env !== 'production';
  if (isNonProd) {
    // non prod
    const envPath = path.resolve(process.cwd(), `.env.${env}`);
    console.log('Overriding env vars with', envPath);
    dotenv.config({ path: envPath });
  }

  dotenv.config();
  console.log('Environment variables');
  console.log(JSON.stringify(process.env, undefined, 2));

  validateEnvVars();
}

async function launchApp() {
  loadEnv();

  console.log('Connecting database');
  await connectDatabase();

  const app = createAppInstance();
  restartCronService(true);

  const httpPort = +process.env.EVC_HTTP_PORT || 80;
  const server = http.createServer(app);

  // const httpsPort = +process.env.AUA_HTTPS_PORT || 443;
  // // start https server
  // const sslOptions = {
  //   key: fs.readFileSync(`${__dirname}/_assets/keys/localhost.key`, 'utf8'),
  //   cert: fs.readFileSync(`${__dirname}/_assets/keys/localhost.crt`, 'utf8')
  // };

  // https.createServer(sslOptions, app).listen(httpsPort);

  const wss = new WebSocket.Server({server});
  createWebsocketServer(wss);

  server.listen(httpPort);

  console.log(`Started on ${httpPort}`);
}

try {
  launchApp();
} catch (e) {
  console.error('Fatal error', e);
}