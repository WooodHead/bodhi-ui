import { observable, runInAction, action } from 'mobx';

import GlobalStore from './GlobalStore';
import UiStore from './UiStore';
import FavoriteStore from './FavoriteStore';
import RefreshingStore from './RefreshingStore';
import AllEventsStore from './AllEventsStore';
import QtumPredictionStore from './QtumPredictionStore';
import BotCourtStore from './BotCourtStore';
import ResultSettingStore from './activitiesStores/ResultSetting';
import FinalizeStore from './activitiesStores/Finalize';
import WithdrawStore from './activitiesStores/Withdraw';
import ActivityHistoryStore from './activitiesStores/ActivityHistoryStore';
import MyFavoriteStore from './activitiesStores/MyFavoriteStore';
import WalletStore from './wallet/WalletStore';
import GlobalSnackbarStore from './components/GlobalSnackbarStore';
import SelectAddressDialogStore from './components/SelectAddressDialogStore';
import WalletUnlockDialogStore from './components/WalletUnlockDialogStore';
import PendingTransactionsSnackbarStore from './components/PendingTransactionsSnackbarStore';
import OraclePageStore from './OracleDetailPageStore';
import CreateEventStore from '../scenes/CreateEvent/store';

class AppStore {
  @observable loading = true; // TODO: move these to GlobalStore
  @observable sortBy = 'ASC' // TODO: have each store have their own sortBy

  global = {}
  ui = {}
  wallet = {}
  allEvents = {}
  favorite = {}
  globalSnackbar = {}
  selectAddressDialog = {}
  walletUnlockDialog = {}
  pendingTxsSnackbar = {}

  constructor() {
    this.init();
  }

  @action
  async init() {
    this.loading = true;
    this.global = new GlobalStore(this);
    this.ui = new UiStore();
    this.wallet = new WalletStore(this);
    this.favorite = new FavoriteStore(this);
    this.globalSnackbar = new GlobalSnackbarStore();
    this.selectAddressDialog = new SelectAddressDialogStore();
    this.walletUnlockDialog = new WalletUnlockDialogStore(this);
    this.pendingTxsSnackbar = new PendingTransactionsSnackbarStore();
    this.refreshing = new RefreshingStore();
    this.oraclePage = new OraclePageStore(this);

    await this.global.getSyncInfo(); // Inits the wallet addresses
    runInAction(() => {
      // these store are designed for "components"
      this.allEvents = new AllEventsStore(this);
      this.qtumPrediction = new QtumPredictionStore(this);
      this.createEvent = new CreateEventStore(this);
      this.botCourt = new BotCourtStore(this);
      this.activities = {
        resultSetting: new ResultSettingStore(this),
        finalize: new FinalizeStore(this),
        withdraw: new WithdrawStore(this),
        history: new ActivityHistoryStore(this),
        myFavorite: new MyFavoriteStore(this),
      };
      this.loading = false; // finishing loading
    });
  }
}

const store = new AppStore();
if (process.env.REACT_APP_ENV === 'dev') {
  window.xstore = store;
}

export default store;
