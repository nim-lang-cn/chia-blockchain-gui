import React from 'react';
import styled from 'styled-components';
import { Trans } from '@lingui/macro';
import { useDispatch,useSelector } from 'react-redux';
import { List } from '@material-ui/core';
import {
  Wallet as WalletIcon,
  Farm as FarmIcon,
  Keys as KeysIcon,
  Home as HomeIcon,
  Plot as PlotIcon,
  Pool as PoolIcon,
} from '@chia/icons';
import { Flex, SideBarItem } from '@chia/core';
import { logOut } from '../../modules/message';
import WalletType from 'constants/WalletType';
import {
  changeWalletMenu,
  standardWallet
} from '../../modules/walletMenu';

const StyledRoot = styled(Flex)`
  height: 100%;
  overflow-y: auto;
`;

const StyledList = styled(List)`
  width: 100%;
`;

export default function DashboardSideBar() {
  const dispatch = useDispatch();

  function handleLogOut() {
    dispatch(logOut('log_out', {}));
  }

  return (
    <StyledRoot>
      <StyledList disablePadding>
        {/* <SideBarItem
          to="/dashboard"
          icon={<HomeIcon fontSize="large" />}
          title={<Trans>Full Node</Trans>}
          exact
        /> */}
        <SideBarItem
          to="/dashboard/"
          icon={<WalletIcon fontSize="large" />}
          title={<Trans>Chia Wallets</Trans>}
          exact
          onSelect={()=>dispatch(changeWalletMenu(standardWallet,1,"Chia Wallet"))}
        />
         <SideBarItem
          to="/dashboard/wallets/flax"
          icon={<WalletIcon fontSize="large" />}
          title={<Trans>Flax Wallets</Trans>}
          exact
          onSelect={()=>dispatch(changeWalletMenu(standardWallet,1,"flax"))}
        />
         <SideBarItem
          to="/dashboard/wallets/goji"
          icon={<WalletIcon fontSize="large" />}
          title={<Trans>Goji Wallets</Trans>}
          exact
          onSelect={()=>dispatch(changeWalletMenu(standardWallet,1,"goji"))}
        />
        <SideBarItem
          to="/dashboard/plot"
          icon={<PlotIcon fontSize="large" />}
          title={<Trans>Plots</Trans>}
        />
        <SideBarItem
          to="/dashboard/farm"
          icon={<FarmIcon fontSize="large" />}
          title={<Trans>Farm</Trans>}
        />
        <SideBarItem
          to="/dashboard/pool"
          icon={<PoolIcon fontSize="large" />}
          title={<Trans>Pool</Trans>}
        />
        <SideBarItem
          to="/"
          icon={<KeysIcon fontSize="large" />}
          onSelect={handleLogOut}
          title={<Trans>Keys</Trans>}
          exact
        />
      </StyledList>
    </StyledRoot>
  );
}
