const express = require("express");
const {
    addQuestion,
    getQuestions,
} = require("../controller/question.controller");

const router = express.Router();

router.route("/v1/questions").get(getQuestions).post(addQuestion);

module.exports = router;
