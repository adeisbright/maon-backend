const express = require("express");

const {
    addQuestion,
    getQuestion,
    search,
    addComment,
} = require("../controller/question.controller");

const { Validator } = require("../middleware");
const router = express.Router();

router.route("/v1/questions").post(Validator.validateAddQuestion, addQuestion);
router.get("/v1/search", Validator.validateSearchParams, search);
router.post("/v1/questions/:id/comments", addComment);
router.route("/v1/questions/:id").get(getQuestion);

module.exports = router;
