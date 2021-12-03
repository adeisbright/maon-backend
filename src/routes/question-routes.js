const express = require("express");

const {
    addQuestion,
    getQuestion,
    search,
    addComment,
} = require("../controller/question.controller");

const { Validator, isValidBSON } = require("../middleware");
const router = express.Router();

const { validateAddContent, validateSearchParams } = Validator;

router.route("/v1/questions").post(validateAddContent, addQuestion);
router.get("/v1/search", validateSearchParams, search);
router.post(
    "/v1/questions/:id/comments",
    isValidBSON,
    validateAddContent,
    addComment
);
router
    .all("/v1/questions/:id", isValidBSON)
    .route("/v1/questions/:id")
    .get(getQuestion);

module.exports = router;
