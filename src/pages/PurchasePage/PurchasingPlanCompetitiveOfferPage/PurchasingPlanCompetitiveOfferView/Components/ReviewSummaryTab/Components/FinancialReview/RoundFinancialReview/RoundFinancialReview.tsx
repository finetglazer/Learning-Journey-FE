import { AdvancedCollapseView } from "components";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import { formatDateTimeToVietnamTimezone } from "core/helpers/date-time";
import { EvaluationSummary, TabKeyBidder } from "models/PurchasingPlan";
import { PurchasingPlanCompetitiveOfferDetailHookContext } from "pages/PurchasePage/PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferDetail/PurchasingPlanCompetitiveOfferDetailHook";
import { useContext, useState } from "react";
import FinancialReviewTable from "../FinancialReviewTable";
import "./RoundFinancialReview.scss";
import { isEqual } from "lodash";
import DrawerSendEmailSupplier from "pages/PurchasePage/PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferView/Components/ReviewSummaryTab/Components/Drawer/DrawerSendEmailSupplier/DrawerSendEmailSupplier";
import { Button } from "react-components-design-system";
import { IcSend } from "assets/icons";

const RoundFinancialReview = () => {
  const {
    translate,
    model,
    tabKeyParams: tabKey,
    handleChangeAllField,
  } = useContext(PurchasingPlanCompetitiveOfferDetailHookContext);
  const [openDrawerSendEmail, setOpenDrawerSendEmail] =
    useState<boolean>(false);

  const handleOpenDrawerSendEmail = () => {
    setOpenDrawerSendEmail(true);
  };

  const handleCloseDrawerSendEmail = () => {
    setOpenDrawerSendEmail(false);
    handleChangeAllField({
      ...model,
      textBody: null,
      errors: {
        textBody: null,
        attachmentFiles: null,
        subject: null,
      },
    });
  };

  const getData = () => {
    if (isEqual(tabKey, TabKeyBidder.DocumentEvaluation)) {
      return model?.profileEvaluation?.evaluationRound as EvaluationSummary[];
    }
    return model?.evaluationSummary;
  };

  const collapseItems = getData()?.map((item) => {
    return {
      key: item.id,
      label: `${translate("PL.purchasing_plan_round")} ${
        item.roundNumber
      }: ${formatDateTimeToVietnamTimezone(
        item.startDate,
        STANDARD_DATE_FORMAT_SLASH
      )} - 
            ${formatDateTimeToVietnamTimezone(
              item.endDate,
              STANDARD_DATE_FORMAT_SLASH
            )}`,
      children: (
        <>
          <Button
            icon={<img src={IcSend} alt="img" />}
            iconPlace="left"
            type="secondary"
            size="lg"
            onClick={handleOpenDrawerSendEmail}
            className="mb-4"
          >
            {translate("PL.purchasing_plan_send_email_to_supplier")}
          </Button>
          <FinancialReviewTable
            data={item?.evaluationResults}
            roundData={{ roundNumber: item?.roundNumber, id: item?.id }}
          />
        </>
      ),
    };
  });

  return (
    <>
      <AdvancedCollapseView
        items={collapseItems}
        isFullView
        key={JSON.stringify(model)}
      />
      {openDrawerSendEmail && (
        <DrawerSendEmailSupplier
          visible={openDrawerSendEmail}
          handleClose={handleCloseDrawerSendEmail}
        />
      )}
    </>
  );
};

export default RoundFinancialReview;
