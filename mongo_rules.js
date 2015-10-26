AP.defineMethod({
  type: 'mongoRule',
  name: 'lastest',
  fn: function(){
    return {
      sort: {
        createdAt: - 1
      }
    };
  }
});

AP.defineMethod({
  type: 'mongoRule',
  name: 'one',
  fn: function(){
    return {
      limit: 1
    };
  }
});

AP.defineMethod({
  type: 'mongoRule',
  name: 'mongoRule',
  fn: function(fn){
    if(!_.isFunction(fn)){
      throw new Error('[AstroPublish] Custom function must always be an function.');
    }

    return fn;
  }
});

AP.defineMethod({
  type: 'mongoRule',
  name: 'fields',
  context: 'chain',
  fn: function(...fields){
    fields = fields.map((field) => {
      return { [field]: 1 };
    });

    fields = _.reduce(fields, (obj, field) => _.extend(obj, field), {});

    let mongoRule = { fields };

    return mongoRule;
  }
});

AP.defineMethod({
  type: 'mongoRule',
  name: 'limit',
  context: 'chain',
  fn: function(limit){
    return {
      limit
    };
  }
});
