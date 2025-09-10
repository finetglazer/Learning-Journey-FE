import { WorkflowDefinition } from "models/WorkflowDefinition";
import { Model } from "react-3layer-common";

export class RequestFormConfigurationContent extends Model {
  public id?: number;

  public RequestFormConfigurationId?: number;

  public workflowDefinitionId?: number;

  public workflowStateId?: number;

  public signatureDisplayType?: number = 1;

  public xCoordinate?: number;

  public yCoordinate?: number;

  public page?: number;

  public height?: number;

  public width?: number;

  public text?: string;

  public signatureType?: number;

  public workflowDefinition?: WorkflowDefinition;

  public orderIndex?: number;
}
