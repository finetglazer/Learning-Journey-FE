import { isEqual } from "lodash";
import { Modal, Tag } from "react-components-design-system";

import CopySvg from "assets/icons/CostLine/ic_copy.svg";
import { useWarrantyTypeDetailHooks } from "../WarrantyTypeDetail/WarrantyTypeDetailHooks";
import "./WarrantyTypeView.scss";

interface WarrantyTypeDetailProps {
  warrantyTypeId?: string;
  dismiss: (shouldReloadList?: boolean) => void;
}

const MODAL_WIDTH = 600;

export const WarrantyTypeView = ({
  warrantyTypeId,
  dismiss,
}: WarrantyTypeDetailProps) => {
  const { translate, model, isLoading, copyToClipboard } =
    useWarrantyTypeDetailHooks(dismiss, warrantyTypeId);

  const MainSection = () => {
    const isActive = isEqual(model?.isActive, true);
    const translatedKey = isActive
      ? "CM.txt_status_active"
      : "CM.txt_status_deactivate";
    const value = translate(translatedKey);
    const statusValue = isActive ? "SUCCESS" : "DEFAULT";
    return (
      <div className="warranty-type__main-section">
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
      <div className="warranty-type__seconds-section">
        {/* Description */}
        {makeSection(
          translate("WT.txt_warranty_type_describe"),
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
      title={translate("WT.txt_view_detail_warranty_type")}
      titleButtonApply={translate("CM.btn_close")}
      loading={isLoading}
      size={MODAL_WIDTH}
      handleSave={dismiss}
      handleCancel={dismiss}
    >
      <div className="warranty-type__wrapper">
        {/* Main section */}
        <MainSection />
        {/* Second section */}
        <SecondSection />
      </div>
    </Modal>
  );
};
