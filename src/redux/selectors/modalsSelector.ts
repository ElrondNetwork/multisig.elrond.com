import { RootState } from "../store";
import { createDeepEqualSelector } from "./helpers";

export const modalsSliceSelector = (state: RootState) => state.modals;

export const txSubmittedModalSelector = createDeepEqualSelector(
  modalsSliceSelector,
  (state) => state.txSubmittedModal,
);

export const notificationModalSelector = createDeepEqualSelector(
  modalsSliceSelector,
  (state) => state.notificationModal,
);

export const proposeModal = createDeepEqualSelector(
  modalsSliceSelector,
  (state) => state.proposeModal,
);

export const proposeModalSelectedOptionSelector = createDeepEqualSelector(
  modalsSliceSelector,
  (state) => state.proposeModal.selectedOption,
);
