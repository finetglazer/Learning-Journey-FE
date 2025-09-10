import { IcPlusSVG } from "assets/icons";
import EmptyData from "components/EmptyData/EmptyData";
import { FC, useContext } from "react";
import { Button } from "react-components-design-system";
import {
  ContractMaster,
  ContractMasterContext,
} from "../../ContractMasterHook";
import { ContractAddType } from "models/Contract";
import { useTranslation } from "react-i18next";
import { authorizationService } from "core/services/common-services/authorization-service";

type IProps = {
  icon?: string;
  isFilter?: boolean;
  height?: number;
  message?: string;
};

const EmptyDataCM: FC<IProps> = ({ icon, isFilter, height = 250, message }) => {
  const { handleAddContract } = useContext<ContractMaster>(
    ContractMasterContext
  );
  const [translate] = useTranslation();

  const { validAction: validActionContract } =
    authorizationService.useAuthorizedAction("PURCHASE_CONTRACT", "Contract");

  return (
    <EmptyData
      message={message ? message : translate("CM.message_empty_data")}
      height={height}
      icon={icon}
    >
      {!isFilter && validActionContract("CREATE") && (
        <div className="Contract__ctn__button--nodata ">
          <Button
            icon={<img src={IcPlusSVG} width={16} alt="img" />}
            iconPlace="left"
            type="secondary"
            onClick={() => handleAddContract(ContractAddType.Contract)}
          >
            {translate("CM.txt_status_create_new")}
          </Button>
        </div>
      )}
    </EmptyData>
  );
};

export default EmptyDataCM;
