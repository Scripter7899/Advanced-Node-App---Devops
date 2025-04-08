const http = require('http');
const https = require('https');

const URL = process.env.TEST_URL || 'http://localhost:3000';
const EXPECTED_CONTENT = 'Hello from Azure DevOps';
const MAX_RETRIES = 3;
const RETRY_DELAY = 3000;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const checkApp = async () => {
  console.log(`🌐 Sending warm-up request to ${URL}`);
  await makeRequest(); // warm-up hit
  await sleep(30000);  // 30s cool-down period

  let success = false;

  for (let i = 1; i <= MAX_RETRIES; i++) {
    console.log(`🔁 Attempt ${i}/${MAX_RETRIES}...`);

    try {
      const { statusCode, content, time } = await makeRequest();
      console.log(`✅ Response time: ${time}ms`);

      if (statusCode !== 200) {
        throw new Error(`Unexpected status code: ${statusCode}`);
      }

      if (!content.includes(EXPECTED_CONTENT)) {
        throw new Error(`Content check failed.`);
      }

      console.log('✅ Smoke test passed.');
      success = true;
      break;
    } catch (err) {
      console.error(`❌ Error: ${err.message}`);
      if (i < MAX_RETRIES) {
        console.log(`⏳ Retrying after ${RETRY_DELAY / 1000}s...`);
        await sleep(RETRY_DELAY);
      }
    }
  }

  if (!success) {
    console.error('❌ All smoke test attempts failed. Exiting.');
    process.exit(1);
  }
};

async function makeRequest() {
  const start = Date.now();
  const client = URL.startsWith('https') ? https : http;

  return new Promise((resolve, reject) => {
    client.get(URL, (res) => {
      let data = '';

      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          content: data,
          time: Date.now() - start
        });
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

checkApp();
