'use strict';

const _ = require('lodash');
const GogoShell = require('gogo-shell');
const os = require('os');
const path = require('path');

const REGEX_WIN = /^win/;

const GogoDeployer = function(config: any) {
    GogoShell.call(this, config);

    config = config || {};

    this.connectConfig = config.connectConfig;
};

GogoDeployer.prototype = _.create(GogoShell.prototype, {
    deploy: function(bundlePath: any, bundleName: any) {
        const instance = this;

        return this.connect(this.connectConfig)
            .then(function() {
                return instance._getBundleStatusByBundleName(bundleName);
            })
            .then(function(data: any) {
                if (data.length) {
                    return instance._updateBundle(data[0].id, bundlePath);
                } else {
                    return instance._installBundle(bundlePath);
                }
            })
            .then(function(data: any) {
                if (data.indexOf('Bundle ID') > -1) {
                    const bundleId = instance._getBundleIdFromResponse(data);
                    return instance._startBundle(bundleId);
                }
                return data;
            });
    },
    _updateBundle: function(bundleId: any, bundlePath: any) {
        return this.sendCommand('update', bundleId, this._formatBundleURL(bundlePath));
    },
    _getBundleStatusByBundleName: function(bundleName: any) {
        return this.sendCommand('lb -u -s | grep', bundleName)
            .then(function(data: any) {
                return _.reduce(data.split('\n'), function(result: any, item: any, index: any) {
                    const fields = item.split('|');
                    if (fields.length == 4) {
                        result.push({
                            id: _.trim(fields[0]),
                            level: _.trim(fields[2]),
                            status: _.trim(fields[1]),
                            updateLocation: _.trim(fields[3])
                        });
                    }
                    return result;
                }, []);
            });
    },
    _formatBundleURL: function(bundlePath: any) {
        if (this._isWin()) {
            bundlePath = '/' + bundlePath.split(path.sep).join('/');
        } else {
            bundlePath = '//' + bundlePath;
        }
        bundlePath = bundlePath.replace(/\s/g, '%20');
        return 'file:' + bundlePath;
    },
    _getBundleIdFromResponse: function(response: any) {
        const match = response.match(/Bundle\sID:\s*([0-9]+)/);
        return match ? match[1] : 0;
    },
    _installBundle: function(bundlePath: any) {
        return this.sendCommand('install', this._formatBundleURL(bundlePath));
    },
    _isWin: function() {
        return REGEX_WIN.test(os.platform());
    },
    _startBundle: function(bundleId: any) {
        return this.sendCommand('start', bundleId);
    }
});

module.exports.GogoDeployer = GogoDeployer;
