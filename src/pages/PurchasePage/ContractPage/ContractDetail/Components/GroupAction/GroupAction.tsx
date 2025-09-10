import ContractDetailDraftAction from "./DraftAction";
import ContractDetailWaitingForApproveAction from "./WaitingForApproveAction";
import ModalActionContract from "./ModalActionContract";
type GroupActionProps = {
  handleOpenSigningForm?: () => void;
};
const ContractDetailGroupAction = ({
  handleOpenSigningForm,
}: GroupActionProps) => {
  return (
    <div className="group-action">
      <ContractDetailDraftAction
        handleOpenSigningForm={handleOpenSigningForm}
      />
      <ContractDetailWaitingForApproveAction />
      <ModalActionContract />
    </div>
  );
};

export default ContractDetailGroupAction;
