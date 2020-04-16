/* eslint linebreak-style: ["error", "windows"] */
const { getDb, getNextSequence } = require('./db.js');

async function get(_, { id }) {
  const db = getDb();
  const product = await db.collection('inventory').findOne({ id });
  return product;
}

// API to retrieve product
async function list() {
  const db = getDb();
  const products = await db.collection('inventory').find({}).toArray();
  return products;
}

// API to add product
async function add(_, { product }) {
  const db = getDb();
  const newProduct = Object.assign({}, product);
  newProduct.id = await getNextSequence('productsConter');
  const result = await db.collection('inventory').insertOne(newProduct);
  const savedProduct = await db.collection('inventory')
    .findOne({ _id: result.insertedId });
  return savedProduct;
}

async function update(_, { id, changes }) {
  const db = getDb();
  console.log(id);
  await db.collection('inventory').updateOne({ id }, { $set: changes });
  const savedIssue = await db.collection('inventory').findOne({ id });
  return savedIssue;
}

async function deleteProduct(_, { id }) {
  const db = getDb();
  await db.collection('inventory').deleteOne({ id });
  return db.collection('inventory').count();
}
module.exports = {
  add, list, get, update, deleteProduct,
};
