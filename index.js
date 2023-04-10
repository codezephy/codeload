const express = require('express');
const fetch = require('node-fetch');

const port = +process.env.PORT || 3000;

const app = express();

app.get('/:owner/:repo/:branch?', async (req, res) => {
  const { owner, repo, branch = '' } = req.params;
  const { token } = req.query;

  const url = `https://api.github.com/repos/${owner}/${repo}/zipball/${branch}`;
  const options = {
    method: 'GET',
    redirect: 'manual',
    ...(token && {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  };
  const response = await fetch(url, options).catch(() => undefined);
  if (response?.status === 302) {
    res.redirect(response.headers.get('location'));
    return;
  }

  res.send('400: Invalid request');
});

app.use((req, res) => {
  res.send('404: Not Found');
});

app.listen(port, () => {
  console.log('Listening on port %i', port);
});
