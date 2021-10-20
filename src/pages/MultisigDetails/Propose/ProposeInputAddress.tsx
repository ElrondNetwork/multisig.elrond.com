import React, { useState } from "react";
import { Address } from "@elrondnetwork/erdjs";
import { useTranslation } from "react-i18next";

interface ProposeInputAddressType {
  handleParamsChange: (params: Address) => void;
}

const ProposeInputAddress = ({
  handleParamsChange,
}: ProposeInputAddressType) => {
  const [address, setAddress] = useState("");
  const [error, setError] = useState(false);
  const { t } = useTranslation();

  const handleAddressChanged = (event: any) => {
    try {
      const newAddress = String(event.target.value);
      const parsedValue = new Address(newAddress);
      setError(false);
      setAddress(newAddress);
      handleParamsChange(parsedValue);
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className="modal-control-container">
      <label>{t("Address")} </label>
      <input
        type="text"
        className="form-control"
        value={address}
        autoComplete="off"
        onChange={handleAddressChanged}
      />
      {error && <p className="text-danger">{t("Invalid address")}</p>}
    </div>
  );
};

export default ProposeInputAddress;
