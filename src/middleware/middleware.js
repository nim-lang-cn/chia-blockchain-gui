import isElectron from 'is-electron';
import * as actions from '../modules/websocket';
import {
  registerService,
  startService,
  startServiceTest,
} from '../modules/daemon_messages';
import { handle_message } from './middleware_api';
import {
  service_plotter,
  service_wallet,
  service_full_node,
  service_simulator,
  service_farmer,
  service_harvester,
} from '../util/service_names';
import config from '../config/config';

const crypto = require('crypto');

const callback_map = {};
if (isElectron()) {
  var { remote } = window.require('electron');
  var fs = remote.require('fs');
  var WS = window.require('ws');
}

const outgoing_message = (command, data, destination) => ({
  command,
  data,
  ack: false,
  origin: 'wallet_ui',
  destination,
  request_id: crypto.randomBytes(32).toString('hex'),
});

const socketMiddleware = () => {
  let socket = { chia: null, flax: null, goji: null };
  let connected = false;

  var chia = "chia";
  var flax = "flax";
  var goji = "goji";
  const onOpen = (store, wsConnectInterval) => (event) => {
    clearInterval(wsConnectInterval);
    connected = true;
    store.dispatch(actions.wsConnected(event.target.url));
    store.dispatch(registerService('wallet_ui', chia));
    store.dispatch(registerService(service_plotter, chia));
    if (config.local_test) {
      store.dispatch(startServiceTest(service_wallet, chia));
      store.dispatch(startService(service_simulator, chia));
    } else {
      store.dispatch(startService(service_wallet, chia));
      store.dispatch(startService(service_full_node, chia));
      store.dispatch(startService(service_farmer, chia));
      store.dispatch(startService(service_harvester, chia));
    }

  };

  const onClose = (store) => () => {
    connected = false;
    store.dispatch(actions.wsDisconnected());
  };

  const onMessage = (store) => (event) => {
    const payload = JSON.parse(event.data);
    const { request_id } = payload;
    const action = callback_map[request_id];
    if (action) {
      delete callback_map[request_id];
      const { resolve, reject } = action;
      resolve(payload);
    }
    handle_message(store, payload, action?.usePromiseReject);
  };

  return (store) => (next) => (action) => {
    switch (action.type) {
      case 'WS_CONNECT':
        const wsConnectInterval = setInterval(() => {
          if (
            socket.chia !== null &&
            (socket.chia.readyState == 0 || socket.chia.readyState == 1)
          ) {
            console.log('Already connected, not reconnecting.');
            return;
          }

          try {
            const key_path = remote.getGlobal('key_path').chia;
            const cert_path = remote.getGlobal('cert_path').chia;

            const options = {
              cert: fs.readFileSync(cert_path),
              key: fs.readFileSync(key_path),
              rejectUnauthorized: false,
              perMessageDeflate: false,
            };
            socket.chia = new WS(action.host.chia, options);

          } catch {
            connected = false;
            store.dispatch(actions.wsDisconnected(action.host.chia));

            console.log('Failed connection to', action.host.chia);
            return;
          }

          // websocket handlers
          socket.chia.onmessage = onMessage(store);
          socket.chia.onclose = onClose(store);
          socket.chia.addEventListener('open', onOpen(store, wsConnectInterval));
        }, 1000);

        const flaxwsConnectInterval = setInterval(() => {
          if (
            socket.flax !== null &&
            (socket.flax.readyState == 0 || socket.flax.readyState == 1)
          ) {
            console.log('Already connected, not reconnecting.');
            return;
          }
          try {
            const key_path = remote.getGlobal('key_path').flax;
            const cert_path = remote.getGlobal('cert_path').flax;
            console.log(key_path);
            console.log(cert_path);
            console.log(action.host.flax);
            socket.flax = new WS(action.host.flax, {
              cert: fs.readFileSync(cert_path),
              key: fs.readFileSync(key_path),
              rejectUnauthorized: false,
              perMessageDeflate: false,
            });

          } catch {
            connected = false;
            store.dispatch(actions.wsDisconnected(action.host.flax));
            console.log('Failed connection to', action.host.flax);
            return;
          }
          socket.flax.onmessage = onMessage(store);
          socket.flax.onclose = onClose(store);
          socket.flax.addEventListener('open', onOpen(store, flaxwsConnectInterval));
        }, 1000);

        const gojiwsConnectInterval = setInterval(() => {
          if (
            socket.goji !== null &&
            (socket.goji.readyState == 0 || socket.goji.readyState == 1)
          ) {
            console.log('Already connected, not reconnecting.');
            return;
          }
          try {
            const key_path = remote.getGlobal('key_path').goji;
            const cert_path = remote.getGlobal('cert_path').goji;

            console.log(key_path);
            console.log(cert_path);
            console.log(action.host.goji);

            socket.goji = new WS(action.host.goji, {
              cert: fs.readFileSync(cert_path),
              key: fs.readFileSync(key_path),
              rejectUnauthorized: false,
              perMessageDeflate: false,
            });

          } catch {
            connected = false;
            store.dispatch(actions.wsDisconnected(action.host.goji));
            console.log('Failed connection to', action.host.goji);
            return;
          }
          socket.goji.onmessage = onMessage(store);
          socket.goji.onclose = onClose(store);
          socket.goji.addEventListener('open', onOpen(store, gojiwsConnectInterval));
        }, 1000);

        break;
      case 'WS_DISCONNECT':
        if (socket.chia !== null) {
          socket.id.close();
          socket.id = null;
        }
        socket = null;
        if (socket.flax !== null) {
          socket.flax.close();
          socket.flax = null;

        }
        if (socket.goji !== null) {
          socket.goji.close();
          socket.goji = null;
        }
        break;
      case 'OUTGOING_MESSAGE':
        if (connected) {
          const message = outgoing_message(
            action.message.command,
            action.message.data,
            action.message.destination,
          );
          if (action.resolve) {
            callback_map[message.request_id] = action;
          }
          if (message.hasOwnProperty("data") && message.data != undefined && message.data.hasOwnProperty("wallet_name")) {
            if (message.data["wallet_name"] == "flax") {
              socket.flax.send(JSON.stringify(message));
            } else if (message.data["wallet_name"] == "goji") {
              socket.goji.send(JSON.stringify(message));
            } else {
              socket.chia.send(JSON.stringify(message));
            }
          } else {
            console.log("missing:",message);
            socket.chia.send(JSON.stringify(message));

          }

        } else {
          console.log('Socket not connected');
        }
        return next(action);
      default:
        return next(action);
    }
  };
};

export default socketMiddleware();
