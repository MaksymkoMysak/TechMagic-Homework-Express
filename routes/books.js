const express = require("express");
const router = express.Router();

const createError = require("http-errors");

function validation(req, res, next) {
  //middlreware validator for review
  if (req.body.id && req.body.title) {
    if (!books.some((elem) => elem.id === req.body.id)) {
      if (req.body.reviews && req.body.reviews.length > 0) {
        if (Array.isArray(req.body.reviews)) {
          req.body.reviews.forEach((reviews) => {
            if (
              !reviews.id ||
              !reviews.comment ||
              reviews.id == "" ||
              reviews.comment == ""
            ) {
              next(
                createError(
                  400,
                  "Every review must have both fields 'id' and 'comment' filled"
                )
              );
              return;
            }
          });
          if (ifReviewIdUnique(req.body.reviews)) {
            next();
          } else {
            next(createError(400, "Every review's id must be unique!"));
            return;
          }
        } else {
          next(createError(400, "reviews must be array of objects!"));
          return;
        }
      } else {
        next(createError(400, "Book must have at least 1 review"));
        return;
      }
    } else {
      next(
        createError(
          400,
          `There is already exist book with such id! You can choose id which is bigger than ${
            books.length - 1
          }`
        )
      );
      return;
    }
  } else {
    next(createError(400, "Both fields 'id' and 'comment' must be field"));
    return;
  }
}

router.get("/", (req, res) => {
  res.json(books);
});

router.get("/:id", (req, res, next) => {
  if (books.some((auth) => auth.id === req.params.id)) {
    res.json(books[req.params.id]);
  } else {
    next(createError(400, `There isn't such book with id: ${req.params.id}`));
    return;
  }
});

router.get("/:id/reviews", (req, res) => {
  res.json(books[req.params.id].reviews);
});

router.get("/:id/reviews/:reviewId", (req, res, next) => {
  if (books[req.params.id].reviews.some((el) => el.id == req.params.reviewId)) {
    res.json(books[req.params.id].reviews[req.params.reviewId]);
  } else {
    next(
      createError(400, `There isn't rview with such id: ${req.params.reviewId}`)
    );
    return;
  }
});

router.post("/", validation, (req, res) => {
  books.push({
    id: req.body.id,
    title: req.body.title,
    reviews: req.body.reviews,
  });
  res.status(200).json({ books });
});

router.put("/:id/reviews", (req, res) => {
  // add some new review
  if (books.some((book) => book.id === req.params.id)) {
    if (req.body.review) {
      if (req.body.review.id && req.body.review.comment) {
        books[req.params.id].reviews.push(req.body.review);
        console.log("reviews was added!");
        res.json(books[req.params.id]);
      } else {
        next(createError(400, "You have to input id and comment of review!"));
        return;
      }
    } else {
      next(createError(400, "You have to input some new review!"));
      return;
    }
  } else {
    next(createError(400, `There isn't such book with id: ${req.params.id}`));
    return;
  }
});

router.put("/:id", (req, res, next) => {
  if (books.some((book) => book.id === req.params.id)) {
    if (req.body.title) {
      books[req.params.id].title = req.body.title;
      console.log("title was updated!");
      res.json(books[req.params.id]);
    } else {
      next(createError(400, "You have to input some new title!"));
      return;
    }
  } else {
    next(createError(400, `There isn't such book with id: ${req.params.id}`));
    return;
  }
});

router.delete("/:id", (req, res, next) => {
  if (books.some((book) => book.id === req.params.id)) {
    books.splice(req.params.id, 1);
    recountId(books, req.params.id);
    res.json(books);
  } else {
    next(createError(400, `There isn't such book with id: ${req.params.id}`));
    return;
  }
});

router.delete("/:id/reviews/:reviewId", (req, res, next) => {
  //remove some review
  if (books.some((book) => book.id === req.params.id)) {
    if (
      books[req.params.id].reviews.some(
        (review) => review.id === req.params.reviewId
      )
    ) {
      books[req.params.id].reviews = books[req.params.id].reviews.filter(
        (review) => review.id !== req.params.reviewId
      );
      res.json(books);
    } else {
      next(
        createError(
          400,
          `There isn't such review with id: ${req.params.reviewId}`
        )
      );
      return;
    }
  } else {
    next(createError(400, `There isn't such book with id: ${req.params.id}`));
    return;
  }
});

function recountId(arr, deletedId) {
  arr.forEach((elem) => {
    if (elem.id > deletedId) {
      elem.id = elem.id - 1;
    }
  });
}

function ifReviewIdUnique(array) {
  let isUnique;
  array.filter((item, index, arr) => {
    isUnique =
      arr.map((mapItem) => mapItem["id"]).indexOf(item["id"]) === index;
  });
  return isUnique;
}

let books = [
  {
    id: "0",
    title: "Book1",
    reviews: [{ id: "0", comment: "Hello world" }],
  },
  {
    id: "1",
    title: "Book2",
    reviews: [{ id: "0", comment: "Nice" }],
  },
];

module.exports = router;
