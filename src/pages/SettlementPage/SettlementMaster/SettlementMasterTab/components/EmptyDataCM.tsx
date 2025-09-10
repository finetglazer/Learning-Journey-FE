import { EmptyDataSettlement, IcPlusSVG } from "assets/icons";
import { EmptyData } from "components";
import { SETTLEMENT_DETAIL_ROUTE } from "config/route-const";
import { FC } from "react";
import { Button } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";

type IProps = {
  icon?: string;
  isFilter?: boolean;
  height?: number;
  message?: string;
};

const EmptyDataCM: FC<IProps> = ({ isFilter, height = 250, message }) => {
  const { t } = useTranslation();
  const history = useHistory();
  return (
    <EmptyData
      message={message ? message : t("settlement.empty_data")}
      height={height}
      icon={EmptyDataSettlement}
    >
      {!isFilter && (
        <div className="ctn__button__nodata">
          <Button
            icon={<img src={IcPlusSVG} width={16} alt="img" />}
            iconPlace="left"
            type="secondary"
            onClick={() => history.push(SETTLEMENT_DETAIL_ROUTE)}
          >
            {t("TIA.btn_create")}
          </Button>
        </div>
      )}
    </EmptyData>
  );
};

export default EmptyDataCM;
