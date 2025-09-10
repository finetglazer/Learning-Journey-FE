/* eslint-disable import/no-unresolved */
import { LoadingCM } from "components";
import {
  Checkbox,
  FormItem,
  InputText,
  Modal,
  TextArea,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { Col, Row, Switch } from "antd";
import { utilService } from "core/services/common-services/util-service";
import { useContext } from "react";
import "./UnitOfMeasureDetail.scss";
import { useUnitOfMeasureDetailHook } from "./UnitOfMeasureDetailHook";
import {
  UnitOfMeasureMasterContext,
  UnitOfMeasureMasterContextModel,
} from "../UnitOfMeasureMaster/UnitOfMeasureMasterHook";

const UnitOfMeasureDetail = () => {
  const [translate] = useTranslation();

  const {
    isOpenModal,
    detailModel: model,
    dispatchDetailModel: dispatchModel,
    handleCloseModal,
    handleLoadList,
  } = useContext<UnitOfMeasureMasterContextModel>(UnitOfMeasureMasterContext);

  const { loading, handleChangeSingleField, handleSave } =
    useUnitOfMeasureDetailHook(
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
            ? `${translate("unitOfMeasures.update")}`
            : `${translate("unitOfMeasures.create")}`
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
          <Col lg={12} className="m-b--sm d-flex">
            <div className={"label-title m-r--xs"}>
              {translate("goodServiceTypes.status")}
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
              {translate("goodServiceTypes.active")}
            </span>
          </Col>

          <Col lg={12} className="m-b--sm">
            <Checkbox
              label={translate("unitOfMeasures.isDecimal")}
              checked={model.isDecimal}
              onChange={handleChangeSingleField({
                fieldName: "isDecimal",
              })}
            />
          </Col>
          <Col lg={12} className="m-b--xs">
            <FormItem
              validateObject={utilService.getValidateObj(model, "code")}
            >
              <InputText
                isRequired
                maxLength={50}
                label={translate("unitOfMeasures.code")}
                placeHolder={translate("unitOfMeasures.placeholder.code")}
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
                label={translate("unitOfMeasures.name")}
                placeHolder={translate("unitOfMeasures.placeholder.name")}
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
                label={translate("unitOfMeasures.description")}
                placeHolder={translate(
                  "unitOfMeasures.placeholder.description"
                )}
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

export default UnitOfMeasureDetail;
