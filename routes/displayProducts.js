const express = require("express");
const { Product } = require("../collections");

const router = express.Router();

router.get("/", async (req, res) => {
  let category = req.query.category;
  let searchContent = req.query.searchContent;

  let products;

  if (category) {
    // Change the category to handle the database standards
    category = category.toLowerCase();

    // If a category is provided, find products of that category
    products = await Product.find({ category: category });
  } else if (searchContent) {
    // Change the searchContent to handle the database standards
    searchContent = searchContent.toLowerCase();

    // If search content is provided, find products containing the search content
    // \\b to search for the full word and not only a part of it
    // \\b(?=\\s|$) to eliminate the . or , from the search
    products = await Product.find({
      $or: [
        {
          name: {
            $regex: "\\b" + searchContent + "\\b(?=\\s|$)",
            $options: "i",
          },
        },
        {
          description: {
            $regex: "\\b" + searchContent + "\\b(?=\\s|$)",
            $options: "i",
          },
        },
        {
          category: {
            $regex: "\\b" + searchContent + "\\b(?=\\s|$)",
            $options: "i",
          },
        },
      ],
    });
  } else {
    // If no category or search content is provided, find all products
    products = await Product.find();
  }

  if (!products) {
    console.log("No products found");
  }
  res.send(products);
});

module.exports = router;
