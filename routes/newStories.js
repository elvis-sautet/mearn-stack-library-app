const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");
const Story = require("../models/story");

const { editIcon } = require("../helpers/ejs");

// @desc show single story
// @desc GET /stories/:id
router.get("/:id", ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).populate("user").lean();

    if (!story) {
      return res.render("error/404");
    }
    res.render("stories/show", {
      story,
      title: story.title,
    });
  } catch (err) {
    console.log(err);
    res.render("error/404");
  }
});

// @desc show add page
// @desc GET /stories/add
router.get("/add", ensureAuth, (req, res) => {
  res.render("stories/add", {
    title: "Add New Story",
  });
});

// @desc show all stories
// @desc GET /stories
router.get("/", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: "public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();
    res.render("stories/index", {
      stories: stories,
      title: "Public Stories",
      editIcon,
    });
  } catch (err) {
    console.log("Error" + err);
    res.render("error/500");
  }
});

// @desc show edit page per id
// @desc GET /stories

const { checkSelected } = require("../helpers/ejs");

router.get("/edit/:id", ensureAuth, async (req, res) => {
  try {
    const story = await Story.findOne({ _id: req.params.id }).lean();

    if (!story) {
      return res.render("error/404");
    }

    if (story.user._id != req.user.id) {
      res.redirect("/stories");
    } else {
      res.render("stories/edit", {
        story: story,
        title: story.title,
        checkSelected,
      });
    }
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

// @desc process add form
// @desc POST /stories
router.post("/", ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Story.create(req.body);
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    res.render("error/500");
  }
});

// @desc Update story
// @desc PUT /stories/:id
router.put("/:id", ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean();
    if (!story) {
      return res.render("error/404");
    }

    if (story.user._id != req.user.id) {
      res.redirect("/stories");
    } else {
      console.log(req.body);
      story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      });
      res.redirect("/dashboard");
    }
  } catch (er) {
    console.error(err);
    res.render("error/500");
  }
});

router.delete("/:id", ensureAuth, async (req, res) => {
  try {
    await Story.findByIdAndRemove(req.params.id);
    res.redirect("/dashboard");
  } catch (err) {
    consle.error(err);
    res.render("error/500");
  }
});

// @desc show user stories
// @desc GET /stories/user/id
router.get("/user/:userId", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({
      user: req.params.userId,
      status: "public",
    })
      .populate("user")
      .lean();
    res.render("stories/index", {
      stories,
    });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

module.exports = router;
