/* eslint-disable import/no-unresolved */
import { LoadingCM } from "components";
import {
  FormItem,
  InputText,
  Modal,
  TextArea,
  TreeSelect,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { Col, Row, Switch } from "antd";
import { utilService } from "core/services/common-services/util-service";
import { useContext } from "react";
import "./GoodsServicesCategoryDetail.scss";
import { useGoodsServicesCategoryDetailHook } from "./GoodsServicesCategoryDetailHook";
import {
  GoodsServicesCategoryMasterContext,
  GoodsServicesCategoryMasterContextModel,
} from "../GoodsServicesCategoryMaster/GoodsServicesCategoryMasterHook";
import { GoodsServicesCategoryFilter } from "models/GoodsServicesCategory";
import { goodsServicesCategoryRepository } from "../GoodsServicesCategoryRepository";
import { isArray } from "lodash";

const GoodsServicesCategoryDetail = () => {
  const [translate] = useTranslation();

  const {
    isOpenModal,
    detailModel: model,
    dispatchDetailModel: dispatchModel,
    handleCloseModal,
    handleResetList,
  } = useContext<GoodsServicesCategoryMasterContextModel>(
    GoodsServicesCategoryMasterContext
  );

  const {
    loading,
    handleChangeSingleField,
    handleChangeTreeField,
    handleSave,
  } = useGoodsServicesCategoryDetailHook(
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
            ? `${translate("goodsServiceCategories.update")}`
            : `${translate("goodsServiceCategories.create")}`
        }
        size={800}
        centered
        titleButtonApply={translate("generalActions.save")}
        titleButtonCancel={translate("generalActions.close")}
        handleCancel={handleCloseModal}
        onCancel={handleCloseModal}
        handleSave={handleSave}
        loading={loading}
        isShowIconBack={false}
      >
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="p-x--sm">
          <Col lg={24} className="m-b--sm d-flex">
            <div className={"label-title m-r--xs"}>
              {translate("goodsServiceCategories.status")}
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
              {translate("goodsServiceCategories.active")}
            </span>
          </Col>
          <Col lg={12} className="m-b--xs">
            <FormItem
              validateObject={utilService.getValidateObj(model, "code")}
            >
              <InputText
                isRequired
                maxLength={50}
                label={translate("goodsServiceCategories.code")}
                placeHolder={translate(
                  "goodsServiceCategories.placeholder.code"
                )}
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
                label={translate("goodsServiceCategories.name")}
                placeHolder={translate(
                  "goodsServiceCategories.placeholder.name"
                )}
                value={model.name}
                onChange={handleChangeSingleField({
                  fieldName: "name",
                })}
              />
            </FormItem>
          </Col>

          <Col span={24} className="p-r--xs">
            <FormItem
              validateObject={utilService.getValidateObj(model, "parentId")}
            >
              <TreeSelect
                label={translate("goodsServiceCategories.parent")}
                placeHolder={translate(
                  "goodsServiceCategories.placeholder.parent"
                )}
                searchProperty="search"
                type={1}
                selectable={true}
                checkable={false}
                isUsingSearch
                searchType={null}
                classFilter={GoodsServicesCategoryFilter}
                valueFilter={{
                  ...new GoodsServicesCategoryFilter(),
                  levels: [1, 2],
                }}
                getTreeData={goodsServicesCategoryRepository.getDropdown}
                item={
                  model?.parent?.id
                    ? model?.parent
                    : model?.parentId
                    ? {
                        id: model?.parentId,
                        name: model?.parentName,
                        code: model?.parentCode,
                      }
                    : null
                }
                onChange={handleChangeTreeField({
                  fieldName: "parent",
                })}
                render={(gsc) => {
                  return gsc?.id ? `${gsc?.code} - ${gsc?.name}` : null;
                }}
                disabled={
                  isArray(model?.children) && model?.children?.length > 0
                    ? true
                    : false
                }
              />
            </FormItem>
          </Col>

          <Col lg={24} className="m-b--xs m-t--xs">
            <FormItem
              validateObject={utilService.getValidateObj(model, "description")}
            >
              <TextArea
                maxLength={500}
                label={translate("goodsServiceCategories.description")}
                placeHolder={translate(
                  "goodsServiceCategories.placeholder.description"
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

export default GoodsServicesCategoryDetail;
