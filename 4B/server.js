const express = require('express');
const session = require('express-session');
const { engine } = require('express-handlebars');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const helpers = require('handlebars-helpers')();

const app = express();
const port = 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const pool = new Pool({
  connectionString: 'postgresql://postgres:root@localhost:5432/webgames',
});

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.engine('hbs', engine({
  extname: '.hbs',
  helpers: {
    eq: (a, b) => a === b,
  }
}));
app.set('view engine', 'hbs');

function checkAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
}

app.use(express.static('css'));
app.use(express.static('js'));
app.engine('hbs', engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');

app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT h.name AS hero_name, t.name AS hero_type, h.photo FROM heroes_tb h JOIN type_tb t ON h.type_id = t.id;');
    res.render('home', { heroes: result.rows, user: req.session.user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.get('/login', (req, res) => {
  res.render('login');
});
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users_tb WHERE email = $1', [email]);
    const user = result.rows[0];

    if (user && user.password === password) {
      req.session.user = { id: user.id, email: user.email };
      return res.redirect('/');
    } else {
      return res.status(401).render('login', { error: 'Invalid email or password' });
    }
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).send('Server Error');
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Failed to logout');
    }
    res.redirect('/login');
  });
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  const { email, username, password } = req.body;
  try {
    await pool.query('INSERT INTO users_tb (email, username, password) VALUES ($1, $2, $3)', [email, username, password]);
    res.redirect('/login');
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).send('Server Error');
  }
});

app.get('/addHero', checkAuth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM type_tb;');
    res.render('addHero', { types: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});
app.post('/addHero', checkAuth, async (req, res) => {
  const { name, type_id, photo } = req.body;
  try {
    await pool.query('INSERT INTO heroes_tb (name, type_id, photo, user_id) VALUES ($1, $2, $3, $4)',
      [name, type_id, photo, req.session.user.id]);
    res.redirect('/');
  } catch (err) {
    console.error('Error adding hero:', err);
    res.status(500).send('Server Error');
  }
});


app.get('/addType', checkAuth, (req, res) => {
  res.render('addType');
});
app.post('/addType', checkAuth, async (req, res) => {
  const { name } = req.body;
  try {
    await pool.query('INSERT INTO type_tb (name) VALUES ($1)', [name]);
    res.redirect('/');
  } catch (err) {
    console.error('Error adding type:', err);
    res.status(500).send('Server Error');
  }
});

//-----DETAIL EDIT DELETE-------//
app.get('/detail/:hero_name', async (req, res) => {
  const heroName = req.params.hero_name;
  try {
    const result = await pool.query(`
            SELECT h.id, h.name AS hero_name, t.name AS hero_type, h.photo, u.username AS owner, h.user_id
            FROM heroes_tb h
            JOIN type_tb t ON h.type_id = t.id
            JOIN users_tb u ON h.user_id = u.id
            WHERE h.name = $1
        `, [heroName]);

    const hero = result.rows[0];
    const isOwner = req.session.user && req.session.user.id === hero.user_id;

    res.render('detail', { hero, isOwner });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.get('/editHero/:id', checkAuth, async (req, res) => {
  const heroId = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM heroes_tb WHERE id = $1 AND user_id = $2', [heroId, req.session.user.id]);
    const hero = result.rows[0];

    const typesResult = await pool.query('SELECT * FROM type_tb');
    res.render('editHero', { hero, types: typesResult.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.post('/editHero/:id', checkAuth, async (req, res) => {
  const heroId = req.params.id;
  const { name, type_id, photo } = req.body;
  try {
    await pool.query('UPDATE heroes_tb SET name = $1, type_id = $2, photo = $3 WHERE id = $4 AND user_id = $5',
      [name, type_id, photo, heroId, req.session.user.id]);
    res.redirect(`/detail/${name}`);
  } catch (err) {
    console.error('Error updating hero:', err);
    res.status(500).send('Server Error');
  }
});

app.post('/deleteHero/:id', checkAuth, async (req, res) => {
  const heroId = req.params.id;
  try {
    await pool.query('DELETE FROM heroes_tb WHERE id = $1 AND user_id = $2', [heroId, req.session.user.id]);
    res.redirect('/');
  } catch (err) {
    console.error('Error deleting hero:', err);
    res.status(500).send('Server Error');
  }
});
//-----DETAIL EDIT DELETE-------//

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
