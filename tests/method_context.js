Tinytest.add(`Method context - this - Should properly receive user id
  from this.userId within method`,
function(test){
  let userIdTest = '123';
  AstroPublish.defineMethod({
    type: 'predicate',
    name: 'testThisUserId',
    fn(){
      test.isTrue(this.userId === userIdTest);

      return true;
    }
  });

  let collection = {};
  let publication = {
    userId: userIdTest,
  };

  let astroPublish = new AstroPublish(null, collection);

  astroPublish.testThisUserId();
  astroPublish.ensureConditions(publication);
});

Tinytest.add(`Method context - args context - Should properly receive args
passed from chain`,
function(test){
  let chainArg = 1;

  AstroPublish.defineMethod({
    type: 'predicate',
    context: 'chain',
    name: 'testChainArgs',
    fn(receivedChainArg){
      test.isTrue(chainArg === receivedChainArg);

      return true;
    }
  });

  let collection = {};
  let publication = {};

  let astroPublish = new AstroPublish(null, collection);

  astroPublish.testChainArgs(chainArg);
  astroPublish.ensureConditions(publication);
});

Tinytest.add(`Method context - args context - Should properly receive args given
  to Meteor.publish`,
function(test){
  let pubArg = 1;

  AstroPublish.defineMethod({
    type: 'predicate',
    name: 'testPubArgs',
    fn(receivedPubArg){
      test.isTrue(pubArg === receivedPubArg);

      return true;
    }
  });

  let collection = {};
  let publication = {};

  let astroPublish = new AstroPublish(null, collection);

  astroPublish.testPubArgs();
  astroPublish.ensureConditions(publication, [pubArg]);
});
