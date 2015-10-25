AP.defineMethod('mongoRule', 'lastest', function(){
  return {
    sort: {
      createdAt: - 1
    }
  };
});

AP.defineMethod('mongoRule', 'one', function(){
  return {
    limit: 1
  };
});

AP.defineMethod('mongoRule', 'mongoRule', function(fn){
  if(!_.isFunction(fn)){
    throw new Error('[AstroPublish] Custom function must always be an function.');
  }

  return fn;
});
