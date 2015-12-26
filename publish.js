let astroMethods = {};

AP = AstroPublish = function(name, collection){
  return _.extend({}, astroMethods, {
    _name: name,
    _collection: collection,
    _predicates: [],
    _mongoRules: [],
    _queries: [],
    _debug: false,
    _verbose: false,
    _withPubs: [],

    with(astroPublish){
      this._withPubs.push(astroPublish);

      return this;
    },

    debug(value){
      this._debug = value;

      return this;
    },

    ensureConditions(pub, pubArgs){
      return  _.every(this._predicates, (predicate) => {
        let fnArgs = predicate.context === 'chain' ? predicate.args : pubArgs;

        return predicate.fn.call(pub, ...fnArgs) === true;
      });
    },

    getCursor(astroPub, pubContext, args){
      let query =
        AstroPublish.compactMethods(astroPub._queries, pubContext, args);
      let rules =
        AstroPublish.compactMethods(astroPub._mongoRules, pubContext, args);

      return {query, rules};
    },

    apply(){
      let self = this;

      Meteor.publish(this._name, function(...args){
        if(self._debug) debugger;

        let allPredicatesPass = self.ensureConditions(this);

        if(allPredicatesPass){
          let search = self.getCursor(self, this, args);
          let cursors = [];
          cursors.push(self._collection.find(search.query, search.rules));

          self._withPubs.forEach((astroPub) => {
            let pubSearch = self.getCursor(astroPub, this, args);
            cursors.push(
              astroPub._collection.find(pubSearch.query, pubSearch.rules)
            );
          });

          return cursors;
        } else {
          this.ready();
        }
      });
    },
  });
};

AstroPublish.defineMethod = function(options){
  if(astroMethods[options.name]){
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

  astroMethods[ options.name ] = function(...args){
    this[ methods[options.type] ].push({
      fn: options.fn,
      context: options.context,
      args
    });

    return this;
  };
};

AstroPublish.compactMethods = function(methods, pub, args){
  return _.reduce(methods, function(rules, rule){
    let fn = _.isFunction(rule.args[0]) ? rule.args[0] : rule.fn;
    let fnArgs = rule.context === 'chain' ? rule.args : args;

    return _.extend(rules, fn.call(pub, ...fnArgs));
  }, {});
};

Mongo.Collection.prototype.publish = function(name = this._name){
  return AstroPublish(name, this);
};
