AP.defineMethod({
  type: 'predicate',
  name: 'ifSignedIn',
  fn: function(userId){
    return !!userId;
  }
});
