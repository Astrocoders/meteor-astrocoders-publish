AP.defineMethod('query', 'query', function(fn){
  if(!_.isFunction(fn)){
    throw new Error('[AstroPublish] Custom function must always be an function.');
  }

  return fn;
});
