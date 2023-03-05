import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [orgName, setOrgName] = useState('');
  const [n, setN] = useState(0);
  const [m, setM] = useState(0);
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/github?orgName=${orgName}&n=${n}&m=${m}`);
      setData(response.data);
      console.log(response.data)
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Github Repository Forkers</h1>
      <form onSubmit={(e) => { e.preventDefault(); fetchData(); }}>
        <label>
          Organization Name:
          <input type="text" value={orgName} onChange={(e) => setOrgName(e.target.value)} />
        </label>
        <br />
        <label>
          Number of Repositories:
          <input type="number" value={n} onChange={(e) => setN(e.target.value)} />
        </label>
        <br />
        <label>
          Number of Oldest Forkers:
          <input type="number" value={m} onChange={(e) => setM(e.target.value)} />
        </label>
        <br />
        <button type="submit">Fetch Data</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Repository Name</th>
            <th>Forker Name</th>
            <th>Forked At</th>
          </tr>
        </thead>
        <tbody>
          {data.map((repo) => (
            <React.Fragment key={repo.name}>
              <tr>
                <td rowSpan={m}>{repo.name}</td>
                <td>{repo.forkers[0].login}</td>
                <td>{repo.forkers[0].date}</td>
              </tr>
              {repo.forkers.slice(1, m).map((forker) => (
                <tr key={forker.login}>
                  <td>{forker.login}</td>
                  <td>{forker.date}</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;