import Product from "../models/Product.js";

export const getSearch = async (req, res) => {
  const  search  = req.query.searchQuery;
  try {
    const result = await Product.find({
      title: { $regex: search, $options: "i" },
    });
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
};
