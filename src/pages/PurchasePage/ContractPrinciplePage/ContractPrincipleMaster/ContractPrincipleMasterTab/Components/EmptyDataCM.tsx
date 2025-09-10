import { IcPlusSVG } from "assets/icons";
import EmptyData from "components/EmptyData/EmptyData";
import { FC, useContext } from "react";
import { Button } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  ContractPrincipleMaster,
  ContractPrincipleMasterContext,
} from "../../ContractPrincipleMasterHook";

type IProps = {
  icon?: string;
  isFilter?: boolean;
  height?: number;
  message?: string;
};

const EmptyDataCM: FC<IProps> = ({ icon, isFilter, height = 250, message }) => {
  const [translate] = useTranslation();
  const { handleAddNew } = useContext<ContractPrincipleMaster>(
    ContractPrincipleMasterContext
  );
  return (
    <EmptyData
      message={message ? message : translate("PR.txt_content_no_data")}
      height={height}
      icon={icon}
    >
      {!isFilter && (
        <div className="ContractPrinciple__ctn__button--nodata ">
          <Button
            icon={<img src={IcPlusSVG} width={16} alt="img" />}
            iconPlace="left"
            type="secondary"
            onClick={handleAddNew}
          >
            {translate("CM.btn_add")}
          </Button>
        </div>
      )}
    </EmptyData>
  );
};

export default EmptyDataCM;
