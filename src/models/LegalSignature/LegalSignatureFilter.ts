import { ModelFilter } from "react-3layer-common";

export class LegalSignatureFilter extends ModelFilter {
  public tab?: string;
  public signatureStatuses?: number[];
  public code?: string;
  public name?: string;
  public requestType?: number;
  public organizationIds?: string[] = [];
  public createdUserIds?: string[] = [];
  public createdDateRange?: {
    from?: string;
    to?: string;
  };
}
