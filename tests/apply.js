Tinytest.add('AP#apply - Predicates - When predicates fail must call this.ready',
function(test){
  AstroPublish.defineMethod({
    type: 'predicate',
    name: 'failPredicate',
    fn(){
      return false;
    }
  });

  let collection = {};
  PublishContext.ready = function(){
    test.ok();
  };

  let astroPublish = new AstroPublish(null, collection);

  astroPublish.failPredicate();
  astroPublish.apply();
});

Tinytest.add(`AP#apply - Return - When predicates pass must yield to collection
  find method query and mongo rules objects correctly based on used chain rules`,
function(test){
  AstroPublish.defineMethod({
    type: 'predicate',
    name: 'passingPredicate',
    fn(){
      return true;
    }
  });

  let pubArgs = ['123'];
  let expected = {
    query: {
      _id: pubArgs[0],
    },

    mongoRules: {
      limit: 1,
      fields: {
        foo: 1,
        bar: 1,
      },
    },
  };

  let collection = {
    find(query, mongoRules){
      test.equal({
        query,
        mongoRules
      }, expected);
    }
  };

  let astroPublish = new AstroPublish(null, collection);
  PublishContext.args = pubArgs;
  astroPublish.byGotId().one().fields('foo', 'bar');
  astroPublish.apply();
});
