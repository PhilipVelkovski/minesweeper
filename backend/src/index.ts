import express from 'express';
import knexLib from 'knex';

const app = express();
const PORT = process.env.PORT || 3000;

const knex = knexLib({
  client: 'mysql2',
  connection: {
    host: 'db', 
    user: 'miner',
    password: 'secret',
    database: 'minedata',
  },
});
async function waitForDB() {
  let retries = 5;
  while (retries) {
    try {
      await knex.raw('SELECT 1');
      break;
    } catch (err) {
      retries -= 1;
      console.log('Waiting for DB...');
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  if (!retries) throw new Error('DB not ready');
}
async function runMigrations() {
  const exists = await knex.schema.hasTable('scores');
  if (!exists) {
    await knex.schema.createTable('scores', (table) => {
      table.increments('id').primary();
      table.string('initials', 3).notNullable();
      table.integer('time').notNullable();
      table.timestamp('date').defaultTo(knex.fn.now());
    });
    console.log('Created table: scores');
  }
}

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running');
});

app.post('/api/leaderboard', async (req, res) => {
  const { initials, time, date } = req.body;

  if (
    !initials || initials.length > 3 || 
    typeof time !== 'number' || 
    !date
  ) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  try {
    await knex('scores').insert({
      initials: initials.toUpperCase(),
      time,
      date,
    });
    res.status(201).json({ message: 'Score saved' });
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(PORT, async () => {
  try {
    await waitForDB();
    await runMigrations();
    console.log(`Server running on http://localhost:${PORT}`);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
});
