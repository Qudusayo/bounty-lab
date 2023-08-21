import dotenv from "dotenv";
import express from "express";
import WeaveDB from "weavedb-sdk-node";

dotenv.config();
const app = express();
const db = new WeaveDB({
  contractTxId: process.env.WEAVEDB_ContractTxId,
  remoteStateSyncEnabled: true,
  remoteStateSyncSource: "https://dre-3.warp.cc/contract",
});

app.get("/bounties/:id", async (req, res) => {
  const id = req.params.id;

  try {
    let bounties = await db.cget("bounties", ["txId", "==", id]);
    let bounty = (await bounties)[0];
    if (!bounty) {
      res.status(404).json({ error: "Bounty not found" });
      return;
    }

    res.status(200).json(bounty);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("*", (req, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 4500;

app.listen(PORT, async () => {
  await db.init();
  console.log(`Server is running on port ${PORT}`);
});
