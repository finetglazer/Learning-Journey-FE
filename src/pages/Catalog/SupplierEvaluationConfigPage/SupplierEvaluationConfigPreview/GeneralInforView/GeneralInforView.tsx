import { Col, Row } from "antd";
import { formatNumber } from "core/helpers/number";
import { isEqual } from "lodash";
import { SupplierEvaluationConfig } from "models/SupplierEvaluationConfig";
import { Tag } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import "./GeneralInforView.scss";

interface GeneralInforViewProps {
  model: SupplierEvaluationConfig;
}

const GeneralInforView = (props: GeneralInforViewProps) => {
  const [translate] = useTranslation();
  const { model } = props;
  const renderStatusDetail = () => {
    return (
      <Tag
        value={
          isEqual(model?.isActive, true)
            ? translate("supplierEvaluationConfigs.active")
            : translate("supplierEvaluationConfigs.inactive")
        }
        size="sm"
        status={isEqual(model?.isActive, true) ? "SUCCESS" : "DEFAULT"}
        isShowBorder
        isShowDot={false}
      />
    );
  };

  return (
    <div className="supplier-evaluation-config__preview m-l--xs m-r--xs">
      <Row>
        <Col span={8}>
          <div className="supplier-evaluation-config__item">
            <span className="supplier-evaluation-config__item-label">
              {translate("supplierEvaluationConfigs.status")}
            </span>
            <span className="supplier-evaluation-config__item-description">
              {renderStatusDetail()}
            </span>
          </div>
        </Col>
        <Col span={8}>
          <div className="supplier-evaluation-config__item__gray">
            <span className="supplier-evaluation-config__item-label">
              {translate("supplierEvaluationConfigs.code")}
            </span>
            <span className="supplier-evaluation-config__item-description">
              {model?.code}
            </span>
          </div>
        </Col>

        <Col span={8}>
          <div className="supplier-evaluation-config__item__gray">
            <span className="supplier-evaluation-config__item-label">
              {translate("supplierEvaluationConfigs.maximumScore")}
            </span>
            <span className="supplier-evaluation-config__item-description">
              {model?.maximumScore && formatNumber(model?.maximumScore)}
            </span>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <div className="supplier-evaluation-config__item">
            <span className="supplier-evaluation-config__item-label">
              {translate("supplierEvaluationConfigs.name")}
            </span>
            <span className="supplier-evaluation-config__item-description">
              {model?.name}
            </span>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <div className="supplier-evaluation-config__item">
            <span className="supplier-evaluation-config__item-label">
              {translate("supplierEvaluationConfigs.description")}
            </span>
            <span className="supplier-evaluation-config__item-description">
              {model?.description}
            </span>
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default GeneralInforView;
