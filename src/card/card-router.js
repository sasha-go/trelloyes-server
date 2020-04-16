const express = require('express');
const uuid = require("uuid/v4");
const logger = require('../logger');
const { cards, list } = require('../store');


const cardRouter = express.Router();
const bodyParser = express.json();


// ROUTING FOR CARD
cardRouter
	.route('/card')
	.get((req,res) => {
		res.json(cards);
	})
	.post(bodyParser, (req, res) => {
		const { title, content} = req.body;

  if (!title) {
    logger.error('Title is required');
    return res
      .status(400)
      .send('Invalid data')
  }

  if (!content) {
    logger.error('Content is required');
    return res
      .status(400)
        .send('Invalid data')
  }

  const id = uuid();

  const card = {
    id,
    title,
    content
  }

  cards.push(card);

  logger.info(`Card with id ${id} created`);

  res
    .status(201)
    .location(`http://localhost:8001/card/${id}`)
    .json(card);
	}) 
	
// ROUTING FOR CARD/:ID
cardRouter
  .route("/card/:id")
  .get((req, res) => {
    const { id } = req.params;
    const card = cards.find((c) => c.id == id);

    if (!card) {
      logger.error(`Card with id ${id} not found`);
      return res.status(404).send("Card Not Found");
    }

    res.json(card);
  })
  .delete((req, res) => {
    const { id } = req.params;

    const cardIndex = cards.findIndex((c) => c.id == id);

    if (cardIndex === -1) {
      logger.error(`Card with id ${id} not found.`);
      return res.status(404).send("Not found");
    }

    lists.forEach((list) => {
      const cardsIds = list.cardIds.filter((cid) => cid !== id);
      list.cardIds = cardIds;
    });

    cards.splice(cardIndex, 1);

    logger.info(`Card with id ${id} deleted`);

    res.status(204).end();
  });

module.exports = cardRouter;