import pg from 'pg';
import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS drivers (
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      pin_hash TEXT NOT NULL,
      pin_salt TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS checkins (
      id SERIAL PRIMARY KEY,
      driver_id INTEGER NOT NULL REFERENCES drivers(id),
      sleep_hours REAL NOT NULL,
      stress_level INTEGER NOT NULL,
      symptoms JSONB NOT NULL DEFAULT '[]',
      medication BOOLEAN NOT NULL DEFAULT false,
      score INTEGER NOT NULL,
      level TEXT NOT NULL,
      urgent BOOLEAN NOT NULL DEFAULT false,
      factors JSONB NOT NULL DEFAULT '[]',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS chat_flags (
      id SERIAL PRIMARY KEY,
      driver_id INTEGER NOT NULL REFERENCES drivers(id),
      message TEXT NOT NULL,
      matched_keyword TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE INDEX IF NOT EXISTS idx_checkins_driver ON checkins(driver_id, created_at);
    CREATE INDEX IF NOT EXISTS idx_flags_driver ON chat_flags(driver_id, created_at);
  `);
}

// --- PIN hashing (scrypt, built into Node — no extra dependency) ---
function hashPin(pin) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(String(pin), salt, 64).toString('hex');
  return { hash, salt };
}

function verifyPin(pin, hash, salt) {
  const attempt = scryptSync(String(pin), salt, 64);
  const stored = Buffer.from(hash, 'hex');
  if (attempt.length !== stored.length) return false;
  return timingSafeEqual(attempt, stored);
}

// --- Driver auth ---
export async function registerDriver(name, pin) {
  const existing = await pool.query('SELECT id FROM drivers WHERE name = $1', [name]);
  if (existing.rows.length > 0) {
    const err = new Error('That name is already registered. Try logging in instead.');
    err.code = 'DRIVER_EXISTS';
    throw err;
  }
  const { hash, salt } = hashPin(pin);
  const result = await pool.query(
    'INSERT INTO drivers (name, pin_hash, pin_salt) VALUES ($1, $2, $3) RETURNING id, name',
    [name, hash, salt]
  );
  return result.rows[0];
}

export async function loginDriver(name, pin) {
  const result = await pool.query('SELECT * FROM drivers WHERE name = $1', [name]);
  const row = result.rows[0];
  if (!row || !verifyPin(pin, row.pin_hash, row.pin_salt)) {
    const err = new Error('Name or PIN is incorrect.');
    err.code = 'INVALID_CREDENTIALS';
    throw err;
  }
  return { id: row.id, name: row.name };
}

// --- Check-ins ---
export async function insertCheckin({ driverId, sleepHours, stressLevel, symptoms, medication, score, level, urgent, factors }) {
  const result = await pool.query(
    `INSERT INTO checkins (driver_id, sleep_hours, stress_level, symptoms, medication, score, level, urgent, factors)
     VALUES ($1, $2, $3, $4::jsonb, $5, $6, $7, $8, $9::jsonb)
     RETURNING *`,
    [
      driverId,
      sleepHours,
      stressLevel,
      JSON.stringify(symptoms || []),
      Boolean(medication),
      score,
      level,
      Boolean(urgent),
      JSON.stringify(factors || []),
    ]
  );
  return formatCheckin(result.rows[0]);
}

export async function getRecentCheckins(driverId, limit = 14) {
  const result = await pool.query(
    'SELECT * FROM checkins WHERE driver_id = $1 ORDER BY created_at DESC LIMIT $2',
    [driverId, limit]
  );
  return result.rows.map(formatCheckin);
}

function formatCheckin(row) {
  return {
    id: row.id,
    driverId: row.driver_id,
    sleepHours: row.sleep_hours,
    stressLevel: row.stress_level,
    symptoms: row.symptoms, // pg parses jsonb columns automatically
    medication: row.medication,
    score: row.score,
    level: row.level,
    urgent: row.urgent,
    factors: row.factors,
    createdAt: row.created_at,
  };
}

// --- Chat fatigue flags ---
export async function insertChatFlag({ driverId, message, matchedKeyword }) {
  await pool.query(
    'INSERT INTO chat_flags (driver_id, message, matched_keyword) VALUES ($1, $2, $3)',
    [driverId, message, matchedKeyword]
  );
}

export async function getRecentChatFlags(driverId, limit = 10) {
  const result = await pool.query(
    'SELECT * FROM chat_flags WHERE driver_id = $1 ORDER BY created_at DESC LIMIT $2',
    [driverId, limit]
  );
  return result.rows;
}

// --- Manager views ---
export async function getAllDriversOverview() {
  const driversResult = await pool.query('SELECT id, name, created_at FROM drivers ORDER BY name');

  const overview = [];
  for (const d of driversResult.rows) {
    const latestResult = await pool.query(
      'SELECT * FROM checkins WHERE driver_id = $1 ORDER BY created_at DESC LIMIT 1',
      [d.id]
    );
    const flagCountResult = await pool.query(
      `SELECT COUNT(*) AS c FROM checkins
       WHERE driver_id = $1 AND level != 'Low' AND created_at >= now() - interval '7 days'`,
      [d.id]
    );
    const chatFlagCountResult = await pool.query(
      `SELECT COUNT(*) AS c FROM chat_flags WHERE driver_id = $1 AND created_at >= now() - interval '7 days'`,
      [d.id]
    );
    overview.push({
      id: d.id,
      name: d.name,
      latestCheckin: latestResult.rows[0] ? formatCheckin(latestResult.rows[0]) : null,
      riskFlags7d: Number(flagCountResult.rows[0].c),
      chatFlags7d: Number(chatFlagCountResult.rows[0].c),
    });
  }
  return overview;
}

export async function getDriverDetail(driverId) {
  const driverResult = await pool.query('SELECT id, name, created_at FROM drivers WHERE id = $1', [driverId]);
  const driver = driverResult.rows[0];
  if (!driver) return null;
  return {
    ...driver,
    checkins: await getRecentCheckins(driverId, 30),
    chatFlags: await getRecentChatFlags(driverId, 20),
  };
}

// Wipes every driver, check-in, and chat flag, and resets ID counters to 1.
export async function clearAllData() {
  await pool.query('TRUNCATE TABLE chat_flags, checkins, drivers RESTART IDENTITY CASCADE');
}

export default pool;
