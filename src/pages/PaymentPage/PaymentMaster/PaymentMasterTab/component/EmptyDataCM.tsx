import { IcPlusSVG } from "assets/icons";
import { EmptyData } from "components";
import { FC, useContext } from "react";
import { Button } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { PaymentMaster, PaymentMasterContext } from "../../PaymentMasterHook";
import { authorizationService } from "core/services/common-services/authorization-service";

type IProps = {
  icon?: string;
  isFilter?: boolean;
  height?: number;
  message?: string;
};

const EmptyDataCM: FC<IProps> = ({ icon, isFilter, height = 250, message }) => {
  const { handlePressAdd } = useContext<PaymentMaster>(PaymentMasterContext);
  const { t } = useTranslation();

  const { validAction: validActionPayment } =
    authorizationService.useAuthorizedAction("PAYMENT_REQUEST");

  const { validAction: validActionPaymentAdvance } =
    authorizationService.useAuthorizedAction("PAYMENT_ADVANCE");

  const { validAction: validActionExpenseProposal } =
    authorizationService.useAuthorizedAction("PAYMENT_EXPENSE_PROPOSAL");

  const { validAction: validActionAccountingRequest } =
    authorizationService.useAuthorizedAction("PAYMENT_ACCOUNTING_REQUEST");

  const { validAction: validActionDeposit } =
    authorizationService.useAuthorizedAction("PAYMENT_DEPOSIT");
  const buttonData = [
    {
      key: "request_payment",
      onClick: () => handlePressAdd("PAYMENT"),
      visible: validActionPayment("CREATE"),
    },
    {
      key: "request_an_advance",
      onClick: () => handlePressAdd("ADVANCE"),
      visible: validActionPaymentAdvance("CREATE"),
    },
    {
      key: "request_expenditure",
      onClick: () => handlePressAdd("EXPENSE"),
      visible: validActionExpenseProposal("CREATE"),
    },
    {
      key: "request_accounting",
      onClick: () => handlePressAdd("ACCOUNTING_ENTRY"),
      visible: validActionAccountingRequest("CREATE"),
    },
    {
      key: "request_deposit",
      onClick: () => handlePressAdd("DEPOSIT"),
      visible: validActionDeposit("CREATE"),
    },
  ];
  return (
    <EmptyData
      message={message ? message : t("PM.txt_content_no_data")}
      height={height}
      icon={icon}
    >
      {!isFilter && (
        <div className="ctn__button__nodata">
          {buttonData.map((button) =>
            button.visible ? (
              <Button
                key={button.key}
                icon={<img src={IcPlusSVG} width={16} alt="img" />}
                iconPlace="left"
                type="secondary"
                onClick={button.onClick}
              >
                {t(`PM.txt_${button.key}`)}
              </Button>
            ) : null
          )}
        </div>
      )}
    </EmptyData>
  );
};

export default EmptyDataCM;
