Tinytest.add(`Mongo.Collection.prototype.publish - should initialize
  AstroPublish with collection name if none was passed`, (test) => {
  let collection = new Mongo.Collection('Besouro');
  let astroPublish = collection.publish();

  test.equal(astroPublish._name, collection._name);
});
