/* eslint-disable import/no-unresolved */
import { Col, Row, Switch } from "antd";
import { LoadingCM } from "components";
import { utilService } from "core/services/common-services/util-service";
import { useContext } from "react";
import {
  FormItem,
  InputText,
  Modal,
  TextArea,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  ContractMethodMasterContext,
  ContractMethodMasterContextModel,
} from "../ContractMethodMaster/ContractMethodMasterHook";
import "./ContractMethodDetail.scss";
import { useContractMethodDetailHook } from "./ContractMethodDetailHook";

const ContractMethodDetail = () => {
  const [translate] = useTranslation();

  const {
    isOpenModal,
    detailModel: model,
    dispatchDetailModel: dispatchModel,
    handleCloseModal,
    handleLoadList,
  } = useContext<ContractMethodMasterContextModel>(ContractMethodMasterContext);

  const { loading, handleChangeSingleField, handleSave } =
    useContractMethodDetailHook(
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
            ? `${translate("contractMethods.update")}`
            : `${translate("contractMethods.create")}`
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
              {translate("contractMethods.status")}
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
              {translate("contractMethods.active")}
            </span>
          </Col>
          <Col lg={24} className="m-b--xs">
            <FormItem
              validateObject={utilService.getValidateObj(model, "code")}
            >
              <InputText
                isRequired
                maxLength={50}
                label={translate("contractMethods.code")}
                placeHolder={translate("contractMethods.placeholder.code")}
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
                label={translate("contractMethods.name")}
                placeHolder={translate("contractMethods.placeholder.name")}
                value={model.name}
                onChange={handleChangeSingleField({
                  fieldName: "name",
                })}
              />
            </FormItem>
          </Col>

          <Col span={24} className="p-r--xs p-b--xs">
            <FormItem
              validateObject={utilService.getValidateObj(model, "description")}
            >
              <TextArea
                maxLength={500}
                label={translate("contractMethods.description")}
                placeHolder={translate(
                  "contractMethods.placeholder.description"
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

export default ContractMethodDetail;
