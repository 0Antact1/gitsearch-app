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
    
    let page = 1;
    let allRepos = [];
  
    while (true) {
      const response = await axios.get(`https://api.github.com/orgs/${orgName}/repos?page=${page}&per_page=100`, {
        headers: { 'User-Agent': 'request' },
      });
  
      const repos = response.data;
      allRepos = [...allRepos, ...repos];
  
      const linkHeader = response.headers.link || '';
      const nextPageUrl = linkHeader
        .split(',')
        .find((link) => link.includes('rel="next"'))
        ?.match(/<(.+?)>/)?.[1];
  
      if (!nextPageUrl) {
        break;
      }
  
      page++;
    }
  
    allRepos.sort((a, b) => b.forks_count - a.forks_count)
    // const reposResponse = await axios.get(`https://api.github.com/orgs/${orgName}/repos`);
    // const repos = reposResponse.data;
    // repos.sort((a, b) => b.forks - a.forks);
    const result = [];

    for (let i = 0; i < n && i < allRepos.length; i++) {
      const repo = allRepos[i];
      // const forkersResponse = await axios.get(repo.forks_url);
      // const forkers = forkersResponse.data.map(fork => ({
      //   login: fork.owner.login,
      //   date: fork.created_at
      // })).sort((a, b) => new Date(a.date) - new Date(b.date));
      let page = 1;
      let allForkers = [];
      // api rate lim exceeded :( on multiple nets
      while (true) {
        const forksUrl = repo.forks_url;
        const response = await axios.get(`${forksUrl}?page=${page}&per_page=100`, {
          headers: { 'User-Agent': 'request' },
        });
    
        const forkers = response.data.map(fork => ({
            login: fork.owner.login,
            date: fork.created_at
          }));
        allForkers = [...allForkers, ...forkers];
    
        const linkHeader = response.headers.link || '';
        const nextPageUrl = linkHeader
          .split(',')
          .find((link) => link.includes('rel="next"'))
          ?.match(/<(.+?)>/)?.[1];
    
        if (!nextPageUrl) {
          break;
        }
        page++;
      }
      allForkers.sort((a, b) => new Date(a.date) - new Date(b.date));

      result.push({
        name: repo.name,
        forkers: allForkers.slice(0, m)
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