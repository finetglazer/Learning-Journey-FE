/* eslint-disable import/no-unresolved */
import { LoadingCM } from "components";
import {
  Button,
  FormItem,
  InputText,
  Modal,
  Select,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { Col, Row, Switch } from "antd";
import { utilService } from "core/services/common-services/util-service";
import React, { useContext } from "react";
import "./UnitOfMeasureGroupDetail.scss";
import { useUnitOfMeasureGroupDetailHook } from "./UnitOfMeasureGroupDetailHook/UnitOfMeasureGroupDetailHook";
import {
  UnitOfMeasureGroupMasterContext,
  UnitOfMeasureGroupMasterContextModel,
} from "../UnitOfMeasureGroupMaster/UnitOfMeasureGroupMasterHook";
import { UnitOfMeasure, UnitOfMeasureFilter } from "models/UnitOfMeasure";
import useUnitOfMeasureGroupContentHook from "./UnitOfMeasureGroupDetailHook/UnitOfMeasureGroupContentHook";
import { Add } from "@carbon/icons-react";
import { UnitOfMeasureGroupContent } from "models/UnitOfMeasureGroupContent";
import _ from "lodash";
import { unitOfMeasureGroupRepository } from "../UnitOfMeasureGroupRepository";

const UnitOfMeasureGroupDetail = () => {
  const [translate] = useTranslation();

  const {
    isOpenModal,
    detailModel: model,
    dispatchDetailModel: dispatchModel,
    handleCloseModal,
    handleLoadList,
  } = useContext<UnitOfMeasureGroupMasterContextModel>(
    UnitOfMeasureGroupMasterContext
  );

  const { loading, handleChangeSingleField, handleChangeAllField, handleSave } =
    useUnitOfMeasureGroupDetailHook(
      model,
      dispatchModel,
      handleCloseModal,
      handleLoadList
    );

  const { uomGroupContents, uomGroupContentColumns, handleAddNewContent } =
    useUnitOfMeasureGroupContentHook(model, handleChangeAllField, "edit");

  const handleChangeBaseUOM = React.useCallback(
    (id: number, T?: UnitOfMeasure) => {
      const cloneModel = _.cloneDeep(model);
      if (
        !cloneModel?.unitOfMeasureId ||
        cloneModel?.unitOfMeasureId !== id.toString()
      ) {
        cloneModel.unitOfMeasureId = id.toString();
        cloneModel.unitOfMeasureName = T?.name;
        const newContent: UnitOfMeasureGroupContent = {
          ...new UnitOfMeasureGroupContent(),
          baseUnit: T?.name,
          conversionUnit: T?.id,
          coefficientValue: 1,
          conversionUnitName: T?.name,
        };
        cloneModel.unitOfMeasureGroupContents = [...[], newContent];
        handleChangeAllField(cloneModel);
      }
    },
    [handleChangeAllField, model]
  );

  return (
    <>
      <Modal
        open={isOpenModal}
        title={
          model?.id
            ? `${translate("unitOfMeasureGroups.update")}`
            : `${translate("unitOfMeasureGroups.create")}`
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
              {translate("unitOfMeasureGroups.status")}
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
              {translate("unitOfMeasureGroups.active")}
            </span>
          </Col>

          <Col lg={12} className="m-b--xs">
            <FormItem
              validateObject={utilService.getValidateObj(model, "code")}
            >
              <InputText
                isRequired
                maxLength={50}
                label={translate("unitOfMeasureGroups.code")}
                placeHolder={translate("unitOfMeasureGroups.placeholder.code")}
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
                label={translate("unitOfMeasureGroups.name")}
                placeHolder={translate("unitOfMeasureGroups.placeholder.name")}
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
                "unitOfMeasureId"
              )}
            >
              <Select
                label={translate("unitOfMeasureGroups.unitOfMeasure")}
                placeHolder={translate(
                  "unitOfMeasureGroups.placeholder.unitOfMeasure"
                )}
                isRequired
                getList={unitOfMeasureGroupRepository.getDropdownUnitOfMeasure}
                value={
                  model?.unitOfMeasureId
                    ? {
                        id: model?.unitOfMeasureId,
                        name: model?.unitOfMeasureName,
                      }
                    : undefined
                }
                classFilter={UnitOfMeasureFilter}
                onChange={handleChangeBaseUOM}
                isSearch
                searchProperty="search"
                searchType={null}
                isEnumerable={false}
                valueFilter={{
                  ...new UnitOfMeasureFilter(),
                  isActive: true,
                  pageIndex: 1,
                  pageSize: 20,
                }}
              />
            </FormItem>
          </Col>

          <Col lg={24} className="m-b--xs m-t--xs">
            <Button
              type="tertiary"
              icon={<Add />}
              iconPlace="left"
              onClick={handleAddNewContent}
              disabled={!model?.unitOfMeasureId}
            >
              {translate("unitOfMeasureGroups.addContent")}
            </Button>
          </Col>
          <Col lg={24} className="m-b--xs">
            <StandardTable
              rowKey="id"
              isDragable
              columns={uomGroupContentColumns}
              dataSource={uomGroupContents}
            />
          </Col>
        </Row>
      </Modal>
      {loading && <LoadingCM />}
    </>
  );
};

export default UnitOfMeasureGroupDetail;
