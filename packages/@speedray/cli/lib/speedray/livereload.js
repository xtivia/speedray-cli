/* jshint node:true */
var lr = require('tiny-lr');
var servers = {};

function LiveReload(options) {
  this.options = options || {};
  this.port = this.options.port || 35729;
  this.ignore = this.options.ignore || null;
  this.quiet = this.options.quiet || false;
  this.portletName = this.options.portletName;
  this.ui = this.options.ui;

  this.lastHash = null;
  this.lastChildHashes = [];
  this.hostname = this.options.hostname || 'localhost';
  this.server = null;
}

function arraysEqual(a1, a2) {
  return a1.length==a2.length && a1.every(function(v,i) {
    return v === a2[i]
  });
}

Object.defineProperty(LiveReload.prototype, 'isRunning', {
  get: function() {
    return !!this.server;
  }
});

LiveReload.prototype.start = function start(cb) {
  const port = this.port;
  const quiet = this.quiet;
  const self = this;
  if (servers[port]) {
    this.server = servers[port];
    if(cb) {
      cb();
    } 
  } else {
    this.server = servers[port] = lr(this.options);
    this.server.errorListener = function serverError(err) {
      self.ui.writeError('Live Reload disabled: ' + err.message);
      if (err.code !== 'EADDRINUSE') {
        self.ui.writeError(err.stack);
      }
      if(cb) {
        cb();
      }
    };
    this.server.listen(this.port, function serverStarted(err) {
      if (!err && !quiet) {
        self.ui.writeLine('Live Reload listening on port ' + port + '\n');
      }
      if(cb) {
        cb();
      }
    });
  }
};

LiveReload.prototype.done = function done(stats) {
  var hash = stats.compilation.hash;
  var childHashes = (stats.compilation.children || []).map(child => child.hash);
  var files = Object.keys(stats.compilation.assets).map(file => {
    return '/o/'+this.portletName+'/'+file;
  });
  var include = files.filter(function(file) {
    return !file.match(this.ignore);
  }, this);

  if (this.isRunning && (hash !== this.lastHash || !arraysEqual(childHashes, this.lastChildHashes)) && include.length > 0) {
    this.lastHash = hash;
    this.lastChildHashes = childHashes;
    setTimeout(function onTimeout() {
      this.server.notifyClients(include);
    }.bind(this));
  }
};

LiveReload.prototype.failed = function failed() {
  this.lastHash = null;
  this.lastChildHashes = [];
};

LiveReload.prototype.autoloadJs = function autoloadJs() {
  return [
    '// webpack-livereload-plugin',
    '(function() {',
    '  if (typeof window === "undefined") { return };',
    '  var id = "webpack-livereload-plugin-script";',
    '  if (document.getElementById(id)) { return; }',
    '  var el = document.createElement("script");',
    '  el.id = id;',
    '  el.async = true;',
    '  el.src = "http://' + this.hostname + ':' + this.port + '/livereload.js";',
    '  document.getElementsByTagName("head")[0].appendChild(el);',
    '}());',
    ''
  ].join('\n');
};

LiveReload.prototype.scriptTag = function scriptTag(source) {
  var js = this.autoloadJs();
  if (this.options.appendScriptTag && this.isRunning) {
    return js + source;
  } else {
    return source;
  }
};

LiveReload.prototype.applyCompilation = function applyCompilation(compilation) {
  compilation.mainTemplate.plugin('startup', this.scriptTag.bind(this));
};

LiveReload.prototype.apply = function apply(compiler) {
  this.compiler = compiler;
  compiler.plugin('compilation', this.applyCompilation.bind(this));
};

module.exports = LiveReload;