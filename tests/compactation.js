Tinytest.add(`AstroPublish.compactMethods - query - should properly create the
  query object `, function(test){
  AstroPublish.defineMethod({
    type: 'query',
    name: 'testQuery1',
    fn(){
      return {
        foo: 'bar'
      };
    }
  });

  let publication = {};
  let collection = {};
  let pubArgs = ['123'];
  let astroPublish = new AstroPublish(null, collection);

  astroPublish.testQuery1().byGotId();

  let compacted = AstroPublish.compactMethods(
    astroPublish._queries, publication, pubArgs);
  let expected = {
    foo: 'bar',
    _id: pubArgs[0]
  };
  test.equal( compacted, expected );
});

Tinytest.add(`AstroPublish.compactMethods - mongoRule - should properly create
  the mongo rules object `, function(test){
  AstroPublish.defineMethod({
    type: 'mongoRule',
    name: 'testMongoRules1',
    fn(){
      return {
        sort: {
          bananas: -1
        }
      };
    }
  });

  let publication = {};
  let collection = {};
  let astroPublish = new AstroPublish(null, collection);

  astroPublish.testMongoRules1().one().fields('bananas', 'crazyParty');

  let compacted = AstroPublish.compactMethods(
    astroPublish._mongoRules, publication);
  let expected = {
    sort: {
      bananas: -1
    },

    limit: 1,

    fields: {
      bananas: 1,
      crazyParty: 1,
    },
  };

  test.equal( compacted, expected );
});
