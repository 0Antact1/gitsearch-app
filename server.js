const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

app.use(cors())
app.use(express.json());

app.post('/api/github', (req, res) => {
  res.send('Hello, this is the GitHub API endpoint.');
});

app.get('/api/github', async (req, res) => {
  try {
    const { orgName, n, m } = req.query;
    console.log(orgName)
    console.log(n,m)
    // Fetch repositories of the given organization
    const reposResponse = await axios.get(`https://api.github.com/orgs/${orgName}/repos`);
    const repos = reposResponse.data;

    repos.sort((a, b) => b.forks - a.forks);
    const result = [];

    for (let i = 0; i < n && i < repos.length; i++) {
      const repo = repos[i];
      const forkersResponse = await axios.get(repo.forks_url);
      const forkers = forkersResponse.data.map(fork => ({
        login: fork.owner.login,
        date: fork.created_at
      })).sort((a, b) => new Date(a.date) - new Date(b.date));

      result.push({
        name: repo.name,
        forkers: forkers.slice(0, m)
      });
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

app.listen(3000, () => {
  console.log(`Server listening at http://localhost:3000`);
});