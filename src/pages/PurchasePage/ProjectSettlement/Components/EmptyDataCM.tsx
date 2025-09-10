import { EmptyData } from "components";
import {
  ProjectSettlementMasterContext,
  ProjectSettlementMasterType,
} from "pages/PurchasePage/ProjectSettlement/ProjectSettlementMaster/context";
import { useContext } from "react";
import { Button } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { ProjectSettlementModal } from "./constant";

type IProps = {
  icon?: string;
  isFilter?: boolean;
  height?: number;
  message?: string;
};

const EmptyDataCM = ({ icon, isFilter, height = 250, message }: IProps) => {
  const [translate] = useTranslation();
  const { handleModal } = useContext<ProjectSettlementMasterType>(
    ProjectSettlementMasterContext
  );

  return (
    <EmptyData
      message={message ? message : translate("PS.txt_content_no_data_list")}
      height={height}
      icon={icon}
    >
      {!isFilter && (
        <Button
          onClick={() =>
            handleModal(ProjectSettlementModal.SelectionSettlementPolicy)
          }
          type="secondary"
          size="lg"
        >
          {translate("CM.btn_add")}
        </Button>
      )}
    </EmptyData>
  );
};

export default EmptyDataCM;
