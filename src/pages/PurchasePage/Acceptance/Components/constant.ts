export enum TabKey {
  CONTRACT = "contract",
  BUYER = "buyer",
  SELLER = "seller",
  RECEIVER = "receiver",
  DESCRIPTION = "description",
  RECEIPT = "receipt",
  GOOD_SERVICE = "good-service",
  DOCUMENTS = "documents",
  COMPONENTS = "components",
  CONCLUSION = "conclusion",
  REFERENCE = "reference",
  COMMENT = "comment",
  INTERGRATION = "intergration",
}

export type State = {
  mode?: "CLONE" | "VIEW" | "EDIT" | "CREATE";
};
