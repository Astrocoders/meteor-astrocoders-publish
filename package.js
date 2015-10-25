Package.describe({
  name: 'astrocoders:publish',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.2');
  api.use([
    'ecmascript',
    'meteor-platform',
    'mongo'
  ]);

  api.addFiles([
    'publish.js',
  ]);

  api.addFiles([
    'mongo_rules.js',
    'methods.js',
    'query.js'
  ], 'server');

  api.export('AstroPublish', 'server');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('astrocoders:publish');
  api.addFiles('publish-tests.js');
});
