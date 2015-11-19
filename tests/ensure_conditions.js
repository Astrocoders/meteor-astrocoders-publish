Tinytest.add('AP#ensureConditions - All predicates pass', function(test){
  AstroPublish.defineMethod({
    type: 'predicate',
    name: 'testPredicates1',
    fn(){
      return true;
    }
  });

  AstroPublish.defineMethod({
    type: 'predicate',
    name: 'testPredicates2',
    fn(){
      return true;
    }
  });

  let collection = {};
  let publication = {};
  let astroPublish = new AstroPublish(null, collection);

  astroPublish.testPredicates1().testPredicates2();

  test.isTrue(astroPublish.ensureConditions(publication));
});

Tinytest.add(`AP#ensureConditions - When no predicates predicates defined
  condition is true`, function(test){
  let collection = {};
  let publication = {};
  let astroPublish = new AstroPublish(null, collection);

  test.isTrue(astroPublish.ensureConditions(publication));
});

Tinytest.add(`AP#ensureConditions - One predicate fails thus conditions must
fail`, function(test){
  AstroPublish.defineMethod({
    type: 'predicate',
    name: 'testPredicates3',
    fn(){
      return true;
    }
  });

  AstroPublish.defineMethod({
    type: 'predicate',
    name: 'testPredicates4',
    fn(){
      return false;
    }
  });

  let collection = {};
  let publication = {};
  let astroPublish = new AstroPublish(null, collection);

  astroPublish.testPredicates3().testPredicates4();

  test.isFalse(astroPublish.ensureConditions(publication));
});
