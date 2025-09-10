import ActiveSvg from "assets/icons/CostLine/ic_active.svg";
import CopySvg from "assets/icons/CostLine/ic_copy.svg";
import DashSvg from "assets/icons/CostLine/ic_dash.svg";
import DenySvg from "assets/icons/CostLine/ic_deny.svg";
import { isEqual, isNil } from "lodash";
import { BudgetCalculationMethod, BudgetPeriod } from "models/CostLine";
import { useContext } from "react";
import { Modal, Tag } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  CostLineMaster,
  CostLineMasterContext,
} from "../CostLineMaster/CostLineMasterHook";
import "./CostLineDetail.scss";
const MODAL_WIDTH = 600;

export const ConstLineDetail = () => {
  const { modal, setModalType, loadingDetail, detailModel, notifyToast } =
    useContext<CostLineMaster>(CostLineMasterContext);

  const [translate] = useTranslation();

  const copyToClipboard = () => {
    const textToCopy = detailModel?.code || "";

    if (textToCopy) {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          notifyToast({
            message: translate("CL.copied_to_clipboard_message"),
          });
        })
        .catch((error) => {
          console.error("Failed to copy text: ", error);
        });
    }
  };

  const CostLine = () => {
    const value = isEqual(detailModel?.isActive, true)
      ? translate("CL.active_status_txt")
      : translate("CL.deactivate_status_txt");
    const statusValue = isEqual(detailModel?.isActive, true)
      ? "SUCCESS"
      : "DEFAULT";
    return (
      <div>
        {/* parent */}
        {!isNil(detailModel?.parentName) ? (
          <div className="parent-container position-relative">
            <span className="body-text--sm">
              {translate("CL.code_line_parent_txt")}:{" "}
            </span>
            <span className="body-text--xl">{detailModel?.parentName}</span>
            <div className="dash-container">
              <img src={DashSvg} alt="" />
            </div>
          </div>
        ) : null}
        {/* children */}
        <div
          className={`children-container ${
            !isNil(detailModel?.parentName) ? "margin-left-20px" : ""
          }`}
        >
          <div>
            <Tag
              size="md"
              value={value}
              status={statusValue}
              isShowDot={false}
              isShowBorder={true}
            />
          </div>
          <span className="heading-text--xl">{detailModel?.name}</span>
          <div
            className="d-flex flex-row gap-2"
            style={{ cursor: "pointer" }}
            onClick={copyToClipboard}
          >
            <span className="body-text--xl">{detailModel?.code}</span>
            <img src={CopySvg} alt="" />
          </div>
        </div>
      </div>
    );
  };

  const getStyleBy = (active: boolean) => {
    return {
      key: active ? "CL.allow_txt" : "CL.deny_txt",
      icon: active ? ActiveSvg : DenySvg,
      color: active ? "#219342" : "#42526E",
    };
  };

  const BudgetInformation = () => {
    const budgetTransferStyle = getStyleBy(detailModel?.isTransfer);
    const budgetExceedStyle = getStyleBy(detailModel?.isBudgetOverruns);

    return (
      <div className="budget-container">
        <div className="body-content">
          <div className="d-flex flex-row gap-2 flex">
            <div className="item w-100">
              <span className="body-text--sm">
                {translate("CL.budget_period_txt")}
              </span>
              <span className="body-text--lg">
                {translate(`CL.${BudgetPeriod[detailModel?.budgetPeriod]}_txt`)}
              </span>
            </div>

            <div className="item w-100">
              <span className="body-text--sm">
                {translate("CL.calculation_method_txt")}
              </span>
              <span className="body-text--lg">
                {translate(
                  `CL.${
                    BudgetCalculationMethod[
                      detailModel?.budgetCalculationMethod
                    ]
                  }_txt`
                )}
              </span>
            </div>
          </div>
          <div className="item">
            <span className="body-text--sm">
              {translate("CL.allow_budget_transfer_txt")}
            </span>
            <div className="d-flex flex-row gap-1">
              <img src={budgetTransferStyle.icon} alt="" />
              <span
                className="body-text--lg"
                style={{ color: budgetTransferStyle.color }}
              >
                {translate(budgetTransferStyle.key)}
              </span>
            </div>
          </div>
          {/* <div className="item">
            <span className="body-text--sm">
              {translate("CL.driver_default_txt")}
            </span>
            <span className="body-text--lg">
              {detailModel?.costDriverName || "none"}
            </span>
          </div> */}
        </div>

        <div className="body-content">
          <div className="item">
            <span className="body-text--sm">
              {translate("CL.driver_default_txt")}
            </span>
            <span className="body-text--lg">{detailModel?.costDriverName}</span>
          </div>
          <div className="item">
            <span className="body-text--sm">
              {translate("CL.allow_budget_exceed_txt")}
            </span>
            <div className="d-flex flex-row gap-1">
              <img src={budgetExceedStyle.icon} alt="" />
              <span
                className="body-text--lg"
                style={{ color: budgetExceedStyle.color }}
              >
                {translate(budgetExceedStyle.key)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Modal
      title={translate("CL.view_cost_line_detail_title")}
      open={isEqual(modal.type, "DETAIL")}
      loading={loadingDetail}
      size={MODAL_WIDTH}
      titleButtonApply={translate("CL.close_btn")}
      handleCancel={() => setModalType({ type: "NONE" })}
      handleSave={() => setModalType({ type: "NONE" })}
      isShowButtonCancel={false}
      isShowIconBack={false}
    >
      <div className="d-flex flex-column gap-3">
        <CostLine />
        <BudgetInformation />
      </div>
    </Modal>
  );
};
