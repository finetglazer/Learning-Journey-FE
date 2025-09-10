/* eslint-disable import/named */
import classNames from "classnames";
import CollapseView from "components/Collapse/CollapseView";
import { useContext, useMemo, useState } from "react";
import { Drawer } from "react-components-design-system";
import { PurchasingPlanModel } from "models/PurchasingPlan";
import "./DrawerSendEmailSupplier.scss";
import ContentHeaderEmail from "./Components/ContentHeaderEmail/ContentHeaderEmail";
import ContentEmail from "./Components/ContentEmail/ContentEmail";
import EmailAttachFile from "./Components/EmailAttachFile/EmailAttachFile";
import { purchasingPlanRepository } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanRepository";
import { TYPE_OF_ATTACHMENTS } from "models/PurchasingPlan/PurchasingPlanConstant";
import { finalize } from "rxjs";
import { PurchasingPlanPrincipleDetailHookContext } from "pages/PurchasePage/PurchasingPlanPrinciplePage/PurchasingPlanPrincipleDetail/PurchasingPlanPrincipleDetailHook";

interface Props {
  visible: boolean;
  handleClose: () => void;
}

const DrawerSendEmailSupplier = ({ visible, handleClose }: Props) => {
  const { translate, model, handleChangeAllField } =
    useContext<PurchasingPlanModel>(PurchasingPlanPrincipleDetailHookContext);
  const hasBorder = false;
  const [isLoadingButtonSendEmail, setIsLoadingButtonSendEmail] =
    useState<boolean>(false);

  const items = useMemo(
    () => [
      {
        key: "1",
        label: translate("PL.purchasing_plan_email_title_description"),
        children: <ContentHeaderEmail />,
      },
      {
        key: "2",
        label: translate("PL.purchasing_plan_content_email"),
        children: <ContentEmail fieldName="textBody" />,
      },
      {
        key: "3",
        label: translate("PL.purchasing_plan_attachment"),
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

    const emailRequest = [
      model.supplierPurchasePlans?.[0]?.supplierEmail,
      model.supplierPurchasePlans?.[0]?.quoteEmail,
      ...(model.supplierPurchasePlans?.[0]?.emailRecipients?.map(
        (item: { email: string }) => item?.email
      ) || []),
    ]?.filter(Boolean);

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
      <CollapseView
        items={items}
        defaultActiveKey={["1", "2", "3"]}
        className={classNames(
          hasBorder
            ? "collapse__container__overflow"
            : "collapse__container--not-border"
        )}
      />
    </Drawer>
  );
};

export default DrawerSendEmailSupplier;
