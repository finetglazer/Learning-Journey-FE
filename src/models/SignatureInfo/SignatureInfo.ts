import { Model } from "react-3layer-common";

export class SigningInfo extends Model {
  public signTypeId?: number;

  public digitalSignTokenExisted?: boolean;
}

export class SignatureInfo extends Model {
  public id?: number;

  public fileId?: number;

  public requestId?: number;

  public username?: string;

  public password?: string;

  public credentialId?: string;
}
export class CredentialModel extends Model {
  public credentialId?: string;

  public status?: string;

  public serialNumber?: string;

  public subjectDN?: string;

  public issuerDN?: string;

  public certificates?: string[];

  public validFrom?: string;

  public validTo?: string;
}
export class SignedForm extends Model {
  public id?: number;
  public name?: string;
  public extension?: string;
  public size?: number;
  public url?: string;
  public appUserId?: string;
}
