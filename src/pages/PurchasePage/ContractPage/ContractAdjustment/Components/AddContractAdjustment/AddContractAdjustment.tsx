import AddIcon from "assets/icons/add.svg";
import { t } from "i18next";
import { useContext } from "react";
import { Button } from "react-components-design-system";
import { ContractAdjustmentModal } from "../../constants";
import {
  ContractAdjustmentMaster,
  ContractAdjustmentMasterContext,
} from "../../ContractAdjustmentMaster/context";
import { authorizationService } from "core/services/common-services/authorization-service";

const AddContractAdjustment = ({
  showIcon = false,
  type,
}: {
  showIcon?: boolean;
  type?: string;
}) => {
  const { handleModal } = useContext<ContractAdjustmentMaster>(
    ContractAdjustmentMasterContext
  );

  const { validAction: validActionContract } =
    authorizationService.useAuthorizedAction("PURCHASE_CONTRACT", "Contract");

  const { validAction: validActionOrder } =
    authorizationService.useAuthorizedAction("PURCHASE_CONTRACT", "Order");

  const { validAction: validActionOrderHDNT } =
    authorizationService.useAuthorizedAction("PURCHASE_CONTRACT", "OrderHDNT");

  return (
    <div>
      {(validActionContract("CREATE") ||
        validActionOrder("CREATE") ||
        validActionOrderHDNT("CREATE")) && (
        <Button
          icon={showIcon ? <img src={AddIcon} alt="img" /> : null}
          iconPlace="left"
          type={(type || "primary") as "primary" | "secondary"}
          size="lg"
          onClick={() =>
            handleModal(ContractAdjustmentModal.SelectionSettlementContract)
          }
        >
          {t("BG.btn_add")}
        </Button>
      )}
    </div>
  );
};

export default AddContractAdjustment;
