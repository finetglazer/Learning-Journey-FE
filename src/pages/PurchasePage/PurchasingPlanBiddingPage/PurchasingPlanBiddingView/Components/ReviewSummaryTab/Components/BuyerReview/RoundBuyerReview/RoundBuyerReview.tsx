import { IcSend } from "assets/icons";

import AdvancedCollapseView from "components/AdvancedCollapseView/AdvancedCollapseView";
import { EvaluationSummary, TabKeyBidder } from "models/PurchasingPlan";
import { PurchasingPlanBiddingDetailHookContext } from "pages/PurchasePage/PurchasingPlanBiddingPage/PurchasingPlanBiddingDetail/PurchasingPlanBiddingDetailHook";
import { useContext, useState } from "react";
import { Button } from "react-components-design-system";
import DrawerSendEmailSupplier from "../../DrawerSendEmailSupplier/DrawerSendEmailSupplier";
import BuyerReviewTable from "../BuyerReviewTable";
import "./RoundBuyerReview.scss";
import { formatDateTimeToVietnamTimezone } from "core/helpers/date-time";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";

const RoundBuyerReview = () => {
  const {
    translate,
    model,
    tabKeyParams: tabKey,
    handleChangeAllField,
  } = useContext(PurchasingPlanBiddingDetailHookContext);
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
    if (tabKey === TabKeyBidder.DocumentEvaluation) {
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
          {tabKey !== TabKeyBidder.DocumentEvaluation && (
            <Button
              icon={<img src={IcSend} alt="img" />}
              iconPlace="left"
              type="secondary"
              size="lg"
              onClick={handleOpenDrawerSendEmail}
            >
              {translate("PL.purchasing_plan_send_email_to_supplier")}
            </Button>
          )}

          <BuyerReviewTable
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

export default RoundBuyerReview;
