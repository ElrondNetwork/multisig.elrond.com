import { MultisigActionType } from './MultisigActionType';

export abstract class MultisigAction {
  type: MultisigActionType = MultisigActionType.Nothing;
  data?: string;

  constructor(type: MultisigActionType) {
    this.type = type;
  }

  getData(): any {
    return null;
  }

  getIdentifier(): string | null {
    return null;
  }

  abstract title(): any;
  abstract description(): any;
  abstract tooltip(): any;
}
