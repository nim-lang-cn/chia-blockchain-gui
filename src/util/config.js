const yaml = require('js-yaml');
const fs = require('fs');
const os = require('os');
const path = require('path');
const lodash = require('lodash');

// defaults used in case of error point to the localhost daemon & its certs
let self_hostname = { chia: 'localhost', flax: 'localhost', goji: 'localhost' };
global.daemon_rpc_ws = {
  chia: `wss://${self_hostname.chia}:55400`,
  flax: `wss://${self_hostname.flax}:56600`,
  goji: `wss://${self_hostname.goji}:57500`
};

global.cert_path = {
  chia: 'config/ssl/daemon/private_daemon.crt',
  flax: 'config/ssl/daemon/private_daemon.crt',
  goji: 'config/ssl/daemon/private_daemon.crt'
};
global.key_path = {
  chia: 'config/ssl/daemon/private_daemon.key',
  flax: 'config/ssl/daemon/private_daemon.key',
  goji: 'config/ssl/daemon/private_daemon.key'
};

function loadConfig(net) {
  try {
    // check if CHIA_ROOT is set. it overrides 'net'
    const config_root_dir = {
      chia:
        'CHIA_ROOT' in process.env
          ? process.env.CHIA_ROOT
          : path.join(os.homedir(), '.chia', net),
      flax: 'FLAX_ROOT' in process.env
        ? process.env.FLAX_ROOT
        : path.join(os.homedir(), '.flax', net),
      goji: 'GOJI_ROOT' in process.env
        ? process.env.GOJI_ROOT
        : path.join(os.homedir(), '.goji-blockchain', net),
    }


    var config = {
      chia: yaml.load(
        fs.readFileSync(path.join(config_root_dir.chia, 'config/config.yaml'), 'utf8'),
      ),
      flax: yaml.load(
        fs.readFileSync(path.join(config_root_dir.flax, 'config/config.yaml'), 'utf8'),
      ),
      goji: yaml.load(
        fs.readFileSync(path.join(config_root_dir.goji, 'config/config.yaml'), 'utf8'),
      )
    };

    self_hostname = {
      chia: lodash.get(config.chia, 'ui.daemon_host', 'localhost'),
      flax: lodash.get(config.flax, 'ui.daemon_host', 'localhost'),
      goji: lodash.get(config.goji, 'ui.daemon_host', 'localhost')
    }; // jshint ignore:line
    const daemon_port = {
      chia: lodash.get(config.chia, 'ui.daemon_port', 55400),
      flax: lodash.get(config.flax, 'ui.daemon_port', 56600),
      goji: lodash.get(config.goji, 'ui.daemon_port', 57500)
    }; // jshint ignore:line

    // store these in the global object so they can be used by both main and renderer processes
    global.daemon_rpc_ws.chia = `wss://${self_hostname.chia}:${daemon_port.chia}`;
    global.daemon_rpc_ws.flax = `wss://${self_hostname.flax}:${daemon_port.flax}`;
    global.daemon_rpc_ws.goji = `wss://${self_hostname.goji}:${daemon_port.goji}`;
    global.cert_path = {
      chia: path.join(
        config_root_dir.chia,
        lodash.get(
          config.chia,
          'ui.daemon_ssl.private_crt',
          'config/ssl/daemon/private_daemon.crt',
        ),
      ),
      flax: path.join(
        config_root_dir.flax,
        lodash.get(
          config.flax,
          'ui.daemon_ssl.private_crt',
          'config/ssl/daemon/private_daemon.crt',
        ),
      ),
      goji: path.join(
        config_root_dir.goji,
        lodash.get(
          config.goji,
          'ui.daemon_ssl.private_crt',
          'config/ssl/daemon/private_daemon.crt',
        ),
      ),
    }; // jshint ignore:line
    global.key_path = {
      chia: path.join(
        config_root_dir.chia,
        lodash.get(
          config.chia,
          'ui.daemon_ssl.private_key',
          'config/ssl/daemon/private_daemon.key',
        ),
      ),
      flax: path.join(
        config_root_dir.flax,
        lodash.get(
          config.flax,
          'ui.daemon_ssl.private_key',
          'config/ssl/daemon/private_daemon.key',
        ),
      ),
      goji: path.join(
        config_root_dir.goji,
        lodash.get(
          config.goji,
          'ui.daemon_ssl.private_key',
          'config/ssl/daemon/private_daemon.key',
        ),
      ),
    }; // jshint ignore:line
  } catch (e) {
    console.log('Error loading config - using defaults');
  }
}

function manageDaemonLifetime() {
  // only start/stop daemon if it is running locally
  return self_hostname.chia === 'localhost';
}

module.exports = {
  loadConfig,
  manageDaemonLifetime,
  self_hostname,
};
