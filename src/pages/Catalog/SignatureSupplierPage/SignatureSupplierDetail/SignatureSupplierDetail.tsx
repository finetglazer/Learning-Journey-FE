/* eslint-disable import/no-unresolved */
import { LoadingCM } from "components";
import {
  DatePicker,
  FormItem,
  InputText,
  Modal,
  TextArea,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { Col, Row, Switch } from "antd";
import { utilService } from "core/services/common-services/util-service";
import { useContext } from "react";
import "./SignatureSupplierDetail.scss";

import {
  SignatureSupplierMasterContext,
  SignatureSupplierMasterContextModel,
} from "../SignatureSupplierMaster/SignatureSupplierMasterHook";
import { useSignatureSupplierDetailHook } from "./SignatureSupplierDetailHook";
import dayjs from "dayjs";

const SignatureSupplierDetail = () => {
  const [translate] = useTranslation();

  const {
    isOpenModal,
    detailModel: model,
    dispatchDetailModel: dispatchModel,
    handleCloseModal,
    handleLoadList,
  } = useContext<SignatureSupplierMasterContextModel>(
    SignatureSupplierMasterContext
  );

  const {
    loading,
    handleChangeSingleField,
    handleChangeDateField,
    handleSave,
  } = useSignatureSupplierDetailHook(
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
            ? `${translate("signatureSuppliers.update")}`
            : `${translate("signatureSuppliers.create")}`
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
              {translate("signatureSuppliers.status")}
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
            <span className="m-l--xs">
              {translate("signatureSuppliers.active")}
            </span>
          </Col>
          <Col lg={24} className="m-b--xs">
            <FormItem
              validateObject={utilService.getValidateObj(model, "code")}
            >
              <InputText
                isRequired
                label={translate("signatureSuppliers.code")}
                placeHolder={translate("signatureSuppliers.placeholder.code")}
                value={model.code}
                onChange={handleChangeSingleField({
                  fieldName: "code",
                })}
              />
            </FormItem>
          </Col>

          <Col lg={24} className="m-b--xs">
            <FormItem
              validateObject={utilService.getValidateObj(model, "name")}
            >
              <InputText
                isRequired
                maxLength={255}
                label={translate("signatureSuppliers.name")}
                placeHolder={translate("signatureSuppliers.placeholder.name")}
                value={model.name}
                onChange={handleChangeSingleField({
                  fieldName: "name",
                })}
              />
            </FormItem>
          </Col>

          <Col lg={24} className="m-b--xs">
            <FormItem
              validateObject={utilService.getValidateObj(model, "description")}
            >
              <TextArea
                maxLength={500}
                label={translate("signatureSuppliers.description")}
                placeHolder={translate(
                  "signatureSuppliers.placeholder.description"
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

export default SignatureSupplierDetail;
