import WalletType from '../constants/WalletType';

export const standardWallet = 'STANDARD_WALLET';
export const createWallet = 'CREATE_WALLET';
export const CCWallet = 'CC_WALLET';
export const RLWallet = 'RL_WALLET';
export const DIDWallet = 'DID_WALLET';

export const changeWalletMenu = (item: unknown, id: number,name:string) => ({
  type: 'WALLET_MENU',
  item,
  id,
  name
});

type WalletMenuState = {
  view: WalletType;
  id: number;
  name: string;
};

const initialState: WalletMenuState = {
  view: WalletType.STANDARD_WALLET,
  id: 1,
  name: "Chia Wallet",
};

export default function walletMenuReducer(
  state = { ...initialState },
  action: any,
): WalletMenuState {
  switch (action.type) {
    case 'LOG_OUT':
      return { ...initialState };
    case 'WALLET_MENU':
      const { item, id ,name} = action;
      return {
        ...state,
        view: item,
        id,
        name
      };
    default:
      return state;
  }
}
