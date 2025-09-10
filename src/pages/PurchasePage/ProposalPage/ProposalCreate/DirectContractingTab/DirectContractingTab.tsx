import { ProposalCreateModel } from "models/Proposal";
import { useContext } from "react";
import { ProposalCreateHookContext } from "../ProposalCreateHook";
import DirectContractingTabDetail from "./DirectContractingTabDetail/DirectContractingTabDetail";
import DirectContractingDetail from "../../ProposalDetail/Components/DirectContractingDetail/DirectContractingDetail";

export enum EDirectContractingField {
  APPOINTMENT_METHOD = "contractorAppointment.appointmentMethod",
  NAME = "contractorAppointment.name",
  EXECUTION_TIME = "contractorAppointment.executionTime",
  APPOINTMENT_REASON = "contractorAppointment.appointmentReason",
  SUPPLIER = "contractorAppointment.supplier",
  CONTRACT_VALUE = "contractorAppointment.contractValue",
  CONTRACT_VALUE_TYPE = "contractorAppointment.contractValueType",
  TAX_PAYER = "contractorAppointment.taxPayer",
  CONTRACT_TYPE = "contractorAppointment.contractType",
  PAYMENT_TERMS = "contractorAppointment.paymentTerms",
  GUARANTEE_CONTENT = "contractorAppointment.guaranteeContent",
  WARRANTY_CONTENT = "contractorAppointment.warrantyContent",
  PURCHASE_PROPOSAL_ID = "contractorAppointment.purchaseProposalId",
}

const DirectContractingTab = () => {
  const { model } = useContext<ProposalCreateModel>(ProposalCreateHookContext);

  if (model.isDetail) {
    return <DirectContractingDetail />;
  }
  return <DirectContractingTabDetail />;
};

export default DirectContractingTab;
