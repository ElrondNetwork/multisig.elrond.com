import { BigUIntValue, Address } from "@elrondnetwork/erdjs";
import { BytesValue } from "@elrondnetwork/erdjs/out/smartcontracts/typesystem";
import i18next from "i18next";
import denominate from "../components/Denominate/denominate";
import { denomination } from "../config";
import { MultisigAction } from "./MultisigAction";
import { MultisigActionType } from "./MultisigActionType";

export class MultisigDeployContractFromSource extends MultisigAction {
  amount: BigUIntValue;
  source: Address;
  upgradeable: boolean;
  payable: boolean;
  readable: boolean;
  args: BytesValue;

  constructor(
    amount: BigUIntValue,
    source: Address,
    upgradeable = false,
    payable = false,
    readable = false,
    args = BytesValue.fromUTF8(""),
  ) {
    super(MultisigActionType.SCDeployFromSource);
    this.amount = amount;
    this.source = source;
    this.upgradeable = upgradeable;
    this.payable = payable;
    this.readable = readable;
    this.args = args;
  }

  title() {
    return i18next.t("Deploy Contract from source");
  }

  getData() {
    const args = this.args.valueOf().toString();
    return `Deploy from ${this.source.bech32()}  ${
      args.length > 0 ? "/ arguments: " + args : ""
    }`;
  }

  description() {
    const denominatedAmount = denominate({
      input: this.amount.valueOf().toString(),
      denomination: denomination,
      decimals: 4,
      showLastNonZeroDecimal: true,
    });
    return `${i18next.t("Amount")}: ${denominatedAmount}`;
  }
  tooltip(): string {
    return ` upgradeable: ${this.upgradeable}
 payable: ${this.payable} 
 readable: ${this.readable} 
    `;
  }
}
