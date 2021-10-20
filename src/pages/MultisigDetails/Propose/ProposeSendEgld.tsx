import React, { useState } from "react";
import { Address, Balance } from "@elrondnetwork/erdjs/out";
import { BigUIntValue } from "@elrondnetwork/erdjs/out/smartcontracts/typesystem";
import { useTranslation } from "react-i18next";
import { MultisigSendEgld } from "types/MultisigSendEgld";

interface ProposeSendEgldType {
  handleChange: (proposal: MultisigSendEgld) => void;
}

const ProposeSendEgld = ({ handleChange }: ProposeSendEgldType) => {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [data, setData] = useState("");
  const { t } = useTranslation();

  const getProposal = (): MultisigSendEgld | null => {
    const addressParam = new Address(address);

    const amountNumeric = Number(amount);
    if (isNaN(amountNumeric)) {
      return null;
    }

    const amountParam = new BigUIntValue(Balance.egld(amountNumeric).valueOf());

    return new MultisigSendEgld(addressParam, amountParam, data);
  };

  const refreshProposal = () => {
    const proposal = getProposal();
    if (proposal !== null) {
      handleChange(proposal);
    }
  };

  const onAddressChanged = (event: any) => {
    setAddress(event.target.value);
  };

  const onAmountChanged = (event: any) => {
    setAmount(event.target.value);
  };

  const onDataChanged = (event: any) => {
    setData(event.target.value);
  };

  React.useEffect(() => {
    refreshProposal();
  }, [address, amount, data]);

  return (
    <div>
      <div className="modal-control-container">
        <label>{t("Send to")} </label>
        <input
          type="text"
          className="form-control"
          value={address}
          autoComplete="off"
          onChange={onAddressChanged}
        />
      </div>
      <div className="modal-control-container">
        <label>{t("Amount")} </label>
        <div className="input-wrraper">
          <input
            type="text"
            className="form-control"
            value={amount}
            autoComplete="off"
            onChange={onAmountChanged}
          />
          <span>Max</span>
        </div>
        <span>Balance: 14.5454 EGLD </span>
      </div>
      <div className="modal-control-container">
        <label>{t("Data")} </label>
        <textarea
          className="form-control"
          value={data}
          autoComplete="off"
          onChange={onDataChanged}
        />
      </div>
    </div>
  );
};

export default ProposeSendEgld;
