import React from 'react';
import { Grid } from '@material-ui/core';
import FullNodeCardStatus from './FullNodeCardStatus';
import FullNodeCardConnectionStatus from './FullNodeCardConnectionStatus';
import FullNodeCardNetworkName from './FullNodeCardNetworkName';
import FullNodeCardPeakHeight from './FullNodeCardPeakHeight';
import FullNodeCardPeakTime from './FullNodeCardPeakTime';
import FullNodeCardDifficulty from './FullNodeCardDifficulty';
import FullNodeCardVDFSubSlotIterations from './FullNodeCardVDFSubSlotIterations';
import FullNodeCardTotalIterations from './FullNodeCardTotalIterations';
import FullNodeEstimatedNetworkSpace from './FullNodeEstimatedNetworkSpace';
import StandardWallet from '../../wallet/standard/WalletStandard';
import type  { RootState } from '../../../modules/rootReducer';
import { useDispatch, useSelector } from 'react-redux';


type Props = {
  wallet_id: number;
};

export default function FullNodeCards(props: Props) {
  const wallets = useSelector((state: RootState) => state.wallet_state.wallets);
  const id = useSelector((state: RootState) => state.wallet_menu.id);
  const name = useSelector((state: RootState) => state.wallet_menu.name);
  const wallet = wallets?.find((wallet) => wallet && wallet.id === id);
  return (
    <div>
      <Grid spacing={3} alignItems="stretch" container>
        <Grid xs={12} sm={6} md={4} item>
          <FullNodeCardStatus />
        </Grid>
        <Grid xs={12} sm={6} md={4} item>
          <FullNodeCardConnectionStatus />
        </Grid>
        <Grid xs={12} sm={6} md={4} item>
          <FullNodeCardNetworkName />
        </Grid>
        <Grid xs={12} sm={6} md={4} item>
          <FullNodeCardPeakHeight />
        </Grid>
        <Grid xs={12} sm={6} md={4} item>
          <FullNodeCardPeakTime />
        </Grid>
        <Grid xs={12} sm={6} md={4} item>
          <FullNodeCardDifficulty />
        </Grid>
        <Grid xs={12} sm={6} md={4} item>
          <FullNodeCardVDFSubSlotIterations />
        </Grid>
        <Grid xs={12} sm={6} md={4} item>
          <FullNodeCardTotalIterations />
        </Grid>
        <Grid xs={12} md={4} item>
          <FullNodeEstimatedNetworkSpace />
        </Grid>
        <Grid xs={12} md={12} item>
          <StandardWallet wallet_id={id} wallet_name={name}/>
        </Grid>
      </Grid>
    </div>
  );
}
