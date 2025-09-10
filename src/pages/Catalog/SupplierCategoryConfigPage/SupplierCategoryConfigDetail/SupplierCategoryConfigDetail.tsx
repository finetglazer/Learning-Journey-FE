/* eslint-disable import/no-unresolved */
import { Col, Row } from "antd";
import { LoadingCM } from "components";
import { utilService } from "core/services/common-services/util-service";
import { useContext } from "react";
import {
  FormItem,
  InputNumber,
  InputText,
  Modal,
  TextArea,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import "./SupplierCategoryConfigDetail.scss";

import {
  SupplierCategoryConfigMasterContext,
  SupplierCategoryConfigMasterContextModel,
} from "../SupplierCategoryConfigMaster/SupplierCategoryConfigMasterHook";
import { useSupplierCategoryConfigDetailHook } from "./SupplierCategoryConfigDetailHook";
// import { useSupplierCategoryConfigDetailHook } from "./SupplierCategoryConfigDetailHook";

const SupplierCategoryConfigDetail = () => {
  const [translate] = useTranslation();

  const {
    isOpenModal,
    detailModel: model,
    dispatchDetailModel: dispatchModel,
    handleCloseModal,
    handleLoadList,
  } = useContext<SupplierCategoryConfigMasterContextModel>(
    SupplierCategoryConfigMasterContext
  );

  const { loading, handleChangeSingleField, handleSave } =
    useSupplierCategoryConfigDetailHook(
      model,
      dispatchModel,
      handleCloseModal,
      handleLoadList
    );

  return (
    <>
      <Modal
        open={isOpenModal}
        title={
          model?.id
            ? `${translate("supplierCategoryConfigs.update")}`
            : `${translate("supplierCategoryConfigs.create")}`
        }
        size={800}
        centered
        titleButtonApply={translate("generalActions.save")}
        titleButtonCancel={translate("generalActions.close")}
        handleCancel={() => handleCloseModal("detail")}
        onCancel={() => handleCloseModal("detail")}
        handleSave={handleSave}
        loading={loading}
        isShowIconBack={false}
      >
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="p-x--sm">
          <Col lg={12} className="m-b--xs">
            <FormItem
              validateObject={utilService.getValidateObj(model, "code")}
            >
              <InputText
                isRequired
                maxLength={50}
                label={translate("supplierCategoryConfigs.code")}
                placeHolder={translate(
                  "supplierCategoryConfigs.placeholder.code"
                )}
                value={model.code}
                onChange={handleChangeSingleField({
                  fieldName: "code",
                })}
              />
            </FormItem>
          </Col>

          <Col lg={12} className="m-b--xs">
            <FormItem
              validateObject={utilService.getValidateObj(model, "name")}
            >
              <InputText
                isRequired
                maxLength={500}
                label={translate("supplierCategoryConfigs.name")}
                placeHolder={translate(
                  "supplierCategoryConfigs.placeholder.name"
                )}
                value={model.name}
                onChange={handleChangeSingleField({
                  fieldName: "name",
                })}
              />
            </FormItem>
          </Col>

          <Col lg={12} className="m-b--xs">
            <FormItem
              validateObject={utilService.getValidateObj(model, "minScore")}
            >
              <InputNumber
                label={translate("supplierCategoryConfigs.fromScore")}
                placeHolder={translate(
                  "supplierCategoryConfigs.placeholder.fromScore"
                )}
                value={model?.minScore}
                onChange={handleChangeSingleField({
                  fieldName: "minScore",
                })}
                isSmall={false}
                max={10}
                numberType="DECIMAL"
                decimalDigit={4}
                isRequired
              />
            </FormItem>
          </Col>

          <Col lg={12} className="m-b--xs">
            <FormItem
              validateObject={utilService.getValidateObj(model, "maxScore")}
            >
              <InputNumber
                label={translate("supplierCategoryConfigs.toScore")}
                placeHolder={translate(
                  "supplierCategoryConfigs.placeholder.toScore"
                )}
                value={model?.maxScore}
                onChange={handleChangeSingleField({
                  fieldName: "maxScore",
                })}
                isSmall={false}
                max={10}
                numberType="DECIMAL"
                decimalDigit={4}
                isRequired
              />
            </FormItem>
          </Col>

          <Col lg={24} className="m-b--xs">
            <FormItem
              validateObject={utilService.getValidateObj(model, "description")}
            >
              <TextArea
                maxLength={500}
                label={translate("supplierCategoryConfigs.description")}
                placeHolder={translate(
                  "supplierCategoryConfigs.placeholder.description"
                )}
                value={model.description}
                onChange={handleChangeSingleField({
                  fieldName: "description",
                })}
                showCount
                translate={translate}
              />
            </FormItem>
          </Col>
        </Row>
      </Modal>
      {loading && <LoadingCM />}
    </>
  );
};

export default SupplierCategoryConfigDetail;
