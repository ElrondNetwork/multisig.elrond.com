import { useRef, useState, useEffect } from "react";
import { useContext as useDappContext } from "@elrondnetwork/dapp";
import { TransactionHash } from "@elrondnetwork/erdjs/out";
import cloneDeep from "lodash/cloneDeep";
import { useDispatch, useSelector } from "react-redux";
import getPlainTransactionStatus from "helpers/plainObjects";
import { transactionToastsSelector } from "redux/selectors/toastSelector";
import { setTransactionToasts } from "redux/slices/toastsSlice";
import {
  TransactionToastTransactionsType,
  TransactionToastType,
} from "types/toasts";

interface TransactionToastStatusUpdatePropsType {
  transactions: TransactionToastTransactionsType[];
  pending: boolean;
  toastSignSession: string;
}

interface RefetchHashesType {
  hash: string;
  retries: number;
}

export default function TransactionToastStatusUpdate({
  transactions,
  pending,
  toastSignSession,
}: TransactionToastStatusUpdatePropsType) {
  const intervalRef = useRef<any>(null);
  const isFetchingStatusRef = useRef(false);
  const dispatch = useDispatch();
  const transactionToasts = useSelector(transactionToastsSelector);
  const [refetchHashes, setRefetchHashes] = useState<RefetchHashesType[]>([]);
  const {
    dapp: { apiProvider },
  } = useDappContext();

  const updateToasts = (updatedToast: TransactionToastType) => {
    if (updatedToast == null) {
      return;
    }
    const newToasts = transactionToasts.map((toast) => {
      if (toast.toastSignSession === toastSignSession) {
        for (const hash of Object.keys(updatedToast.transactions)) {
          if (updatedToast.transactions[hash].isPending) {
            updatedToast.transactions[hash] = toast.transactions[hash];
          }
        }
        return updatedToast;
      }
      return toast;
    });

    dispatch(setTransactionToasts(newToasts));
    isFetchingStatusRef.current = false;
  };

  const checkTransactionStatus = async () => {
    if (transactions == null) {
      return;
    }
    const activeToast = cloneDeep(
      transactionToasts.find(
        (toast) => toast.toastSignSession === toastSignSession,
      ),
    );
    if (activeToast == null) {
      return;
    }
    isFetchingStatusRef.current = true;
    for (const { hash } of transactions) {
      const txOnNetwork = await apiProvider.getTransaction(
        new TransactionHash(hash),
      );
      if (txOnNetwork != null) {
        if (!txOnNetwork.status.isPending()) {
          activeToast.transactions[hash] = getPlainTransactionStatus(
            txOnNetwork.status,
          );

          if (txOnNetwork.status.isFailed()) {
            const scResults = txOnNetwork
              .getSmartContractResults()
              .getAllResults();
            const resultWithError = scResults.find(
              (scResult) => scResult.getReturnMessage() !== "",
            );

            activeToast.errorMessage =
              resultWithError?.getReturnMessage() ?? "";
          }
        } else {
          setRefetchHashes((existing) => {
            return [
              ...existing.filter((t) => t.hash !== hash),
              {
                hash,
                retries: 0,
              },
            ];
          });
        }
      } else {
        if (activeToast?.transactions != null) {
          setRefetchHashes((existing) => {
            return [
              ...existing.filter((t) => t.hash !== hash),
              {
                hash,
                retries: 0,
              },
            ];
          });
        }
      }
      updateToasts(activeToast);
    }
  };

  useEffect(() => {
    if (pending) {
      intervalRef.current = setInterval(() => {
        checkTransactionStatus();
      }, 500);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => {
      clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending]);
  return null;
}