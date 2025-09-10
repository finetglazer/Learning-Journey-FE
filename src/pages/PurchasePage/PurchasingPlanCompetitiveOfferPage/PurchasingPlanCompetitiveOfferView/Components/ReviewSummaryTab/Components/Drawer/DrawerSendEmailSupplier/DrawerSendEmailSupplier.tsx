/* eslint-disable import/named */
import CollapseView from "components/Collapse/CollapseView";
import { TYPE_OF_ATTACHMENTS } from "models/PurchasingPlan/PurchasingPlanConstant";
import { PurchasingPlanCompetitiveOfferDetailHookContext } from "pages/PurchasePage/PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferDetail/PurchasingPlanCompetitiveOfferDetailHook";
import { purchasingPlanRepository } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanRepository";
import { useContext, useMemo, useState } from "react";
import { Drawer } from "react-components-design-system";
import { finalize } from "rxjs";
import ContentEmail from "./Components/ContentEmail/ContentEmail";
import ContentHeaderEmail from "./Components/ContentHeaderEmail/ContentHeaderEmail";
import EmailAttachFile from "./Components/EmailAttachFile/EmailAttachFile";
import "./DrawerSendEmailSupplier.scss";

interface Props {
  visible: boolean;
  handleClose: () => void;
}

const DrawerSendEmailSupplier = ({ visible, handleClose }: Props) => {
  const { translate, model, handleChangeAllField, notifyToast } = useContext(
    PurchasingPlanCompetitiveOfferDetailHookContext
  );
  const [isLoadingButtonSendEmail, setIsLoadingButtonSendEmail] =
    useState<boolean>(false);
  const items = useMemo(
    () => [
      {
        key: "1",
        label: (
          <div className="font-size-14">
            {translate("PL.purchasing_plan_email_title_description")}
          </div>
        ),
        children: <ContentHeaderEmail />,
      },
      {
        key: "2",
        label: (
          <div className="font-size-14">
            {translate("PL.purchasing_plan_content_email")}{" "}
            <span className="text__red">*</span>
          </div>
        ),
        children: <ContentEmail fieldName="textBody" />,
      },
      {
        key: "3",
        label: (
          <div className="font-size-14">
            {translate("PL.purchasing_plan_attachment")}
          </div>
        ),
        children: <EmailAttachFile />,
      },
    ],
    [translate]
  );

  const handleSaveDrawerSendEmail = () => {
    setIsLoadingButtonSendEmail(true);
    const supplierAttachments = model.supplierAttachments
      ?.filter(
        (item: any) =>
          item.purchasePlanAttachmentType ===
          TYPE_OF_ATTACHMENTS.SUPPLIER_ATTACHMENT
      )
      .map((attach) => attach.path);

    const emailRequest =
      model?.evaluationSummary?.[0].evaluationResults
        ?.map((item) => item?.supplier?.email)
        ?.filter(Boolean) || [];

    const bodyRequest = {
      tos: emailRequest,
      ccs: model?.emailCC?.map((item: { email: string }) => {
        return item.email;
      }),
      subject: model?.subject,
      textBody: model?.textBody,
      attachmentFiles: [
        ...(model?.attachmentFiles?.map(
          (item: { path: string }) => item.path
        ) || []),
        ...supplierAttachments,
      ],
      supplierPurchasePlanId: model.supplierPurchasePlans?.[0]?.id,
    };

    purchasingPlanRepository
      .sendEmailToSupplier(bodyRequest)
      .pipe(finalize(() => setIsLoadingButtonSendEmail(false)))
      .subscribe({
        next: () => {
          notifyToast({
            message: translate("PL.purchasing_plan_toast_send_email_success"),
            type: "success",
          });
          handleClose();
          const isLoadData = model.isLoadDataDetail
            ? !model.isLoadDataDetail
            : true;
          handleChangeAllField({
            ...model,
            isLoadDataDetail: isLoadData,
            textBody: null,
            emailCC: null,
            attachmentFiles: null,
            subject: null,
          });
        },
        error: (error) => {
          if (error.response?.data?.type === "Validate") {
            handleChangeAllField({
              ...model,
              errors: error.response?.data?.errors,
            });
          }
        },
      });
  };

  return (
    <Drawer
      numberButton={"1"}
      visible={visible}
      size={"xl"}
      loading={false}
      titleButtonCancel={translate("CM.btn_close")}
      titleButtonApply={translate("PL.purchasing_plan_send_email_btn")}
      handleCancel={handleClose}
      handleClose={handleClose}
      handleSave={handleSaveDrawerSendEmail}
      isHaveCloseIcon={true}
      shouldCloseWhenClickOutSide={false}
      hasOverlay={false}
      disableButton={isLoadingButtonSendEmail}
      title={
        <div className="fw-bold">
          <span>{translate("PL.purchasing_plan_title_drawer_send_email")}</span>
        </div>
      }
      className="purchasing-plan-supplier__drawer-send-email"
    >
      <CollapseView items={items} defaultActiveKey={["1", "2", "3"]} />
    </Drawer>
  );
};

export default DrawerSendEmailSupplier;
