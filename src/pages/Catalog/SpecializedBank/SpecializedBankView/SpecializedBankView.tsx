import { isEqual, isNull } from "lodash";
import { Modal, Tag } from "react-components-design-system";
import { useSpecializedBankViewHooks } from "./SpecializedBankViewHooks";

import CopySvg from "assets/icons/CostLine/ic_copy.svg";
import {
  STANDARD_DATE_FORMAT_SLASH,
  VIETNAMESE_TIME_ZONE_OFFSET,
} from "core/config/consts";
import dayjs from "dayjs";
import { SpecializedBankType } from "models/SpecializedBank/SpecializedBankFilter";
import { useMemo } from "react";
import "./SpecializedBankView.scss";

interface SpecializedBankViewProps {
  specialBankId: string;
  dismiss: () => void;
}

const MODAL_WIDTH = 600;

export const SpecializedBankView = ({
  specialBankId,
  dismiss,
}: SpecializedBankViewProps) => {
  const { translate, model, isLoading, copyToClipboard } =
    useSpecializedBankViewHooks(specialBankId);

  const type: string = useMemo(() => {
    const enumType = SpecializedBankType[model?.type]?.toLowerCase();

    return translate(`SB.txt_type_specialized_${enumType}`);
  }, [model?.type, translate]);

  const startDate: string = useMemo(() => {
    return isNull(model?.startDate)
      ? ""
      : dayjs(model?.startDate)
          .add(VIETNAMESE_TIME_ZONE_OFFSET, "hour")
          .format(STANDARD_DATE_FORMAT_SLASH);
  }, [model?.startDate]);

  const endDate: string = useMemo(() => {
    return isNull(model?.endDate)
      ? ""
      : dayjs(model?.endDate)
          .add(VIETNAMESE_TIME_ZONE_OFFSET, "hour")
          .format(STANDARD_DATE_FORMAT_SLASH);
  }, [model?.endDate]);

  const MainSection = () => {
    const isActive = isEqual(model?.isActive, true);
    const translatedKey = isActive
      ? "CM.txt_status_active"
      : "CM.txt_status_deactivate";
    const value = translate(translatedKey);
    const statusValue = isActive ? "SUCCESS" : "DEFAULT";
    return (
      <div className="specialized-bank__main-section">
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
      <div className="specialized-bank__seconds-section">
        {/* Type */}
        {makeSection(translate("SB.txt_specialized_bank_type"), type)}
        {/* Start date */}

        {makeSection(translate("CM.txt_start_date"), startDate)}
        {/* End Date */}

        {makeSection(translate("CM.txt_end_date"), endDate)}
      </div>
    );
  };

  return (
    <Modal
      open
      isShowButtonCancel={false}
      isShowIconBack={false}
      title={translate("SB.txt_view_detail_specialized_bank")}
      titleButtonApply={translate("CM.btn_close")}
      loading={isLoading}
      size={MODAL_WIDTH}
      handleSave={dismiss}
      handleCancel={dismiss}
    >
      <div className="specialized-bank__wrapper">
        {/* Main section */}
        <MainSection />
        {/* Second section */}
        <SecondSection />
      </div>
    </Modal>
  );
};
