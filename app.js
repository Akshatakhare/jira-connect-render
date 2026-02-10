const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || "https://jira-connect-render.onrender.com";

/**
 * 1️⃣ Atlassian Connect Descriptor
 */
app.get("/atlassian-connect.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");

  res.json({
    key: "connect-render-demo-v4", // ⚠️ NEW KEY (force Jira refresh)
    name: "Connect Render Demo",
    description: "Demo Jira Connect app deployed on Render",

    baseUrl: BASE_URL,
    apiVersion: 1,

    vendor: {
      name: "Akshata",
      url: "https://github.com/Akshatakhare"
    },

    authentication: {
      type: "jwt"
    },

    lifecycle: {
      installed: "/installed"
    },

    modules: {
      "jira:issuePanel": [
        {
          key: "demo-issue-panel",
          name: {
            value: "Render Panel"
          },
          url: "/panel",
          location: "atl.jira.view.issue.right.context"
        }
      ]
    },

    scopes: ["read:jira-work"]
  });
});

/**
 * 2️⃣ Installation Handshake (TEMP: NO DB)
 */
app.post("/installed", (req, res) => {
  console.log("✅ /installed called");
  console.log("Payload from Jira:", req.body);

  // IMPORTANT: Always respond 204
  res.status(204).send();
});

/**
 * 3️⃣ Panel UI
 */
app.get("/panel", (req, res) => {
  res.send("<h2>✅ Jira Connect app installed successfully!</h2>");
});

/**
 * 4️⃣ Start server
 */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
