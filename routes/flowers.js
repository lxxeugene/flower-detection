const express = require("express");
const router = express.Router();
const Flower = require("../models/flower");

router.get("/", async (req, res) => {
  const flowername = req.query.flowername;

  try {
    const flower = await Flower.findOne({
      $or: [{ flowername }, { flowername_kr: flowername }],
    });

    if (!flower) return res.status(404).json({ error: "Flower not found" });

    const { flowername, habitat, binomialName, classification, flowername_kr } = flower;
    res.json({ flowername, habitat, binomialName, classification, flowername_kr });
  } catch (error) {
    console.error("꽃 정보 조회 오류:", error);
    res.status(500).json({ error: "서버 오류" });
  }
});

module.exports = router;
