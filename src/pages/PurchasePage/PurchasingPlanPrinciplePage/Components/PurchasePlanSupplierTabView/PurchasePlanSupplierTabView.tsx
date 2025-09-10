import {
  PurchasingPlanModel,
  Quotation,
  SupplierModel,
  SupplierPurchasingPlanDetails,
} from "models/PurchasingPlan";
import { PurchasingPlanPrincipleDetailHookContext } from "../../PurchasingPlanPrincipleDetail/PurchasingPlanPrincipleDetailHook";
import { useContext, useState } from "react";
import ModalExtensionOfTime from "./Components/ModalExtensionOfTime/ModalExtensionOfTime";
import { Button } from "react-components-design-system";
import { emptyIcon, IcClock, IcSend } from "assets/icons";
import { PURCHASING_PLAN_STATUS } from "models/PurchasingPlan/PurchasingPlanConstant";
import dayjs from "dayjs";
import { gt, isEmpty } from "lodash";
import SupplierInformationTable from "./Components/SupplierInformationTable/SupplierInformationTable";
import SupplierQuoteTable from "./Components/SupplierQuoteTable/SupplierQuoteTable";
import EmptyTable from "./Components/SupplierQuoteTable/EmptyTable/EmptyTable";
import { useAppSelector } from "rtk/useRedux";
import DrawerSendEmailSupplier from "./Components/DrawerSendEmailSupplier/DrawerSendEmailSupplier";
import SupplierInformationDrawer from "./Components/SupplierInformationDrawer/SupplierInformationDrawer";
import SupplierQuotationDrawer from "./Components/SupplierQuotationDrawer/SupplierQuotationDrawer";
import CollapseView from "components/Collapse/CollapseView";
import classNames from "classnames";
import "./PurchasePlanSupplierTabView.scss";

const PurchasePlanSupplierTabView = ({
  isViewMode,
  isViewModeDraft,
}: {
  isViewMode?: boolean;
  isViewModeDraft?: boolean;
}) => {
  const {
    translate,
    model,
    handleChangeAllField,
    isDrawerSupplier,
    isDrawerQuote,
    handleClickDrawerSupplier,
    handleClickDrawerQuote,
    setIsDrawerQuote,
    setIsDrawerSupplier,
  } = useContext<PurchasingPlanModel>(PurchasingPlanPrincipleDetailHookContext);
  const account = useAppSelector((state) => state.profile?.account);
  const hasBorder = false;
  const [dataDrawer, setDataDrawer] = useState<SupplierModel>(null);

  const [openModalExtensionOfTime, setOpenModalExtensionOfTime] =
    useState<boolean>(false);
  const [openDrawerSendEmail, setOpenDrawerSendEmail] =
    useState<boolean>(false);

  const handleCloseModalExtensionOfTime = () => {
    setOpenModalExtensionOfTime(false);
    handleChangeAllField({
      ...model,
      extendTime: null,
      errors: {
        extendTime: null,
      },
    });
  };

  const handleOpenDrawerSendEmail = () => {
    setOpenDrawerSendEmail(true);
    setIsDrawerQuote(false);
    setIsDrawerSupplier(false);
    handleChangeAllField({
      ...model,
      emailCC: isEmpty(model?.emailCC) ? [account] : model?.emailCC,
      subject: model?.subject
        ? model?.subject
        : `${translate("PL.purchasing_plan_mail_bid")} ${model?.code}`,
    });
  };

  const handleCloseDrawerSendEmail = () => {
    setOpenDrawerSendEmail(false);
    handleChangeAllField({
      ...model,
      errors: {
        textBody: null,
        attachmentFiles: null,
        subject: null,
      },
    });
  };

  const items = (supplier: SupplierPurchasingPlanDetails, index: number) => [
    {
      key: `${index + 1}`,
      label: `${translate("PL.purchasing_plan_round")} ${
        supplier?.quotationRoundDetail?.roundNumber
      }: ${supplier?.name} ${translate("PL.purchasing_plan_from")} 
        ${dayjs(supplier?.quotationRoundDetail?.startDate).format(
          "DD/MM/YYYY"
        )} ${translate("PL.purchasing_plan_to")} 
        ${dayjs(supplier?.quotationRoundDetail?.endDate).format("DD/MM/YYYY")}`,
      children: (
        <div>
          <div className="d-flex gap-16">
            {/* Button gửi email */}
            {/* Nếu là nhà cung cấp đầu tiên */}
            {/* Nếu không phải chế độ xem */}
            {!isViewMode && index === 0 && (
              <div className="p-b--sm">
                <Button
                  icon={<img src={IcSend} alt="img" />}
                  iconPlace="left"
                  type="secondary"
                  size="lg"
                  onClick={handleOpenDrawerSendEmail}
                >
                  {translate("PL.purchasing_plan_send_email_to_supplier")}
                </Button>
              </div>
            )}
            {/* Nếu là trạng thái chờ chào giá và ngày hiện tại lớn hơn ngày kết thúc */}
            {/* Nếu không phải chế độ xem */}
            {!isViewMode &&
              index === 0 &&
              model.status === PURCHASING_PLAN_STATUS.WAITING_QUOTATION &&
              gt(dayjs().startOf("day"), model.endDate) && (
                // Button gia hạn thời gian chào giá
                <div className="">
                  <Button
                    icon={
                      <img src={IcClock} alt="IcClock" width={12} height={14} />
                    }
                    iconPlace="left"
                    type="secondary"
                    onClick={() => setOpenModalExtensionOfTime(true)}
                  >
                    {translate("PL.purchasing_plan_extension_of_bid_period")}
                  </Button>
                </div>
              )}
          </div>

          <SupplierInformationTable
            supplier={[supplier]}
            setDataDrawer={setDataDrawer}
            setOpenDrawerSendEmail={setOpenDrawerSendEmail}
          />
          {
            // Nếu chưa có báo giá từ nhà cung cấp
            (!isViewModeDraft && !supplier?.quotationRoundDetail) ||
            supplier?.quotationRoundDetail?.quotations.length === 0 ? (
              <div className="p-t--sm">
                <div className="fs-6 fw-semibold p-b--sm">
                  {translate("PL.purchasing_plan_supplier_quotes_title")}
                </div>
                <EmptyTable
                  icon={<img src={emptyIcon} alt="" />}
                  content={
                    <div>{translate("PL.purchasing_plan_no_quote_yet")}</div>
                  }
                />
              </div>
            ) : (
              <div className="p-t--sm">
                <SupplierQuoteTable
                  quotationRound={supplier.quotationRoundDetail?.quotations}
                  setOpenDrawerSendEmail={setOpenDrawerSendEmail}
                />
              </div>
            )
          }
        </div>
      ),
    },
  ];

  return (
    <div className="purchasing-plan-supplier-view purchasing-plan-supplier-view-scroll">
      {model.supplierPurchasePlans?.length === 1 &&
        model.supplierPurchasePlans?.map(
          (supplier: SupplierPurchasingPlanDetails) => (
            <div className="p-b--sm" key={supplier.id}>
              <div className="d-flex gap-16 p-b--sm">
                {/* Nếu không phải chế độ xem */}
                {!isViewMode && (
                  <div className="">
                    <Button
                      icon={<img src={IcSend} alt="img" />}
                      iconPlace="left"
                      type="secondary"
                      size="lg"
                      onClick={handleOpenDrawerSendEmail}
                    >
                      {translate("PL.purchasing_plan_send_email_to_supplier")}
                    </Button>
                  </div>
                )}

                {!isViewMode &&
                  model.status === PURCHASING_PLAN_STATUS.WAITING_QUOTATION &&
                  gt(dayjs().startOf("day"), model.endDate) && (
                    <div className="">
                      <Button
                        icon={
                          <img
                            src={IcClock}
                            alt="IcClock"
                            width={12}
                            height={14}
                          />
                        }
                        iconPlace="left"
                        type="secondary"
                        onClick={() => setOpenModalExtensionOfTime(true)}
                      >
                        {translate(
                          "PL.purchasing_plan_extension_of_bid_period"
                        )}
                      </Button>
                    </div>
                  )}
              </div>
              <SupplierInformationTable
                supplier={[supplier]}
                isViewModeDraft={isViewModeDraft}
                setDataDrawer={setDataDrawer}
                setOpenDrawerSendEmail={setOpenDrawerSendEmail}
              />
              {!isViewModeDraft &&
                (!supplier?.quotationRoundDetail ||
                supplier?.quotationRoundDetail?.quotations.length === 0 ? (
                  <div className="p-t--sm">
                    <div className="fs-6 fw-semibold p-b--sm">
                      {translate("PL.purchasing_plan_supplier_quotes_title")}
                    </div>
                    <EmptyTable
                      icon={<img src={emptyIcon} alt="" />}
                      content={
                        <div>
                          {translate("PL.purchasing_plan_no_quote_yet")}
                        </div>
                      }
                    />
                  </div>
                ) : (
                  <div className="p-t--sm">
                    <SupplierQuoteTable
                      quotationRound={supplier.quotationRoundDetail?.quotations}
                      setOpenDrawerSendEmail={setOpenDrawerSendEmail}
                    />
                  </div>
                ))}
            </div>
          )
        )}

      {model.supplierPurchasePlans?.length > 1 &&
        model.supplierPurchasePlans?.map(
          (supplier: SupplierPurchasingPlanDetails, index: number) => (
            <div
              className={classNames(
                "border-collapse_supplier p-x--sm p-y--3xs",
                index !== model.supplierPurchasePlans?.length - 1 && "m-b--lg"
              )}
              key={supplier.id}
            >
              <CollapseView
                items={items(supplier, index)}
                defaultActiveKey={[`${index + 1}`]}
                className={classNames(
                  hasBorder
                    ? "collapse__container__overflow"
                    : "collapse__container--not-border"
                )}
              />
            </div>
          )
        )}

      {openModalExtensionOfTime && (
        <ModalExtensionOfTime
          visible={openModalExtensionOfTime}
          handleClose={handleCloseModalExtensionOfTime}
        />
      )}

      {openDrawerSendEmail && (
        <DrawerSendEmailSupplier
          visible={openDrawerSendEmail}
          handleClose={handleCloseDrawerSendEmail}
        />
      )}

      {isDrawerSupplier && (
        <SupplierInformationDrawer
          values={dataDrawer}
          visible={isDrawerSupplier}
          handleClose={handleClickDrawerSupplier}
        />
      )}

      {isDrawerQuote && (
        <SupplierQuotationDrawer
          visible={isDrawerQuote}
          handleClose={handleClickDrawerQuote}
        />
      )}
    </div>
  );
};

export default PurchasePlanSupplierTabView;
