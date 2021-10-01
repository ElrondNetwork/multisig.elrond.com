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

export const proposeModalSelector = createDeepEqualSelector(
  modalsSliceSelector,
  (state) => state.proposeModal,
);

export const proposeModalSelectedOptionSelector = createDeepEqualSelector(
  proposeModalSelector,
  (state) => state.selectedOption,
);

export const performActionModalSelector = createDeepEqualSelector(
  modalsSliceSelector,
  (state) => state.performActionModal,
);

export const selectedPerformedActionId = createDeepEqualSelector(
  performActionModalSelector,
  (state) => state.selectedActionId,
);
