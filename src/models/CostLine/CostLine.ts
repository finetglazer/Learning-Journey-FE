import { Model } from "react-3layer-common";
import { Enum, Field, ObjectList } from "react-3layer-decorators";

export enum BudgetPeriod {
  monthly = 0,
  quarterly = 1,
  semi_annually = 2,
  annually = 3,
}

export enum BudgetCalculationMethod {
  cumulative = 1,
  periodic = 2,
}

export class CostLine extends Model {
  @Field(String)
  public id?: string;

  @Field(String)
  public code?: string;

  @Field(String)
  public name?: string;

  @Field(String)
  public parentId?: string;

  @Field(String)
  public parentName?: string;

  @Enum(BudgetPeriod)
  public budgetPeriod?: BudgetPeriod;

  @Enum(BudgetCalculationMethod)
  public budgetCalculationMethod?: BudgetCalculationMethod;

  @Field(String)
  public defaultCostDriver?: string;

  @Field(Boolean)
  public isTransfer?: boolean;

  @Field(Boolean)
  public isBudgetOverruns?: boolean;

  @Field(Boolean)
  public isActive?: boolean;

  @Field(Boolean)
  public isUsed?: boolean;
}

export class CostLineList extends Model {
  @ObjectList(CostLine)
  public items?: CostLine[] = [];

  @Field(Number)
  public pageIndex?: number;

  @Field(Number)
  public totalRecords?: number;
}

export class CostLineParent extends Model {
  @Field(String)
  public id: string;

  @Field(String)
  public name: string;

  @Field(String)
  public key: string;
}
