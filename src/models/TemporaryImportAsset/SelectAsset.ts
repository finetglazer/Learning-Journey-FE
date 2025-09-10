import { GoodsReceiptRequestItem } from "models/ReceivingGood/GoodsReceipt";
import { ModelFilter } from "react-3layer-common";
import { Field } from "react-3layer-decorators";

export class SelectAsset extends ModelFilter {
  @Field(String)
  public id?: string;

  @Field(String)
  public goodsReceiptRequestAssetId?: string;

  @Field(String)
  public amount?: number;

  @Field(String)
  public classify?: string;

  @Field(String)
  public depreciationMonths?: string;

  @Field(Object)
  public goodsReceiptRequestAsset?: GoodsReceiptRequestAsset;

  @Field(Array)
  public addedProjectIds?: string[];
}

export class GoodsReceiptRequestAsset {
  @Field(String)
  public id?: string;

  @Field(String)
  public assetId?: string;

  @Field(String)
  public serialNumber?: string;

  @Field(String)
  public owner?: string;

  @Field(String)
  public brand?: string;

  @Field(String)
  public price?: number;

  @Field(String)
  public receiveDate?: string;

  @Field(Object)
  public asset?: Asset;

  @Field(String)
  public goodsReceiptRequestItemId?: string;

  @Field(Object)
  public goodsReceiptRequestItem?: GoodsReceiptRequestItem;

  @Field(Object)
  public category?: Category;

  @Field(String)
  public usageStartDate?: string;

  public originNo: string;

  public quantity: number;
  public depreciationMonths: number;
}

export class Asset {
  @Field(String)
  public id?: string;

  @Field(String)
  public name?: string;

  @Field(String)
  public code?: string;
}

export class Category {
  @Field(String)
  public id?: string;

  @Field(String)
  public name?: string;

  @Field(String)
  public code?: string;
}
