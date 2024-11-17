const express = require('express');
const PortfolioItem = require('../models/PortfolioItem');
const router = express.Router();

// Portfolio Page
router.get('/', async (req, res) => {
    const items = await PortfolioItem.find();
    res.render('portfolio', { items });
});

// Create Portfolio Item
router.post('/create', async (req, res) => {
    const { title, description, images } = req.body;
    const newItem = new PortfolioItem({ title, description, images });
    
    await newItem.save();
    res.redirect('/portfolio');
});

// Other CRUD operations can be added similarly...

module.exports = router;