const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require('pg'); // Add this

const app = express();
app.use(bodyParser.json());

// Setup Postgres connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || "https://jira-connect-render.onrender.com";

// 1. The Descriptor
app.get("/atlassian-connect.json", (req, res) => {
  res.json({
    key: "connect-render-demo-v2", // Changed key to force Jira to refresh
    name: "Connect Render Demo",
    baseUrl: BASE_URL,
    authentication: { type: "jwt" },
    lifecycle: { installed: "/installed" },
    modules: {
      "jira:issuePanel": [{
        key: "demo-issue-panel",
        name: { value: "Render Panel" },
        url: "/panel",
        location: "atl.jira.view.issue.right.context"
      }]
    },
    scopes: ["read:jira-work"]
  });
});

// 2. The critical "Handshake" route
app.post("/installed", async (req, res) => {
  const { clientKey, sharedSecret, baseUrl } = req.body;
  
  try {
    // You MUST save these to a database
    await pool.query(
      'INSERT INTO tenants (client_key, shared_secret, base_url) VALUES ($1, $2, $3) ON CONFLICT (client_key) DO UPDATE SET shared_secret = $2',
      [clientKey, sharedSecret, baseUrl]
    );
    console.log(`Saved tenant: ${clientKey}`);
    res.status(204).send(); // 204 No Content is preferred by Atlassian
  } catch (err) {
    console.error("Database error", err);
    res.sendStatus(500);
  }
});

app.get("/panel", (req, res) => {
  res.send("<h2>✅ Jira Connect app is running and authenticated!</h2>");
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));