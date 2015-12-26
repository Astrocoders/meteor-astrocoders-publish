AP.defineMethod({
  type: 'predicate',
  name: 'ifSignedIn',
  fn(){
    return !!this.userId;
  }
});

AP.defineMethod({
  type: 'predicate',
  name: 'ifHasRole',
  context: 'chain',
  fn(...roles){
    if(!Package['alanning:roles']){
      throw new Error('[AstroPublish]',
        'In order to use `ifHasRole` you need to add alanning:roles');
    }

    return Package['alanning:roles'].Roles.userIsInRole(this.userId, roles);
  }
});
