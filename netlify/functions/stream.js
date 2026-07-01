const https = require('https');

exports.handler = async function (event) {
  // Path comes in as /api/stream/{source}/{id}
  // Strip the function prefix to get the source + id segments
  const raw = event.path || '';
  const parts = raw.split('/').filter(Boolean);
  // .../stream/{source}/{id}  → take the last two segments
  const id = parts.pop();
  const source = parts.pop();

  if (!source || !id) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'source and id required' }),
    };
  }

  const url = `https://streamed.pk/api/stream/${source}/${id}`;

  return new Promise((resolve) => {
    const req = https.get(
      url,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          Accept: 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          Referer: 'https://streamed.pk/',
          Origin: 'https://streamed.pk',
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
            body: data,
          });
        });
      }
    );

    req.on('error', (e) => {
      resolve({
        statusCode: 502,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: e.message }),
      });
    });

    req.end();
  });
};
