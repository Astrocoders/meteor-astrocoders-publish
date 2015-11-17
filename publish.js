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
      throw new Error('Already defined');
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

  apply(){
    let self = this;

    Meteor.publish(this._name, function(...args){
      let userId = this.userId;
      let query = compactMethods(self._queries, self, args, userId);
      let rules = compactMethods(self._mongoRules, self, args, userId);

      let allPredicatesPass = _.every(self._predicates, (predicate) => {
        return predicate.fn.call(this, ...predicate.args, userId) === true;
      });

      if(allPredicatesPass){
        return self._collection.find(query, rules);
      } else {
        this.ready();
      }
    });
  }
};

AP = AstroPublish;

function compactMethods(methods, AstroPublish, args, userId){
  return _.reduce(methods, function(rules, rule){
    let fn = _.isFunction(rule.args[0]) ? rule.args[0] : rule.fn;
    let fnArgs = rule.context === 'chain' ? rule.args : args;

    return _.extend(rules, fn.call(AstroPublish, ...fnArgs, userId));
  }, {});
}

Mongo.Collection.prototype.publish = function(name){
  if(_.isUndefined(name)){
    throw new Error('[AstroPublish] You have to specify the publish name');
  }

  return new AstroPublish(name, this);
};
