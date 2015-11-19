AstroPublish = class {
  constructor(name, collection){
    this._predicates = [];
    this._mongoRules = [];
    this._name = name;
    this._queries = [];
    this._collection = collection;
  }

  static defineMethod(options){
    if(AstroPublish.prototype[options.name]){
      console.warn(`AstroPublish#${options.name} Already defined`);
    }

    if(!_.isObject(options)){
      throw new Error('Options must be an object');
    }

    if(!_.contains(['predicate', 'mongoRule', 'query'], options.type)){
      throw new Error(`Such method type ${options.type} doesnt exist`);
    }

    let methods = {
      predicate: '_predicates',
      mongoRule: '_mongoRules',
      query: '_queries'
    };

    AstroPublish.prototype[ options.name ] = function(...args){
      this[ methods[options.type] ].push({
        fn: options.fn,
        context: options.context,
        args
      });

      return this;
    };
  }

  static compactMethods(methods, pub, args){
    return _.reduce(methods, function(rules, rule){
      let fn = _.isFunction(rule.args[0]) ? rule.args[0] : rule.fn;
      let fnArgs = rule.context === 'chain' ? rule.args : args;

      return _.extend(rules, fn.call(pub, ...fnArgs));
    }, {});
  }

  ensureConditions(pub, pubArgs){
    return  _.every(this._predicates, (predicate) => {
      let fnArgs = predicate.context === 'chain' ? predicate.args : pubArgs;

      return predicate.fn.call(pub, ...fnArgs) === true;
    });
  }

  apply(){
    let self = this;

    Meteor.publish(this._name, function(...args){
      let query =
        AstroPublish.compactMethods(self._queries, this, args);
      let rules =
        AstroPublish.compactMethods(self._mongoRules, this, args);

      let allPredicatesPass = self.ensureConditions(this);

      if(allPredicatesPass){
        return self._collection.find(query, rules);
      } else {
        this.ready();
      }
    });
  }
};

AP = AstroPublish;

Mongo.Collection.prototype.publish = function(name){
  if(_.isUndefined(name)){
    throw new Error('[AstroPublish] You have to specify the publish name');
  }

  return new AstroPublish(name, this);
};
