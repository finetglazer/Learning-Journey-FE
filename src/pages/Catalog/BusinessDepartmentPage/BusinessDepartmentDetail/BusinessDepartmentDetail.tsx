/* eslint-disable import/no-unresolved */
import { LoadingCM } from "components";
import {
  DatePicker,
  FormItem,
  InputText,
  Modal,
  Select,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

import { Col, Row, Switch } from "antd";
import { utilService } from "core/services/common-services/util-service";
import { useContext } from "react";

import "./BusinessDepartmentDetail.scss";
import { useBusinessDepartmentDetailHook } from "./BusinessDepartmentDetailHook";
import {
  BusinessDepartmentMasterContext,
  BusinessDepartmentMasterContextModel,
} from "../BusinessDepartmentMaster/BusinessDepartmentMasterHook";
import dayjs from "dayjs";
import { BusinessUnitFilter } from "models/BusinessUnit";
import { businessDepartmentRepository } from "../BusinessDepartmentRepository";

const BusinessDepartmentDetail = () => {
  const [translate] = useTranslation();

  const {
    isOpenModal,
    detailModel: model,
    dispatchDetailModel: dispatchModel,
    handleCloseModal,
    handleLoadList,
  } = useContext<BusinessDepartmentMasterContextModel>(
    BusinessDepartmentMasterContext
  );

  const {
    loading,
    handleChangeSingleField,
    handleChangeDateField,
    handleChangeSelectField,
    handleSave,
  } = useBusinessDepartmentDetailHook(
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
            ? `${translate("businessDepartments.update")}`
            : `${translate("businessDepartments.create")}`
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
              {translate("businessDepartments.status")}
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
              {translate("businessDepartments.active")}
            </span>
          </Col>
          <Col lg={24} className="m-b--xs">
            <FormItem
              validateObject={utilService.getValidateObj(model, "code")}
            >
              <InputText
                isRequired
                maxLength={50}
                label={translate("businessDepartments.code")}
                placeHolder={translate("businessDepartments.placeholder.code")}
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
                label={translate("businessDepartments.name")}
                placeHolder={translate("businessDepartments.placeholder.name")}
                value={model.name}
                onChange={handleChangeSingleField({
                  fieldName: "name",
                })}
              />
            </FormItem>
          </Col>

          <Col lg={24} className="m-b--xs">
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "businessUnitId"
              )}
            >
              <Select
                label={translate("businessDepartments.businessUnit")}
                placeHolder={translate(
                  "businessDepartments.placeholder.businessUnit"
                )}
                isRequired
                getList={businessDepartmentRepository.getDropdownBusinessUnit}
                value={
                  model?.businessUnit?.id
                    ? model?.businessUnit
                    : model?.businessUnitId
                    ? {
                        id: model?.businessUnitId,
                        name: model?.businessUnitName,
                        code: model?.businessUnitCode,
                      }
                    : undefined
                }
                classFilter={BusinessUnitFilter}
                onChange={handleChangeSelectField({
                  fieldName: "businessUnit",
                })}
                isSearch
                searchProperty="search"
                searchType={null}
                isEnumerable={false}
              />
            </FormItem>
          </Col>

          <Col lg={12} className="m-b--xs">
            <FormItem
              validateObject={utilService.getValidateObj(model, "startDate")}
            >
              <DatePicker
                isRequired
                label={translate("businessDepartments.startDate")}
                value={model.startDate ? dayjs(model.startDate) : null}
                placeholder={translate(
                  "businessDepartments.placeholder.startDate"
                )}
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
                label={translate("businessDepartments.endDate")}
                value={model.endDate ? dayjs(model.endDate) : null}
                placeholder={translate(
                  "businessDepartments.placeholder.endDate"
                )}
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

export default BusinessDepartmentDetail;
