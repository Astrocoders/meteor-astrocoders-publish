PublishContext = {
  args: []
};

Meteor.publish = function(name, fn){
  PublishContext.yielded = fn.call(PublishContext, ...PublishContext.args);
};
