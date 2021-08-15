import { service_farmer } from '../util/service_names';
import { async_api } from './message';

export const farmerMessage = (message) => ({
  type: 'OUTGOING_MESSAGE',
  message: {
    destination: service_farmer,
    ...message,
  },
});

export const getRewardTargets = (searchForPrivateKey,wallet_name="chia") => {
  return async (dispatch) => {
    const { data } = await async_api(
      dispatch,
      farmerMessage({
        command: 'get_reward_targets',
        data: {
          search_for_private_key: searchForPrivateKey,
          wallet_name
        },
      }),
      false,
    );

    return data;
  };
};

export const setRewardTargets = (farmerTarget, poolTarget,wallet_name="chia") => {
  return async (dispatch) => {
    const response = await async_api(
      dispatch,
      farmerMessage({
        command: 'set_reward_targets',
        data: {
          farmer_target: farmerTarget,
          pool_target: poolTarget,
          wallet_name,
        },
      }),
      false,
    );

    return response;
  };
};

export const pingFarmer = (wallet_name="chia") => {
  const action = farmerMessage();
  action.message.command = 'ping';
  action.message.data = {wallet_name};
  return action;
};

export const getLatestChallenges = (wallet_name="chia") => {
  const action = farmerMessage();
  action.message.command = 'get_signage_points';
  action.message.data = {wallet_name};
  return action;
};

export const getFarmerConnections = (wallet_name="chia") => {
  const action = farmerMessage();
  action.message.command = 'get_connections';
  action.message.data = {wallet_name};
  return action;
};

export const openConnection = (host, port,wallet_name="chia") => {
  const action = farmerMessage();
  action.message.command = 'open_connection';
  action.message.data = { host, port,wallet_name };
  return action;
};

export const closeConnection = (node_id,wallet_name="chia") => {
  const action = farmerMessage();
  action.message.command = 'close_connection';
  action.message.data = { node_id,wallet_name };
  return action;
};

export const getPoolState = (wallet_name="chia") => {
  return async (dispatch) => {
    const { data } = await async_api(
      dispatch,
      farmerMessage({
        command: 'get_pool_state',
        wallet_name
      }),
      false,
      true,
    );

    return data?.pool_state;
  };
};

export const setPayoutInstructions = (
  launcherId,
  payoutInstructions,
  wallet_name="chia"
) => {
  return async (dispatch) => {
    const { data } = await async_api(
      dispatch,
      farmerMessage({
        command: 'set_payout_instructions',
        data: {
          launcher_id: launcherId,
          payout_instructions: payoutInstructions,
          wallet_name
        },
      }),
      false,
    );

    /*
    console.log('data', data);
    /*
    const { success, error } = data;
    if (!success) {
      throw new Error(error);
    }
    */

    return data;
  };
};

export function getHarvesters(wallet_name="chia") {
  return async (dispatch) => {
    const { data } = await async_api(
      dispatch,
      farmerMessage({
        command: 'get_harvesters',
        wallet_name
      }),
      false,
    );

    return data;
  };
}

export function getPoolLoginLink(launcherId,wallet_name="chia") {
  return async (dispatch) => {
    const { data } = await async_api(
      dispatch,
      farmerMessage({
        command: 'get_pool_login_link',
        data: {
          launcher_id: launcherId,
          wallet_name,
        },
      }),
      false,
    );

    return data;
  };
}
