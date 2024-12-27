'use strict';

const mongoose = require('mongoose');
const Book = require('../models/Books'); // Assuming the Book model is in models/Book.js

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res) {
      try {
        const books = await Book.find({});
        const formattedBooks = books.map(book => ({
          _id: book._id,
          title: book.title,
          commentcount: book.comments.length
        }));
        res.json(formattedBooks);
      } catch (error) {
        res.status(500).send('Internal server error');
      }
    })
    
    .post(async function (req, res) {
      const { title } = req.body;
      if (!title) {
        return res.send('missing required field title');
      }
      try {
        const newBook = new Book({ title });
        await newBook.save();
        res.json({ _id: newBook._id, title: newBook.title });
      } catch (error) {
        res.status(500).send('Internal server error');
      }
    })
    
    .delete(async function (req, res) {
      try {
        await Book.deleteMany({});
        res.send('complete delete successful');
      } catch (error) {
        res.status(500).send('Internal server error');
      }
    });

  app.route('/api/books/:id')
    .get(async function (req, res) {
      const { id: bookid } = req.params;
      if (!mongoose.Types.ObjectId.isValid(bookid)) {
        return res.status(400).send('Invalid book ID');
      }
      try {
        const book = await Book.findById(bookid);
        if (!book) {
          return res.send('no book exists');
        }
        res.json({ _id: book._id, title: book.title, comments: book.comments });
      } catch (error) {
        res.status(500).send('Internal server error');
      }
    })
    
    .post(async function (req, res) {
      const { id: bookid } = req.params;
      const { comment } = req.body;
      if (!comment) {
        return res.send('missing required field comment');
      }
      if (!mongoose.Types.ObjectId.isValid(bookid)) {
        return res.status(400).send('Invalid book ID');
      }
      try {
        const book = await Book.findById(bookid);
        if (!book) {
          return res.send('no book exists');
        }
        book.comments.push(comment);
        await book.save();
        res.json({ _id: book._id, title: book.title, comments: book.comments });
      } catch (error) {
        res.status(500).send('Internal server error');
      }
    })
    
    .delete(async function (req, res) {
      const { id: bookid } = req.params;
      if (!mongoose.Types.ObjectId.isValid(bookid)) {
        return res.status(400).send('Invalid book ID');
      }
      try {
        const book = await Book.findByIdAndDelete(bookid);
        if (!book) {
          return res.send('no book exists');
        }
        res.send('delete successful');
      } catch (error) {
        res.status(500).send('Internal server error');
      }
    });

}
