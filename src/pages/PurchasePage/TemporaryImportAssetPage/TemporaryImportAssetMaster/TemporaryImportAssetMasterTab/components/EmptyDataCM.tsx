import { IcPlusSVG } from "assets/icons";
import { EmptyData } from "components";
import { FC, useContext } from "react";
import { Button } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  TemporaryImportAssetMaster,
  TemporaryImportAssetMasterContext,
} from "../../TemporaryImportAssetMasterHook";
import { authorizationService } from "core/services/common-services/authorization-service";

type IProps = {
  icon?: string;
  isFilter?: boolean;
  height?: number;
  message?: string;
};

const EmptyDataCM: FC<IProps> = ({ icon, isFilter, height = 250, message }) => {
  const { t } = useTranslation();
  const { handlePressAdd } = useContext<TemporaryImportAssetMaster>(
    TemporaryImportAssetMasterContext
  );

  const { validAction } = authorizationService.useAuthorizedAction(
    "PURCHASE_TEMP_RECEIPT"
  );

  return (
    <EmptyData
      message={message ? message : t("TIA.txt_content_no_data")}
      height={height}
      icon={icon}
    >
      {!isFilter && validAction("CREATE") && (
        <div className="ctn__button__nodata">
          <Button
            icon={<img src={IcPlusSVG} width={16} alt="img" />}
            iconPlace="left"
            type="secondary"
            onClick={() => handlePressAdd()}
          >
            {t("TIA.btn_create")}
          </Button>
        </div>
      )}
    </EmptyData>
  );
};

export default EmptyDataCM;
