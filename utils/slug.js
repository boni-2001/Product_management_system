const Product = require("../app/model/Product");

const generateUniqueSlug = async (baseSlug) => {
  let slug = baseSlug;
  let count = 1;

  while (await Product.findOne({ slug })) {
    slug = `${baseSlug}-${count++}`;
  }

  return slug;
};

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") 
    .replace(/[^\w\-]+/g, "") 
    .replace(/\-\-+/g, "-"); 
};

module.exports = {
  generateUniqueSlug,
  slugify,
};
