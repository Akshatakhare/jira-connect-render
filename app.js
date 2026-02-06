const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

app.get("/atlassian-connect.json", (req, res) => {
  res.json({
    key: "connect-render-demo",
    name: "Connect Render Demo",
    baseUrl: BASE_URL,
    apiVersion: 1,
    authentication: { type: "jwt" },
    lifecycle: {
      installed: "/installed"
    },
    modules: {
      "jira:issuePanel": [
        {
          key: "demo-issue-panel",
          name: { value: "Render Panel" },
          url: "/panel",
          location: "atl.jira.view.issue.right.context"
        }
      ]
    },
    scopes: ["read:jira-work"]
  });
});

app.post("/installed", (req, res) => {
  console.log("Installed");
  res.sendStatus(200);
});

app.get("/panel", (req, res) => {
  res.send("<h2>✅ Jira Connect app is running</h2>");
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
