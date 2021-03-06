import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MultisigActionType } from 'types/MultisigActionType';
import { SelectedOptionType } from 'types/Proposals';
import { logoutAction } from '../commonActions';

interface TxSubmittedModal {
  sessionId: string;
  submittedMessage: string;
}

interface NotificationModal {
  icon: typeof faInfoCircle;
  iconClassName: string;
  title: string;
  description: string;
}

export interface SelectedActionToPerform {
  id: number;
  actionType?: MultisigActionType;
}
interface PerformActionModal {
  selectedAction: SelectedActionToPerform | null;
}

interface ProposeModal {
  selectedOption?: SelectedOptionType;
}

interface ProposeMultiselectModal {
  selectedOption?: SelectedOptionType;
}

export interface ModalsSliceState {
  txSubmittedModal?: TxSubmittedModal;
  notificationModal?: NotificationModal;
  proposeModal: ProposeModal;
  proposeMultiselectModal: ProposeMultiselectModal;
  performActionModal: PerformActionModal;
}

const initialState: ModalsSliceState = {
  proposeModal: {
    selectedOption: null
  },
  proposeMultiselectModal: {
    selectedOption: null
  },
  performActionModal: {
    selectedAction: null
  }
};

export const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    setTxSubmittedModal: (
      state: ModalsSliceState,
      action: PayloadAction<TxSubmittedModal>
    ) => {
      state.txSubmittedModal = action.payload;
    },
    setNotificationModal: (
      state: ModalsSliceState,
      action: PayloadAction<NotificationModal>
    ) => {
      state.notificationModal = action.payload;
    },
    clearTxSubmittedModal: (state: ModalsSliceState) => {
      state.txSubmittedModal = undefined;
    },
    clearNotificationModal: (state: ModalsSliceState) => {
      state.notificationModal = undefined;
    },
    setProposeModalSelectedOption: (
      state: ModalsSliceState,
      action: PayloadAction<SelectedOptionType | null>
    ) => {
      state.proposeModal.selectedOption = action.payload;
    },
    setProposeMultiselectSelectedOption: (
      state: ModalsSliceState,
      action: PayloadAction<SelectedOptionType | null>
    ) => {
      state.proposeMultiselectModal.selectedOption = action.payload;
    },
    setSelectedPerformedAction: (
      state: ModalsSliceState,
      action: PayloadAction<SelectedActionToPerform | null>
    ) => {
      state.performActionModal.selectedAction = action.payload;
    }
  },

  extraReducers: (builder) => {
    builder.addCase(logoutAction, () => {
      return initialState;
    });
  }
});

export const {
  setTxSubmittedModal,
  setNotificationModal,
  setProposeMultiselectSelectedOption,
  clearTxSubmittedModal,
  clearNotificationModal,
  setProposeModalSelectedOption,
  setSelectedPerformedAction
} = modalsSlice.actions;

export default modalsSlice.reducer;
