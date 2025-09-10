import { isEqual } from "lodash";
import { Modal, Tag } from "react-components-design-system";

import CopySvg from "assets/icons/CostLine/ic_copy.svg";
import { useCommercialTermsDetailHooks } from "../CommercialTermsDetail/CommercialTermsDetailHooks";
import "./CommercialTermsView.scss";

interface CommercialTermsDetailProps {
  commercialTermsId?: string;
  dismiss: (shouldReloadList?: boolean) => void;
}

const MODAL_WIDTH = 600;

export const CommercialTermsView = ({
  commercialTermsId,
  dismiss,
}: CommercialTermsDetailProps) => {
  const { translate, model, isLoading, copyToClipboard } =
    useCommercialTermsDetailHooks(dismiss, commercialTermsId);

  const MainSection = () => {
    const isActive = isEqual(model?.isActive, true);
    const translatedKey = isActive
      ? "CM.txt_status_active"
      : "CM.txt_status_deactivate";
    const value = translate(translatedKey);
    const statusValue = isActive ? "SUCCESS" : "DEFAULT";
    return (
      <div className="commercial-term__main-section">
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
      <div className="commercial-term__seconds-section">
        {/* Description */}
        {makeSection(
          translate("CCT.txt_commercial_terms_describe"),
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
      title={translate("CCT.txt_view_detail_commercial_terms")}
      titleButtonApply={translate("CM.btn_close")}
      loading={isLoading}
      size={MODAL_WIDTH}
      handleSave={dismiss}
      handleCancel={dismiss}
    >
      <div className="commercial-term__wrapper">
        {/* Main section */}
        <MainSection />
        {/* Second section */}
        <SecondSection />
      </div>
    </Modal>
  );
};
