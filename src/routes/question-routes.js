const express = require("express");

const {
    addQuestion,
    getQuestion,
    search,
    addComment,
    createCSRFToken,
    getCSRFToken,
    indexES,
    getES,
    addPublisher,
    getPublishers,
    getPublisher,
    updatePublisher,
    removePublisher,
    addBook,
    getBook,
    getBooks,
    updateBook,
    removeBook,
    addUser,
    getUser,
    getUsers,
    removeUser,
    updateUser,
    addAuthorBook,
    getAuthorsBooks,
    getAuthorBook,
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

router.get("/rere", createCSRFToken);
router.get("/result", getCSRFToken);

router.post("/v1/publishers", addPublisher);
router.get("/v1/publishers", getPublishers);
router
    .route("/v1/publishers/:id")
    .get(getPublisher)
    .put(updatePublisher)
    .delete(removePublisher);

router.route("/v1/books").post(addBook).get(getBooks);
router.route("/v1/books/:id").get(getBook).put(updateBook).delete(removeBook);

router.route("/v1/users").post(addUser).get(getUsers);
router.route("/v1/users/:id").get(getUser).put(updateUser).delete(removeUser);
router.route("/v1/store-book").post(addAuthorBook).get(getAuthorsBooks);

router.route("/v1/store-book/:id").get(getAuthorBook);

module.exports = router;
