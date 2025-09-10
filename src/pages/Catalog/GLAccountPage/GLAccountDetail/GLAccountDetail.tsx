/* eslint-disable import/no-unresolved */
import { LoadingCM } from "components";
import {
  DatePicker,
  FormItem,
  InputText,
  Modal,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

import { Col, Row, Switch } from "antd";
import { utilService } from "core/services/common-services/util-service";
import { useContext } from "react";

import "./GLAccountDetail.scss";
import { useGLAccountDetailHook } from "./GLAccountDetailHook";
import {
  GLAccountMasterContext,
  GLAccountMasterContextModel,
} from "../GLAccountMaster/GLAccountMasterHook";
import dayjs from "dayjs";

const GLAccountDetail = () => {
  const [translate] = useTranslation();

  const {
    isOpenModal,
    detailModel: model,
    dispatchDetailModel: dispatchModel,
    handleCloseModal,
    handleLoadList,
  } = useContext<GLAccountMasterContextModel>(GLAccountMasterContext);

  const {
    loading,
    handleChangeSingleField,
    handleChangeDateField,
    handleSave,
  } = useGLAccountDetailHook(
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
            ? `${translate("glAccounts.update")}`
            : `${translate("glAccounts.create")}`
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
              {translate("glAccounts.status")}
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
            <span className="m-l--xs">{translate("glAccounts.active")}</span>
          </Col>
          <Col lg={24} className="m-b--xs">
            <FormItem
              validateObject={utilService.getValidateObj(model, "code")}
            >
              <InputText
                isRequired
                maxLength={50}
                label={translate("glAccounts.code")}
                placeHolder={translate("glAccounts.placeholder.code")}
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
                maxLength={500}
                label={translate("glAccounts.name")}
                placeHolder={translate("glAccounts.placeholder.name")}
                value={model.name}
                onChange={handleChangeSingleField({
                  fieldName: "name",
                })}
              />
            </FormItem>
          </Col>

          <Col lg={12} className="m-b--xs">
            <FormItem
              validateObject={utilService.getValidateObj(model, "startDate")}
            >
              <DatePicker
                isRequired
                label={translate("glAccounts.startDate")}
                value={
                  model.startDate ? dayjs(model.startDate)?.utc(true) : null
                }
                placeholder={translate("glAccounts.placeholder.startDate")}
                size={"middle"}
                onChange={handleChangeDateField({
                  fieldName: "startDate",
                })}
              />
            </FormItem>
          </Col>

          <Col lg={12} className="m-b--xs">
            <FormItem
              validateObject={utilService.getValidateObj(model, "endDate")}
            >
              <DatePicker
                label={translate("glAccounts.endDate")}
                value={model.endDate ? dayjs(model.endDate)?.utc(true) : null}
                placeholder={translate("glAccounts.placeholder.endDate")}
                size={"middle"}
                onChange={handleChangeDateField({
                  fieldName: "endDate",
                })}
              />
            </FormItem>
          </Col>
        </Row>
      </Modal>
      {loading && <LoadingCM />}
    </>
  );
};

export default GLAccountDetail;
