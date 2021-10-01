import React, { useContext } from "react";
import { operations } from "@elrondnetwork/dapp-utils";
import { Address } from "@elrondnetwork/erdjs/out";
import { useFormik } from "formik";
import { Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { TestContext } from "yup";
import {
  chainID,
  gasPerDataByte,
  gasPrice,
  gasPriceModifier,
  gasLimit,
  maxGasLimit,
} from "config";
import MultisigDetailsContext from "context/MultisigDetailsContext";
import { priceSelector } from "redux/selectors/economicsSelector";

const SendModal = () => {
  const [showModal, setShowModal] = React.useState(false);
  const { multisigBalance } = useContext(MultisigDetailsContext);
  const egldPrice = useSelector(priceSelector);
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const validationSchema = Yup.object().shape({
    recipient: Yup.string()
      .min(2, "Too Short!")
      .max(500, "Too Long!")
      .required("Required")
      .test(validateRecipient),
    amount: Yup.number()
      .min(-1, "Too Short!")
      .required("Required")
      .test(validateAccount),
    gasLimit: Yup.string().required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      recipient: "",
      amount: 0,
      gasPrice: gasPrice,
      gasLimit: gasLimit,
      data: "",
    },
    validationSchema,
    validateOnChange: true,
    onSubmit: handleSubmit,
  });
  const fee = operations.calculateFeeLimit({
    minGasLimit: String(gasLimit),
    gasPerDataByte: gasPerDataByte,
    gasPriceModifier: gasPriceModifier,
    gasLimit: String(formik.values.gasLimit),
    gasPrice: String(gasPrice),
    data: formik.values.data,
    chainId: chainID,
  });

  const denominatedFee = operations.denominate({
    input: fee,
    denomination: 18,
    decimals: 4,
    showLastNonZeroDecimal: true,
  });

  async function handleSubmit(values: any) {
    return null;
  }

  function validateRecipient(value?: string) {
    try {
      new Address(value);
      return true;
    } catch (err) {
      return false;
    }
  }

  function validateAccount(value?: number, testContext?: TestContext) {
    if (value == null) {
      return true;
    }
    const transactionCost = Number(denominatedFee) + Number(value);
    if (transactionCost > Number(multisigBalance.toDenominated())) {
      return (
        testContext?.createError({
          message:
            "There are not enough money in the organization for this transaction",
        }) ?? false
      );
    }
    return true;
  }

  const feeToUsdValue = Number(fee) * egldPrice;

  const denominatedFeeToUsdValue = operations.denominate({
    input: String(feeToUsdValue),
    denomination: 18,
    decimals: 4,
    showLastNonZeroDecimal: true,
  });
  const denominatedGasPrice = operations.denominate({
    input: String(gasPrice),
    denomination: 18,
    decimals: 4,
    showLastNonZeroDecimal: true,
  });
  function onGasLimitChange(e: any) {
    const newAmount = Number(e.target.value);
    if (newAmount > maxGasLimit) {
      console.log("triggered");
      formik.setFieldError(
        "gasLimit",
        `Gas limit must be lower or equal to ${maxGasLimit}`,
      );
      return;
    }
    if (newAmount < gasLimit) {
      console.log("triggered");
      formik.setFieldError(
        "gasLimit",
        `Gas limit must be greater or equal to ${gasLimit}`,
      );
      return;
    }
    formik.handleChange(e);
  }

  const { touched, errors } = formik;

  const recipientError = touched.recipient && errors.recipient;
  const amountError = touched.amount && errors.amount;
  const gasLimitError = touched.gasLimit && errors.gasLimit;

  const feeContent = (
    <div className={"d-flex mt-2 flex-column align-items-start"}>
      <span>{`Fee ${denominatedFee} EGLD`}</span>
      <span>{`~$${denominatedFeeToUsdValue}`}</span>
      <div className={"d-flex flex-column align-items-start"}>
        <div className={"d-flex flex-grow-1 flex-row my-2 align-items-stretch"}>
          <label className={"align-self-start"} htmlFor="gasPrice">
            Gas Price
          </label>
          <Form.Control
            id="gasPrice"
            name="gasPrice"
            type="text"
            readOnly
            style={{ pointerEvents: "none" }}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={denominatedGasPrice}
          />
        </div>
        <div className={"d-flex flex-grow-1 flex-row my-2 align-items-stretch"}>
          <label className={"align-self-start"} htmlFor="gasLimit">
            Gas Limit
          </label>
          <Form.Control
            id="gasLimit"
            name="gasLimit"
            type="number"
            isInvalid={gasLimitError != null}
            onChange={onGasLimitChange}
            onBlur={formik.handleBlur}
            value={formik.values.gasLimit}
          />
          {gasLimitError != null && (
            <Form.Control.Feedback type={"invalid"}>
              {gasLimitError}
            </Form.Control.Feedback>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button onClick={handleOpenModal} className="btn btn-primary mb-3">
        Send
      </button>
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        className="modal-container"
        animation={false}
        centered
      >
        <div className="card">
          <div className="card-body p-spacer text-center">
            <p className="h6 mb-spacer" data-testid="delegateTitle">
              Send
            </p>
            <p className="h6 mb-spacer" data-testid="delegateSubTitle">
              Enter amount and recipient address
            </p>
            <Form
              className={"d-flex flex-column my-3"}
              onSubmit={formik.handleSubmit}
            >
              <div
                className={
                  "d-flex flex-grow-1 flex-column my-2 align-items-stretch"
                }
              >
                <label className={"align-self-start"} htmlFor="recipient">
                  To
                </label>
                <Form.Control
                  id="recipient"
                  name="recipient"
                  type="text"
                  isInvalid={recipientError != null}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.recipient}
                />
                {recipientError != null && (
                  <Form.Control.Feedback type={"invalid"}>
                    {recipientError}
                  </Form.Control.Feedback>
                )}
              </div>
              <div
                className={
                  "d-flex flex-grow-1 flex-column my-2 align-items-stretch"
                }
              >
                <label className={"align-self-start"} htmlFor="amount">
                  Amount (EGLD)
                </label>
                <Form.Control
                  id="amount"
                  name="amount"
                  type="number"
                  isInvalid={amountError != null}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.amount}
                />
                {amountError != null && (
                  <Form.Control.Feedback type={"invalid"}>
                    {amountError}
                  </Form.Control.Feedback>
                )}
              </div>
              {feeContent}
              <div
                className={
                  "d-flex flex-grow-1 flex-column my-2 align-items-stretch"
                }
              >
                <label className={"align-self-start"} htmlFor="data">
                  Data
                </label>
                <Form.Control
                  id="data"
                  name="data"
                  type="data"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.data}
                />
              </div>
            </Form>
            <div>
              <button
                onClick={formik.handleSubmit as any}
                className="btn btn-primary mx-3 mb-3"
              >
                Send
              </button>
              <button
                onClick={handleCloseModal}
                className="btn btn-outline-secondary mb-3"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SendModal;
