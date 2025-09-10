import { IcPlusSVG } from "assets/icons";
import { EmptyData } from "components";
import { FC, useContext } from "react";
import { Button } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  ProposalMaster,
  ProposalMasterContext,
} from "../../ProposalMasterHook";

type IProps = {
  icon?: string;
  isFilter?: boolean;
  height?: number;
  message?: string;
};

const EmptyDataCM: FC<IProps> = ({ icon, isFilter, height = 250, message }) => {
  const { modelFilter, handlePressAdd, setIsShowModalProposal } =
    useContext<ProposalMaster>(ProposalMasterContext);
  const { t } = useTranslation();

  const onPressAdd = () => {
    if (modelFilter?.tabKey == 1) {
      setIsShowModalProposal(true);
      return;
    }
    handlePressAdd();
  };
  return (
    <EmptyData
      message={message ? message : t("PP.txt_content_no_data")}
      height={height}
      icon={icon}
    >
      {!isFilter && (
        <div className="Proposal__ctn__button--nodata ">
          <Button
            icon={<img src={IcPlusSVG} width={16} alt="img" />}
            iconPlace="left"
            type="secondary"
            onClick={onPressAdd}
          >
            {modelFilter?.tabKey == 1
              ? t("PP.btn_create_proposal_adjust")
              : t("PP.btn_create_proposal")}
          </Button>
          {/* <Button
            icon={<img src={IcPlusSVG} width={16} alt="img" />}
            iconPlace="left"
            type="secondary"
            onClick={() => handlePressAdd(BudgetAddType.Adjust)}
          >
            {t("BG.btn_create_adjust")}
          </Button>
          <Button
            icon={<img src={IcPlusSVG} width={16} alt="img" />}
            iconPlace="left"
            type="secondary"
            onClick={() => handlePressAdd(BudgetAddType.Settlement)}
          >
            {t("BG.btn_create_finalization")}
          </Button> */}
        </div>
      )}
    </EmptyData>
  );
};

export default EmptyDataCM;
