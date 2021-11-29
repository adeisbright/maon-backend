const express = require("express");

const {
    addQuestion,
    getQuestion,
    search,
} = require("../controller/question.controller");

const { Validator } = require("../middleware");
const router = express.Router();

router.route("/v1/questions").post(Validator.validateAddQuestion, addQuestion);
router.get("/v1/search", Validator.validateSearchParams, search);
router.get("/v1/questions/:id", getQuestion);

module.exports = router;
