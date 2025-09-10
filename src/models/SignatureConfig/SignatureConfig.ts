import { AppUser } from "models/AppUser";
import { SignatureSupplier } from "models/SignatureSupplier";
import { Model } from "react-3layer-common";
import { Field } from "react-3layer-decorators";

export class SignatureConfig extends Model {
  @Field(String)
  public id?: string;

  @Field(String)
  public citizenIdentification?: string;

  @Field(Number)
  public signatureSupplierId?: number;

  public signatureSupplier?: SignatureSupplier;

  public userId?: number;

  public user?: AppUser;

  public isActive?: boolean = true;

  public isUsed?: boolean;
}
