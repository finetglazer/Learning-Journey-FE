import { Modal, Tag } from "react-components-design-system";

import CopySvg from "assets/icons/CostLine/ic_copy.svg";
import { formatNumber } from "core/helpers/number";
import { getStatus } from "core/helpers/status";
import { useMemo } from "react";
import "./ContractClassificationView.scss";
import { useContractClassificationViewHooks } from "./ContractClassificationViewHooks";

interface ContractClassificationViewProps {
  open: boolean;
  contractClassificationId: string;
  handleCancel: () => void;
}

const MODAL_WIDTH = 600;

export const ContractClassificationView = ({
  open,
  contractClassificationId,
  handleCancel,
}: ContractClassificationViewProps) => {
  const { translate, model, isLoading, copyToClipboard } =
    useContractClassificationViewHooks(open, contractClassificationId);

  const status = useMemo(() => {
    const { keyI18n, type } = getStatus(model?.isActive);
    return {
      value: translate(keyI18n),
      status: type,
    };
  }, [translate, model?.isActive]);

  return (
    <Modal
      open={open}
      isShowButtonCancel={false}
      isShowIconBack={false}
      title={translate("CC.title_view_config_detail")}
      titleButtonApply={translate("CM.btn_close")}
      loading={isLoading}
      size={MODAL_WIDTH}
      handleSave={handleCancel}
      handleCancel={handleCancel}
      className="contract-classification-view"
    >
      <div className="contract-classification-view-body">
        <Tag
          size="md"
          value={status.value}
          status={status.status}
          isShowDot={false}
          isShowBorder
          className="contract-classification__status"
        />
        <span className="contract-classification__name">{model?.name}</span>
        <div
          className="contract-classification__code"
          onClick={copyToClipboard}
        >
          <span className="contract-classification__code-value">
            {model?.code}
          </span>
          <div className="contract-classification__code-icon">
            <img src={CopySvg} alt="CopySvg" />
          </div>
        </div>
        <div className="d-flex gap-2">
          <div className="contract-classification__item">
            <span className="contract-classification__item-label">
              {translate("CC.txt_config_maximum_payment")}
            </span>
            <span className="contract-classification__item-description">
              {formatNumber(model?.maxOverpaymentAmount)}
            </span>
          </div>
          <div className="contract-classification__item">
            <span className="contract-classification__item-label">
              {translate("CC.txt_config_percentage")}
            </span>
            <span className="contract-classification__item-description">
              {formatNumber(model?.maxOverpaymentPercentage)}
            </span>
          </div>
        </div>
        <div className="contract-classification__item">
          <span className="contract-classification__item-label">
            {translate("CM.txt_description")}
          </span>
          <p className="contract-classification__item-description">
            {model?.description}
          </p>
        </div>
      </div>
    </Modal>
  );
};
