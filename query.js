AP.defineMethod({
  type: 'query',
  name: 'query',
  fn: function(fn){
    if(!_.isFunction(fn)){
      throw new Error('[AstroPublish] Custom function must always be an function.');
    }

    return fn;
  }
});

AP.defineMethod({
  type: 'query',
  name: 'byGotId',
  fn: function(_id){
    return {
      _id
    };
  }
});
