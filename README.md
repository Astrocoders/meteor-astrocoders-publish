AstroPublish
============
Smart re-use your publications.

Take a look at your current publications:
```js
  Meteor.publish('items', function(){
    if(this.userId){
      return Items.find();
    } else {
      this.ready();
    }
  });

  Meteor.publish('photos', function(){
    if(this.userId){
      return Photos.find();
    } else {
      this.ready();
    }
  });
```

And for every publication you wanna to send only if the user is logged in you gotta to
repeat that. Not nice, right? Now take a look how they will become with
AstroPublish:

```js
  Items.publish('items').ifSignedIn().apply();
  Photos.publish('photos').ifSignedIn().apply();
```

Liked? And how about this one:
```js
  AstroPublish.defineMethod('query', 'isOwner', function(userId){
    return {
      owner: userId
    }
  });

  // ...

  Items.publish('items').ifSignedIn().isOwner().apply();
  Photos.publish('photos').ifSignedIn().isOwner().one().lastest().apply();
```

Of course you can do more than one publication!:

in client:
```js
  this.subscribe('itemsEdit', FlowRouter.getParam('_id'));
```
in server:
```js
// The userId param is the `this.userId` from inside the Meteor.publish
// it is always the lastest argument of methods.
Items.publish('itemsEdit').isOwner().query((itemId, userId) => {
  return {
    itemId
  }
}).apply();
```

## Usage
Call `.publish(pubName)` and the chain the methods you want and then invoke
`apply()` at the end to create the publication.

## Built-in methods
- *.ifSignedIn*, only query if the user are logged in.
- *.one*, sets limit to 1
- *.lastest*, it's the same as:
```js
{
  sort: {
    createdAt: -1
  }
}
```
- *.mongoRule*, usage:
```js
Items.publish('items').mongoRule(() => {
  return {
    fields: {
      _id: 1
    }
  }
}).apply();
// And the subscription will only get those fields.
```
- *.fields*, usage:
```js
Items.publish('items').fields('name', 'price').apply();
// And the subscription will only get those fields.
```
- *.limit*, usage:
```js
Items.publish('items').lastest().limit(10).apply();
```
- *.byGotId*. It's really common you create a publication that only gets an id
param and the query for the correspondent document in the database (`{_id: id}`):
```js
// This method expects a subscription like this:
this.subscribe('fooEdit', fooId);

// ...
Items.publish('fooEdit').byGotId();
```

## Extending with custom methods
You can create custom methods calling `AstroPublish.definedMethod`.
There are just three types of methods available:
- `query`
  The returns of these methods will be merged into a single object and will
  be used during the publication return. These methods must always return
  an object.
```js
AstroPublish.defineMethod({
  type: 'query',
  name: 'hasPriceBetween',
  // with `context: 'chain'` option.fn callback will receive
  // the arguments from the chain, like it is in built-in method `field`
  context: 'chain',
  fn: function(min, max, userId){
    // Return a query here
    return {
      price: {
        $lt: min,
        $gt: max
      }
    }
  }
});

// ...
Items.publish('items').hasPriceBetween(50, 100);

```
But if instead of getting the arguments from the chain context, you wanna
to get them from the arguments send to the publish by the subscribe you do:
client
```js
this.subscribe('itemsByPrice', 50, 100);
```
server
```js
AstroPublish.defineMethod({
  type: 'query',
  name: 'hasPriceBetween',
  // Without the 'context: chain' the arguments here are the arguments
  // received by the `Meteor.publish` from subscription.
  fn: function(min, max, userId){
    // Return a query here
    return {
      price: {
        $lt: min,
        $gt: max
      }
    }
  }
});

// ...
Items.publish('items').hasPriceBetween(50, 100);
```

- `predicate`
  Must always return `true` or `false`. They are invoked before any query in the
  collection. Think about them like the `if(this.userId) Collection.find()`
  of our first example.
```js
AstroPublish.defineMethod({
  type: 'predicate',
  // you can use 'context: chain' here too
  name: 'ifUserIsCool',
  fn: function(userId){
    let user = Meteor.users.findOne(userId);

    return !!user.isCool;
  }
});

// ...
Items.publish('items').ifUserIsCool();
```
- `mongoRule`
  The return of these methods will be merge into a single object and will be used
  as the second argument of the `Collection.find(query, mongoRules)`.
```js
AstroPublish.defineMethod({
  type: 'mongoRule',
  context: 'chain',
  name: 'skip',
  fn: function(number){
    return {
      skip: number
    };
  }
});

// ...
Items.publish('items').skip(5);
```

## License
MIT. Enjoy!
