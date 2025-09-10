/* eslint-disable import/no-unresolved */
import { LoadingCM } from "components";
import {
  EnumSelect,
  FormItem,
  InputNumber,
  InputText,
  Modal,
  TextArea,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { Col, Row, Switch } from "antd";
import { utilService } from "core/services/common-services/util-service";
import { useContext } from "react";
import "./TaxDetail.scss";
import { useTaxDetailHook } from "./TaxDetailHook";
import {
  TaxMasterContext,
  TaxMasterContextModel,
} from "../TaxMaster/TaxMasterHook";
import { getListTaxType, listTaxType } from "../TaxConstant";

const TaxDetail = () => {
  const [translate] = useTranslation();

  const {
    isOpenModal,
    detailModel: model,
    dispatchDetailModel: dispatchModel,
    handleCloseModal,
    handleResetList,
  } = useContext<TaxMasterContextModel>(TaxMasterContext);

  const { loading, handleChangeSingleField, handleSave } = useTaxDetailHook(
    model,
    dispatchModel,
    handleCloseModal,
    handleResetList
  );

  return (
    <>
      <Modal
        open={isOpenModal}
        title={
          model?.id
            ? `${translate("taxs.update")}`
            : `${translate("taxs.create")}`
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
          <Col lg={24} className="m-b--sm d-flex">
            <div className={"label-title m-r--xs"}>
              {translate("taxs.status")}
            </div>
            <Switch
              checked={model.isActive}
              onChange={(checked) => {
                handleChangeSingleField({
                  fieldName: "isActive",
                })(checked);
              }}
              className={"switch_status"}
            />
            <span className="m-l--xs">{translate("taxs.active")}</span>
          </Col>
          <Col lg={12} className="m-b--xs">
            <FormItem
              validateObject={utilService.getValidateObj(model, "taxType")}
            >
              <EnumSelect
                label={translate("taxs.taxType")}
                placeHolder={translate("taxs.placeholder.taxType")}
                type={1}
                isRequired
                getList={getListTaxType}
                value={
                  typeof model?.taxType === "number"
                    ? {
                        id: Number(model?.taxType),
                        name: listTaxType[Number(model?.taxType)]?.name,
                      }
                    : null
                }
                onChange={(id) => {
                  handleChangeSingleField({
                    fieldName: "taxType",
                  })(Number(id));
                }}
              />
            </FormItem>
          </Col>
          <Col lg={12} className="m-b--xs">
            <FormItem
              validateObject={utilService.getValidateObj(model, "code")}
            >
              <InputText
                isRequired
                maxLength={50}
                label={translate("taxs.code")}
                placeHolder={translate("taxs.placeholder.code")}
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
                label={translate("taxs.name")}
                placeHolder={translate("taxs.placeholder.name")}
                value={model.name}
                onChange={handleChangeSingleField({
                  fieldName: "name",
                })}
              />
            </FormItem>
          </Col>

          <Col lg={12} className="m-b--xs">
            <FormItem
              validateObject={utilService.getValidateObj(model, "rate")}
            >
              <InputNumber
                isRequired
                label={translate("taxs.rate")}
                placeHolder={translate("taxs.placeholder.rate")}
                value={model.rate}
                onChange={handleChangeSingleField({
                  fieldName: "rate",
                })}
                max={100}
              />
            </FormItem>
          </Col>

          <Col lg={24} className="m-b--xs">
            <FormItem
              validateObject={utilService.getValidateObj(model, "description")}
            >
              <TextArea
                maxLength={500}
                label={translate("taxs.description")}
                placeHolder={translate("taxs.placeholder.description")}
                value={model.description}
                onChange={handleChangeSingleField({
                  fieldName: "description",
                })}
                translate={translate}
                showCount
              />
            </FormItem>
          </Col>
        </Row>
      </Modal>
      {loading && <LoadingCM />}
    </>
  );
};

export default TaxDetail;
