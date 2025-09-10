/* eslint-disable import/no-unresolved */
import { LoadingCM } from "components";
import {
  FormItem,
  Modal,
  Select,
  TextArea,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { Col, Row, Switch } from "antd";
import { utilService } from "core/services/common-services/util-service";
import { useContext } from "react";
import "./SignatureConfigDetail.scss";

import {
  SignatureConfigMasterContext,
  SignatureConfigMasterContextModel,
} from "../SignatureConfigMaster/SignatureConfigMasterHook";
import { useSignatureConfigDetailHook } from "./SignatureConfigDetailHook";
import { AppUserFilter } from "models/AppUser";
import { signatureConfigRepository } from "../SignatureConfigRepository";
import { SignatureSupplierFilter } from "models/SignatureSupplier";

const SignatureConfigDetail = () => {
  const [translate] = useTranslation();

  const {
    isOpenModal,
    detailModel: model,
    dispatchDetailModel: dispatchModel,
    handleCloseModal,
    handleLoadList,
  } = useContext<SignatureConfigMasterContextModel>(
    SignatureConfigMasterContext
  );

  const {
    loading,
    handleChangeSingleField,
    handleChangeSelectField,
    handleSave,
  } = useSignatureConfigDetailHook(
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
            ? `${translate("signatureConfigs.update")}`
            : `${translate("signatureConfigs.create")}`
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
              {translate("signatureConfigs.status")}
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
              {translate("signatureConfigs.active")}
            </span>
          </Col>

          <Col lg={24} className="m-b--xs">
            <FormItem
              validateObject={utilService.getValidateObj(model, "userId")}
            >
              <Select
                isSmall={false}
                isRequired
                label={translate("signatureConfigs.user")}
                placeHolder={translate("signatureConfigs.placeholder.user")}
                classFilter={AppUserFilter}
                getList={signatureConfigRepository.listUser}
                value={model?.user}
                isEnumerable={false}
                isSearch
                searchProperty="search"
                searchType={null}
                onChange={handleChangeSelectField({
                  fieldName: "user",
                })}
                appendToBody
              />
            </FormItem>
          </Col>

          {/* <Col lg={24} className="m-b--xs">
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "citizenIdentification"
              )}
            >
              <InputText
                isRequired
                label={translate("signatureConfigs.citizenIdentification")}
                placeHolder={translate(
                  "signatureConfigs.placeholder.citizenIdentification"
                )}
                value={model.citizenIdentification}
                onChange={handleChangeSingleField({
                  fieldName: "citizenIdentification",
                })}
              />
            </FormItem>
          </Col> */}

          <Col lg={24} className="m-b--xs">
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "signatureSupplierId"
              )}
            >
              <Select
                isSmall={false}
                isRequired
                label={translate("signatureConfigs.signatureSupplier")}
                placeHolder={translate(
                  "signatureConfigs.placeholder.signatureSupplier"
                )}
                classFilter={SignatureSupplierFilter}
                getList={signatureConfigRepository.listSignaturesupplier}
                value={
                  model?.signatureSupplier
                    ? model?.signatureSupplier
                    : model?.signatureSupplierName
                    ? {
                        id: model?.signatureSupplierName,
                        name: model?.signatureSupplierName,
                      }
                    : null
                }
                isEnumerable={false}
                onChange={handleChangeSelectField({
                  fieldName: "signatureSupplier",
                })}
                appendToBody
                isSearch
                searchProperty="search"
                searchType={null}
              />
            </FormItem>
          </Col>

          <Col lg={24} className="m-b--xs">
            <FormItem
              validateObject={utilService.getValidateObj(model, "description")}
            >
              <TextArea
                maxLength={500}
                label={translate("signatureConfigs.description")}
                placeHolder={translate(
                  "signatureConfigs.placeholder.description"
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

export default SignatureConfigDetail;
