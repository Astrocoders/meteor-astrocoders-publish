AP.defineMethod({
  type: 'predicate',
  name: 'ifSignedIn',
  fn: function(){
    return !!this.userId;
  }
});
