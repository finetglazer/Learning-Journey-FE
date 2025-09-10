/* eslint-disable import/no-unresolved */
import { Col, Row, Switch } from "antd";
import { LoadingCM } from "components";
import { utilService } from "core/services/common-services/util-service";
import { CostType, CostTypeFilter } from "models/CostType";
import { useContext } from "react";
import {
  FormItem,
  InputText,
  Modal,
  Select,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  CostItemMasterContext,
  CostItemMasterContextModel,
} from "../CostItemMaster/CostItemMasterHook";
import "./CostItemDetail.scss";
import { useCostItemDetailHook } from "./CostItemDetailHook";
import { costItemRepository } from "../CostItemRepository";

const CostItemDetail = () => {
  const [translate] = useTranslation();

  const {
    isOpenModal,
    detailModel: model,
    dispatchDetailModel: dispatchModel,
    handleCloseModal,
    handleLoadList,
  } = useContext<CostItemMasterContextModel>(CostItemMasterContext);

  const { loading, handleChangeSingleField, handleChangeAllField, handleSave } =
    useCostItemDetailHook(
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
            ? `${translate("costItems.update")}`
            : `${translate("costItems.create")}`
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
              {translate("costItems.status")}
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
            <span className="m-l--xs">{translate("costItems.active")}</span>
          </Col>
          <Col lg={12} className="m-b--xs">
            <FormItem
              validateObject={utilService.getValidateObj(model, "code")}
            >
              <InputText
                isRequired
                maxLength={50}
                label={translate("costItems.code")}
                placeHolder={translate("costItems.placeholder.code")}
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
                label={translate("costItems.name")}
                placeHolder={translate("costItems.placeholder.name")}
                value={model.name}
                onChange={handleChangeSingleField({
                  fieldName: "name",
                })}
              />
            </FormItem>
          </Col>

          <Col lg={24} className="m-b--sm">
            <FormItem
              validateObject={utilService.getValidateObj(model, "costTypeId")}
            >
              <Select
                isRequired
                label={translate("costItems.costType")}
                placeHolder={translate("costItems.placeholder.costType")}
                getList={costItemRepository.getDropdownCostType}
                value={
                  model?.costType
                    ? model?.costType
                    : model?.costTypeName && model?.costTypeCode
                    ? {
                        id: model?.costType,
                        name: model?.costTypeName,
                        code: model?.costTypeCode,
                      }
                    : null
                }
                classFilter={CostTypeFilter}
                valueFilter={{
                  ...new CostTypeFilter(),
                  pageSize: 20,
                  pageIndex: 1,
                }}
                onChange={(id: number, T?: CostType) => {
                  handleChangeAllField({
                    ...model,
                    costTypeId: id,
                    costType: T,
                    costTypeName: T?.name,
                    costTypeCode: T?.code,
                  });
                }}
                isSearch
                searchProperty="search"
                searchType={null}
                isEnumerable={false}
                render={(costType) => {
                  return costType?.id
                    ? `${costType?.code}-${costType?.name}`
                    : null;
                }}
              />
            </FormItem>
          </Col>
        </Row>
      </Modal>
      {loading && <LoadingCM />}
    </>
  );
};

export default CostItemDetail;
