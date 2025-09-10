import {
  FormItem,
  InputNumber,
  InputText,
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

export const EvaluationItemModalModal = () => {
  const {
    isOpenItemContent,
    handleCloseDetailContent,
    handleSaveContentModal,
    targetItem,
    handleChangeSimpleFieldContent,
    maxWeight,
  } = useContext<SupplierEvaluationConfigDetailContextModel>(
    SupplierEvaluationConfigDetailContext
  );

  const [translate] = useTranslation();
  return (
    <Modal
      open={isOpenItemContent}
      title={
        !targetItem?.id
          ? `${translate("supplierEvaluationConfigs.detailItemModal.create")}`
          : `${translate("supplierEvaluationConfigs.detailItemModal.detail")}`
      }
      size={800}
      centered
      titleButtonApply={translate("generalActions.save")}
      titleButtonCancel={translate("generalActions.close")}
      handleCancel={() => handleCloseDetailContent("Item")}
      onCancel={() => handleCloseDetailContent("Item")}
      handleSave={() => handleSaveContentModal("Item")}
      isShowIconBack={true}
    >
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="p-x--sm">
        <Col lg={12} className="m-b--sm">
          <FormItem
            validateObject={utilService.getValidateObj(targetItem, "code")}
          >
            <InputText
              isRequired
              maxLength={500}
              label={translate(
                "supplierEvaluationConfigs.detailItemModal.code"
              )}
              placeHolder={translate(
                "supplierEvaluationConfigs.detailItemModal.placeholderCode"
              )}
              value={targetItem.code}
              onChange={handleChangeSimpleFieldContent("Item", "code")}
            />
          </FormItem>
        </Col>

        <Col lg={12} className="m-b--sm">
          <FormItem
            validateObject={utilService.getValidateObj(targetItem, "weight")}
          >
            <InputNumber
              isRequired
              label={translate(
                "supplierEvaluationConfigs.detailItemModal.weight"
              )}
              placeHolder={translate(
                "supplierEvaluationConfigs.detailItemModal.placeholderWeight"
              )}
              value={targetItem.weight}
              onChange={handleChangeSimpleFieldContent("Item", "weight")}
              max={maxWeight}
            />
          </FormItem>
        </Col>
        <Col lg={24} className="m-b--sm">
          <FormItem
            validateObject={utilService.getValidateObj(targetItem, "name")}
          >
            <InputText
              isRequired
              maxLength={500}
              label={translate(
                "supplierEvaluationConfigs.detailItemModal.name"
              )}
              placeHolder={translate(
                "supplierEvaluationConfigs.detailItemModal.placeholderName"
              )}
              value={targetItem.name}
              onChange={handleChangeSimpleFieldContent("Item", "name")}
            />
          </FormItem>
        </Col>

        <Col lg={24} className="m-b--sm">
          <FormItem
            validateObject={utilService.getValidateObj(targetItem, "standard")}
          >
            <TextArea
              showCount
              isRequired
              label={translate(
                "supplierEvaluationConfigs.detailItemModal.standard"
              )}
              placeHolder={translate(
                "supplierEvaluationConfigs.detailItemModal.placeholderStandard"
              )}
              value={targetItem.standard}
              onChange={handleChangeSimpleFieldContent("Item", "standard")}
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
