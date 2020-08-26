const Menu = require("../models/menu");

exports.index = async (req, res, next) => {
  try {
    const menu = await Menu.find().populate("shop");

    res.status(200).json({
      result: menu,
    });
  } catch (error) {
    next(error);
  }
};
