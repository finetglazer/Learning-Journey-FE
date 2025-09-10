import { Model } from "react-3layer-common";

export class SignedFormTypeRequirement extends Model {
  public id?: string;

  public name?: string;

  public code?: string;

  public personalSignatureRequirement?: number;

  public legalEntitySignatureRequirement?: number;
}
