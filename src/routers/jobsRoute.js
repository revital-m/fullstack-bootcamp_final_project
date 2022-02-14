const express = require("express");
const Jobs = require("../models/jobs");
const auth = require("../middleware/auth");
const router = express.Router();

//* Add a new job card to the database.
router.post("/api/jobs/creatNewCard", auth, async (req, res) => {
  const job = new Jobs({
    ...req.body,
    owner: req.user._id,
  });
  try {
    console.log("/api/jobs/creatNewCard - req.body: ", req.body);
    const response = await job.save();
    console.log("/api/jobs/creatNewCard - response: ", response);
    res.status(201).send(job);
  } catch (error) {
    console.table(error);
    res.status(400).send(error);
  }
});

//* Get all of the user's job cards.
router.get("/api/jobs", auth, async (req, res) => {
  try {

    // const jobs = await Jobs.find({owner: req.user._id});
    // res.status(200).send(jobs);

    await req.user.populate("jobs");
    res.status(200).send(req.user.jobs);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//* Update the current user's specific card.
router.patch("/api/jobs/updateCard/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["email", "fullName", "phone", "moreInfo", "gotCallback", "interview", "negotiation",
  ];
  // const allowedUpdates = ["contacts.email", "contacts.fullName", "contacts.phone", "moreInfo", "timeline.sendCV", "timeline.gotCallback", "timeline.interview", "timeline.negotiation",
  // ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const job = await Jobs.findOne({ _id: req.params.id, owner: req.user._id });
    if (!job) {
      return res.status(404).send({ error: "Card not found!" });
    }
    updates.forEach((update) => {
      if (update === "moreInfo") {
        job.moreInfo.push({ info: req.body[update] });
      } else if(update === "email"|| update === "fullName" || update === "phone") {
        job.contacts[update] = req.body[update];
      } else if(update === "gotCallback"|| update === "interview" || update === "negotiation") {
        job.timeline[update] = req.body[update];
      }
    });
    await job.save();
    res.status(200).send(job);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//* Delete the current user's specific card.
router.delete("/api/jobs/deleteCard/:id", auth, async (req, res) => {
  try {
    const job = await Jobs.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!job) {
      return res.status(404).send({ error: "Card not found!" });
    }

    res.status(200).send(job);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
