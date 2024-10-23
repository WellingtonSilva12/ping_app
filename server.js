const express = require('express');
const ping = require('ping');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.get('/ping/:host', async (req, res) => {
  const host = req.params.host;

  // Validação de IP e URL
  const hostRegex = /^(http:\/\/|https:\/\/)?((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-zA-Z0-9.-]+)(:[0-9]{1,5})?(\/.*)?$/;
  if (!hostRegex.test(host)) {
    return res.status(400).json({ error: 'Host inválido' });
  }

  try {
    const result = await ping.promise.probe(host, { timeout: 5 });

    console.log(result);

    res.json({
      host: host,
      alive: result.alive,
      time: result.time,
    });
  } catch (error) {
    console.error(`Erro ao pingar ${host}: ${error.message}`);
    res.status(500).json({
      host: host,
      alive: false,
      time: null,
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server running in http://172.20.8.187:${port}`);
});
