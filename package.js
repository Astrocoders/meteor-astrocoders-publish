Package.describe({
  name: 'astrocoders:publish',
  version: '1.0.0',
  summary: 'Smart re-use your publications.',
  git: 'https://github.com/Astrocoders/meteor-astrocoders-publish',
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
  api.addFiles([
    'tests/mocks/mongo.js',
    'tests/mocks/publish.js',
    'tests/ensure_conditions.js',
    'tests/method_context.js',
    'tests/compactation.js',
    'tests/apply.js',
  ], 'server');
});
