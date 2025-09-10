import { Model } from "react-3layer-common";

export class ReceivedGoodIntergration extends Model {
  idAsset?: string;
  nameAsset?: string;
  codeGoodServiceCode?: string;
  nameGoodServiceCode?: string;
  brandName?: string;
  personCharge?: string;
  serialNumber?: string;
  receivedDate?: string;
  originalPrice?: number;
}
