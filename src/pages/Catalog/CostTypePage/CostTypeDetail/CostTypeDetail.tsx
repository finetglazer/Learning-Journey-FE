/* eslint-disable import/no-unresolved */
import { Col, Row, Switch } from "antd";
import { LoadingCM } from "components";
import { utilService } from "core/services/common-services/util-service";
import { useContext } from "react";
import { FormItem, InputText, Modal } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  CostTypeMasterContext,
  CostTypeMasterContextModel,
} from "../CostTypeMaster/CostTypeMasterHook";
import "./CostTypeDetail.scss";
import { useCostTypeDetailHook } from "./CostTypeDetailHook";

const CostTypeDetail = () => {
  const [translate] = useTranslation();

  const {
    isOpenModal,
    detailModel: model,
    dispatchDetailModel: dispatchModel,
    handleCloseModal,
    handleLoadList,
  } = useContext<CostTypeMasterContextModel>(CostTypeMasterContext);

  const { loading, handleChangeSingleField, handleSave } =
    useCostTypeDetailHook(
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
            ? `${translate("costTypes.update")}`
            : `${translate("costTypes.create")}`
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
              {translate("costTypes.status")}
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
            <span className="m-l--xs">{translate("costTypes.active")}</span>
          </Col>
          <Col lg={24} className="m-b--xs">
            <FormItem
              validateObject={utilService.getValidateObj(model, "code")}
            >
              <InputText
                isRequired
                maxLength={50}
                label={translate("costTypes.code")}
                placeHolder={translate("costTypes.placeholder.code")}
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
                label={translate("costTypes.name")}
                placeHolder={translate("costTypes.placeholder.name")}
                value={model.name}
                onChange={handleChangeSingleField({
                  fieldName: "name",
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

export default CostTypeDetail;
