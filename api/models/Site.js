/**
* Site.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    owner: {
      type:'string',
      required: true
    },
    repository: {
      type:'string',
      required: true
    },
    engine: {
      type: 'string',
      defaultsTo: 'static',
      enum: ['jekyll', 'hugo', 'static']
    },
    defaultBranch: {
      type: 'string',
      defaultsTo: 'master'
    },
    users: {
      collection: 'user',
      via: 'sites'
    },
    builds: {
      collection: 'build',
      via: 'site'
    }
  },

  beforeCreate: function(values, done) {
    this.registerSite(values, done);
  },

  registerSite: function(values, done) {
    async.parallel({
      // Set up GitHub webhook
      hook: GitHub.setWebhook.bind(this, values)
    }, function(err, res) {
      // Ignore error if hook already exists; otherwise, return error
      if (err) {
        var ghErr, hookMessage = 'Hook already exists on this repository';
        try { ghErr = JSON.parse(err.message).errors[0].message; } catch(e) {}
        if (ghErr !== hookMessage) return done(err);
      }
      done();
    });
  }
};
