const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Execute code using Repl.it API
app.post('/execute-code', async (req, res) => {
  const { code, language } = req.body;

  try {
    const response = await axios.post('https://replit-api.haykranen.nl', {
      code,
      language,
    });

    // Return the output to the frontend
    res.status(200).json({ output: response.data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Code execution failed.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
