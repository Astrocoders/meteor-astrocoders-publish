AP.defineMethod({
  type: 'predicate',
  name: 'ifSignedIn',
  fn: function(userId){
    return !!userId;
  }
});

AP.defineMethod({
  type: 'predicate',
  name: 'unblock',
  fn: function(){
    this.unblock();

    return true;
  }
});
