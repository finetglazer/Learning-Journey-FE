import { isEqual } from "lodash";
import { Modal, Tag } from "react-components-design-system";

import CopySvg from "assets/icons/CostLine/ic_copy.svg";
import { useGuaranteeTypeDetailHooks } from "../GuaranteeTypeDetail/GuaranteeTypeDetailHooks";
import "./GuaranteeTypeView.scss";

interface GuaranteeTypeDetailProps {
  guaranteeTypeId?: string;
  dismiss: (shouldReloadList?: boolean) => void;
}

const MODAL_WIDTH = 600;

export const GuaranteeTypeView = ({
  guaranteeTypeId,
  dismiss,
}: GuaranteeTypeDetailProps) => {
  const { translate, model, isLoading, copyToClipboard } =
    useGuaranteeTypeDetailHooks(dismiss, guaranteeTypeId);

  const MainSection = () => {
    const isActive = isEqual(model?.isActive, true);
    const translatedKey = isActive
      ? "CM.txt_status_active"
      : "CM.txt_status_deactivate";
    const value = translate(translatedKey);
    const statusValue = isActive ? "SUCCESS" : "DEFAULT";
    return (
      <div className="guarantee-type__main-section">
        {/* Status */}
        <div>
          <Tag
            size="md"
            value={value}
            status={statusValue}
            isShowDot={false}
            isShowBorder
          />
        </div>

        {/* Name */}
        <span className="text-name">{model?.name}</span>

        {/* Code */}
        <div className="code-container" onClick={copyToClipboard}>
          <span className="text-code">{model?.code}</span>
          <img src={CopySvg} alt="" />
        </div>
      </div>
    );
  };

  const SecondSection = () => {
    const makeSection = (label: string, value: string) => {
      return (
        <div className="second-section__wrapper">
          <span className="text-label">{label}</span>
          <span className="text-value">{value}</span>
        </div>
      );
    };

    return (
      <div className="guarantee-type__seconds-section">
        {/* Description */}
        {makeSection(
          translate("GT.txt_guarantee_type_describe"),
          model?.description
        )}
      </div>
    );
  };

  return (
    <Modal
      open
      isShowButtonCancel={false}
      isShowIconBack={false}
      title={translate("GT.txt_view_detail_guarantee_type")}
      titleButtonApply={translate("CM.btn_close")}
      loading={isLoading}
      size={MODAL_WIDTH}
      handleSave={dismiss}
      handleCancel={dismiss}
    >
      <div className="guarantee-type__wrapper">
        {/* Main section */}
        <MainSection />
        {/* Second section */}
        <SecondSection />
      </div>
    </Modal>
  );
};
