AstroPublish
============
Smart re-use your publications.

Take a look of your current publications:
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

And for every data you wanna to send just if there's a logged user you will
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

## Custom methods
You can create custom methods calling `AstroPublish.definedMethod`.
There are just three types of methods available:
- `query`
  The returns of these methods will be merged into a single object and will
  be used during the publication return. These methods must always return
  an object.
- `predicate`
  Must always return `true` or `false`. They are invoked before any query in the
  collection. Think about them like the `if(this.userId) Collection.find()`
  of our first example.
- `mongoRule`
  The return of these methods will be merge into a single object and will be used
  as the second argument of the `Collection.find(query, mongoRules)`.

## License
MIT. Enjoy!
