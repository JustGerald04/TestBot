import fs from 'fs';

const DATA_FILE = './countData.json';

function loadData() {
  if (!fs.existsSync(DATA_FILE)) return { currentCount: 0, lastUserId: null };
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export function registerCountingRoutes(app) {
  // Get current count
  app.get('/counting', (req, res) => {
    const data = loadData();
    res.json(data);
  });

  // Reset or set count
  app.post('/counting', (req, res) => {
    const { count, secret } = req.body;
    if (secret !== process.env.DASHBOARD_SECRET) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const data = loadData();
    data.currentCount = count ?? 0;
    data.lastUserId = null;
    saveData(data);
    res.json({ success: true, currentCount: data.currentCount });
  });
}