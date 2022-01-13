const { ApplicationError, NotFoundError } = require("../middleware");
const { parseQuery } = require("../lib");
const {
    QuestionService,
    CommentService,
    CachingService,
    ElasticService,
    AnalyticsService,
} = require("../services/index");
const faker = require("faker");
const { Question, Comment } = require("../models");

const redisClient = require("../loader/redis-loader");
const elasticClient = require("../loader/elastic-loader");
const pgClient = require("../loader/posgres-loader");

const questionService = new QuestionService(Question);
const commentService = new CommentService(Comment);
const cachingService = new CachingService(redisClient);
const elasticService = new ElasticService(elasticClient);

const COMMENT_BOUND_SIZE = 10;

/**
 *
 */
class QuestionController {
    /**
     * @description addQuestion handles request to add a question asked
     * by a client
     * @param {Objet} req HTTP req object
     * @param {Object} res HTTP res object
     * @param {Function} next This function will invoke the next middleware
     * if an error occurs
     * @return {Object} data indicating successful object creation
     */
    async addQuestion(req, res, next) {
        try {
            const result = await questionService.addQuestion(req.body);
            await elasticService.index(
                process.env.ELASTIC_INDEX,
                "questions",
                result.id,
                req.body
            );
            res.status(200).json(result);
        } catch (error) {
            return next(new ApplicationError(error));
        }
    }

    /**
     * @description retrieves a particular question with the given id
     * in the request params
     * @param {Objet} req HTTP req object
     * @param {Object} res HTTP res object
     * @param {Function} next This function will invoke the next middleware
     * @returns
     */
    async getQuestion(req, res, next) {
        try {
            const { id } = req.params;

            // Check the cache for the question and also try to increment the visit
            let [question, pageCount] = await Promise.all([
                JSON.parse(await cachingService.getQuestion(id)),
                await AnalyticsService.incrVisit(req.url),
            ]);
            if (!question) {
                question = await questionService.getQuestion(id);
                if (!question) {
                    return next(
                        new NotFoundError("No question exist with this id")
                    );
                }
                await cachingService.cacheQuestion(
                    id,
                    JSON.stringify(question)
                );
            }
            res.status(200).json(question);
        } catch (error) {
            return next(new ApplicationError(error));
        }
    }
    /**
     * @description searches the database for question that matches the text
     * in search query
     * @param {Objet} req HTTP req object
     * @param {Object} res HTTP res object
     * @param {Function} next This function will invoke the next middleware
     */
    async search(req, res, next) {
        try {
            const { query, filters, skip, limit } = parseQuery(req.query);
            let results = [];
            if (query) {
                const getElasticResults = await elasticService.search(
                    process.env.ELASTIC_INDEX,
                    "questions",
                    { title: query },
                    limit,
                    skip
                );
                if (getElasticResults.hits) {
                    results = getElasticResults.hits.hits;
                    console.log(getElasticResults.hits.hits);
                } else {
                    results = await questionService.searchQuestion(
                        query,
                        filters,
                        skip,
                        limit
                    );
                }
            }
            res.status(200).json(results);
        } catch (error) {
            return next(new ApplicationError(error));
        }
    }

    /**
     *@description adds a comment to a particular question thread
     * @param {Objet} req HTTP req object
     * @param {Object} res HTTP res object
     * @param {Function} next This function will invoke the next middleware
     */
    async addComment(req, res, next) {
        try {
            const { id } = req.params;
            const question = await questionService.getQuestion(id);

            if (!question) {
                return next(
                    new NotFoundError("No question exist with this id")
                );
            }
            req.body.createdAt = new Date();
            let questionDoc;
            let comment;

            if (
                question.comments &&
                question.comments.length < COMMENT_BOUND_SIZE
            ) {
                [questionDoc, comment] = await Promise.all([
                    questionService.addComment(id, "comments", req.body),
                    commentService.addComment(req.body),
                ]);
            } else {
                comment = await commentService.addComment(req.body);
            }
            res.status(200).json(comment);
        } catch (error) {
            return next(new ApplicationError(error));
        }
    }
    async createCSRFToken(req, res, next) {
        const token = await AnalyticsService.addCSRFToken("test");
        res.status(200).json({
            body: {
                data: "Data Added",
            },
        });
    }

    async getCSRFToken(req, res, next) {
        res.status(200).json({
            body: {
                data: await cachingService.getQuestion("test"),
            },
        });
    }

    //Testing Elastic Search
    async indexES(req, res, next) {
        const data = Object.assign({}, req.body);
        try {
            // const indexData = await elasticClient.transport.request({
            //     method: "POST",
            //     path: "/maon/users/_create",
            //     body: data,
            // });

            const indexData = await elasticClient.index({
                index: "maon",
                body: data,
            });
            res.status(200).json({
                message: "Delivered",
            });
        } catch (error) {
            return next(new ApplicationError(error));
        }
    }

    async getES(req, res, next) {
        try {
            const val = req.query.q;
            let results = [];
            const search = await elasticClient.transport.request({
                method: "GET",
                path: "/maon/users/_search",
                body: {
                    query: {
                        match: {
                            content: val,
                        },
                    },
                },
            });

            const searchTwo = await elasticClient.search({
                index: "maon",
                body: {
                    query: {
                        match: {
                            content: val,
                        },
                    },
                },
            });

            if (search.body.hits) {
                results = search.body.hits.hits;
            }
            res.status(200).json({
                results: results,
                result2: searchTwo,
            });
        } catch (error) {
            return next(new ApplicationError(error));
        }
    }

    //Working with PostgreSQL
    async addPublisher(req, res, next) {
        try {
            //const { name } = req.body;
            const name = faker.lorem.word();
            const query = await pgClient.query(
                "INSERT INTO publisher(name) VALUES ($1)",
                [name]
            );
            if (!query.rowCount) {
                return next(new BadRequestError(error));
            }
            res.status(200).json({
                message: `${name} was added to the publishing list`,
            });
        } catch (error) {
            return next(new ApplicationError(error));
        }
    }

    async getPublishers(req, res, next) {
        try {
            const { rows } = await pgClient.query("SELECT * FROM publisher");
            res.status(200).json({
                body: {
                    data: rows,
                },
            });
        } catch (error) {
            return next(new ApplicationError(error));
        }
    }

    async getPublisher(req, res, next) {
        try {
            const { rows } = await pgClient.query(
                "SELECT * FROM publisher WHERE id = $1",
                [req.params.id]
            );
            res.status(200).json(rows[0]);
        } catch (error) {
            return next(new ApplicationError(error));
        }
    }
    async updatePublisher(req, res, next) {
        try {
            const { name } = req.body;
            const result = await pgClient.query(
                "UPDATE publisher SET name = $1 WHERE id = $2",
                [name, req.params.id]
            );
            console.log(result.rowCount);
            res.status(200).json({
                message: "Data was updated",
            });
        } catch (error) {
            return next(new ApplicationError(error));
        }
    }

    async removePublisher(req, res, next) {
        try {
            const result = await pgClient.query(
                "DELETE FROM publisher WHERE id = $1",
                [req.params.id]
            );
            console.log(result.rowCount);
            res.status(200).json({
                message: "Data was removed",
            });
        } catch (error) {
            return next(new ApplicationError(error));
        }
    }

    async addBook(req, res, next) {
        try {
            const publishers = [1, 2, 3, 4, 5, 7, 9];
            const title = faker.lorem.sentence();
            const description = faker.lorem.paragraph();
            const bookPrice = Math.random() * 530000;
            const publisher =
                publishers[Math.floor(Math.random() * publishers.length + 1)];

            const results = await pgClient.query(
                "INSERT INTO book(title , description , book_price , publisher) VALUES ($1 , $2  , $3 , $4)",
                [title, description, bookPrice, publisher]
            );

            console.log(results);
            res.status(200).json({
                message: "How do you want to be paid ?",
            });
        } catch (error) {
            return next(new ApplicationError(error));
        }
    }

    async getBooks(req, res, next) {
        try {
            const { rows } = await pgClient.query("SELECT * FROM book");
            res.status(200).json({
                body: {
                    data: rows,
                },
            });
        } catch (error) {
            return next(new ApplicationError(error));
        }
    }

    async getBook(req, res, next) {
        try {
            const { rows } = await pgClient.query(
                "SELECT * FROM book WHERE id = $1",
                [req.params.id]
            );
            res.status(200).json(rows[0]);
        } catch (error) {
            return next(new ApplicationError(error));
        }
    }
    async updateBook(req, res, next) {
        try {
            const { title } = req.body;
            const result = await pgClient.query(
                "UPDATE book SET title = $1 WHERE id = $2",
                [title, req.params.id]
            );
            console.log(result.rowCount);
            res.status(200).json({
                message: "Data was updated",
            });
        } catch (error) {
            return next(new ApplicationError(error));
        }
    }

    async removeBook(req, res, next) {
        try {
            const result = await pgClient.query(
                "DELETE FROM book WHERE id = $1",
                [req.params.id]
            );
            console.log(result.rowCount);
            res.status(200).json({
                message: "Data was removed",
            });
        } catch (error) {
            return next(new ApplicationError(error));
        }
    }

    async addUser(req, res, next) {
        try {
            const dob = Math.ceil(Math.random() * 900);
            const name = req.body.name; //faker.lorem.word();
            const email = faker.internet.email();

            const results = await pgClient.query(
                "INSERT INTO authors(name , email , dob) VALUES ($1 , $2  , $3)",
                [name, email, dob]
            );

            res.status(200).json({
                message: "Your name was added?",
            });
        } catch (error) {
            return next(new ApplicationError(error));
        }
    }
    async getUsers(req, res, next) {
        try {
            const { rows } = await pgClient.query("SELECT * FROM authors");
            res.status(200).json({
                body: {
                    data: rows,
                },
            });
        } catch (error) {
            return next(new ApplicationError(error));
        }
    }

    async getUser(req, res, next) {
        try {
            const { rows } = await pgClient.query(
                "SELECT * FROM authors WHERE id = $1",
                [req.params.id]
            );
            res.status(200).json(rows[0]);
        } catch (error) {
            return next(new ApplicationError(error));
        }
    }

    async updateUser(req, res, next) {
        try {
            const { name } = req.body;
            const result = await pgClient.query(
                "UPDATE authors SET name = $1 WHERE id = $2",
                [name, req.params.id]
            );

            res.status(200).json({
                message: "Data was updated",
            });
        } catch (error) {
            return next(new ApplicationError(error));
        }
    }

    async removeUser(req, res, next) {
        try {
            const result = await pgClient.query(
                "DELETE FROM authors WHERE id = $1",
                [req.params.id]
            );
            res.status(200).json({
                message: "Data was removed",
            });
        } catch (error) {
            return next(new ApplicationError(error));
        }
    }

    // Adding a book to the datastore should need a transaction
    // This is because , we will need to add the authror and the publisher of the book
    // addBook(title , publisher , cost , desc , [authors])
    // BEGIN
    // QUERY
    // In the query  , we will run a loop that sends data to db for different authors
    // COMMIT
    async addAuthorBook(req, res, next) {
        try {
            const { authorId, bookId } = req.body;

            const results = await pgClient.query(
                "INSERT INTO author_books(authorId , bookId) VALUES ($1 ,$2)",
                [authorId, bookId]
            );

            res.status(200).json({
                message: "Book attached to Author?",
            });
        } catch (error) {
            return next(new ApplicationError(error));
        }
    }

    async getAuthorsBooks(req, res, next) {
        try {
            const { rows } = await pgClient.query("SELECT * FROM author_books");
            res.status(200).json({
                body: {
                    data: rows,
                },
            });
        } catch (error) {
            return next(new ApplicationError(error));
        }
    }

    async getAuthorBook(req, res, next) {
        try {
            const { rows } = await pgClient.query(
                "SELECT * FROM author_books WHERE id = $1",
                [req.params.id]
            );
            res.status(200).json(rows[0]);
        } catch (error) {
            return next(new ApplicationError(error));
        }
    }
}

module.exports = new QuestionController();
