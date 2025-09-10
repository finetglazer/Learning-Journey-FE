import {
  FormItem,
  InputNumber,
  Modal,
  TextArea,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  SupplierEvaluationConfigDetailContext,
  SupplierEvaluationConfigDetailContextModel,
} from "../SupplierEvaluationConfigDetailHook"; // Replace with the actual path to the context
import { useContext } from "react";
import { Col, Row } from "antd";
import { utilService } from "core/services/common-services/util-service";

export const EvaluationResultModalModal = () => {
  const {
    isOpenResultContent,
    handleCloseDetailContent,
    handleSaveContentModal,
    targetResult,
    handleChangeSimpleFieldContent,
  } = useContext<SupplierEvaluationConfigDetailContextModel>(
    SupplierEvaluationConfigDetailContext
  );

  const [translate] = useTranslation();
  return (
    <Modal
      open={isOpenResultContent}
      title={
        !targetResult?.id
          ? `${translate("supplierEvaluationConfigs.detailResultModal.create")}`
          : `${translate("supplierEvaluationConfigs.detailResultModal.detail")}`
      }
      size={800}
      centered
      titleButtonApply={translate("generalActions.save")}
      titleButtonCancel={translate("generalActions.close")}
      handleCancel={() => handleCloseDetailContent("Result")}
      onCancel={() => handleCloseDetailContent("Result")}
      handleSave={() => handleSaveContentModal("Result")}
      isShowIconBack={true}
    >
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="p-x--sm">
        <Col lg={12} className="m-b--sm">
          <FormItem
            validateObject={utilService.getValidateObj(
              targetResult,
              "fromScore"
            )}
          >
            <InputNumber
              isRequired
              label={translate(
                "supplierEvaluationConfigs.detailResultModal.score"
              )}
              placeHolder={translate(
                "supplierEvaluationConfigs.detailResultModal.placeholderfromScore"
              )}
              value={targetResult.fromScore}
              onChange={handleChangeSimpleFieldContent("Result", "fromScore")}
              numberType={"DECIMAL"}
              allowNegative
              max={10}
            />
          </FormItem>
        </Col>

        <Col lg={12} className="m-b--sm m-t--lg">
          <FormItem
            validateObject={utilService.getValidateObj(targetResult, "toScore")}
          >
            <InputNumber
              placeHolder={translate(
                "supplierEvaluationConfigs.detailResultModal.placeholdertoScore"
              )}
              value={targetResult.toScore}
              onChange={handleChangeSimpleFieldContent("Result", "toScore")}
              numberType={"DECIMAL"}
              allowNegative
              max={10}
            />
          </FormItem>
        </Col>

        <Col lg={24} className="m-b--sm">
          <FormItem
            validateObject={utilService.getValidateObj(
              targetResult,
              "conclude"
            )}
          >
            <TextArea
              showCount
              isRequired
              label={translate(
                "supplierEvaluationConfigs.detailResultModal.conclude"
              )}
              placeHolder={translate(
                "supplierEvaluationConfigs.detailResultModal.placeholderConclude"
              )}
              value={targetResult.conclude}
              onChange={handleChangeSimpleFieldContent("Result", "conclude")}
              maxLength={500}
              resize="none"
              translate={translate}
            />
          </FormItem>
        </Col>
      </Row>
    </Modal>
  );
};
