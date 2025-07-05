const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'mysql',         // service name in docker-compose or k8s
  user: 'root',
  password: 'password',
  database: 'userdata'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

app.get('/', (req, res) => {
  res.send(`
    <form method="POST" action="/submit">
      <label>Name:</label>
      <input name="name" /><br/>
      <label>Age:</label>
      <input name="age" /><br/>
      <button type="submit">Submit</button>
    </form>
  `);
});

app.post('/submit', (req, res) => {
  const { name, age } = req.body;
  db.query('INSERT INTO users (name, age) VALUES (?, ?)', [name, age], (err) => {
    if (err) throw err;
    res.send('Data saved. <a href="/users">View Users</a>');
  });
});

app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.listen(3000, () => console.log('App running on port 3000'));
