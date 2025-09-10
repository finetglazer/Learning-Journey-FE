import {
  InputText,
  Modal,
  MultipleSelect,
  Pagination,
  StandardTable,
  TreeSelect,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  CostItemGoodsServicesDetailContext,
  CostItemGoodsServicesDetailContextModel,
} from "../CostItemGoodsServicesDetailHook"; // Replace with the actual path to the context
import { useContext } from "react";
import { Col, Row } from "antd";
import { IcSearchSVG } from "assets/icons";
import { isEmpty } from "lodash";
import { DEFAULT_PAGE_SIZE_OPTION } from "core/config/consts";
import { GoodServiceTypeFilter } from "models/GoodServiceType";
import { costItemGoodsServicesRepository } from "../../CostItemGoodsServicesRepository";

export const GoodsServicesSelectModal = () => {
  const {
    visibleCostItem,
    handleSaveGoodsServicesModal,
    handleCloseGoodsServicesModal,
    run,
    handleChangeCategoryFilter,
    handleChangeTypeFilter,
    costItemFilter,
    loadingList,
    goodsServicesModalColumn,
    costItemList,
    costItemCount,
    handlePagination,
    handleTableChange,
    rowSelection,
  } = useContext<CostItemGoodsServicesDetailContextModel>(
    CostItemGoodsServicesDetailContext
  );

  const [translate] = useTranslation();
  return (
    <Modal
      open={visibleCostItem}
      title={`${translate("costItemGoodsServices.selectGoodsServices")}`}
      size={900}
      centered
      titleButtonApply={translate("generalActions.save")}
      titleButtonCancel={translate("generalActions.close")}
      handleCancel={handleCloseGoodsServicesModal}
      onCancel={handleCloseGoodsServicesModal}
      handleSave={handleSaveGoodsServicesModal}
      isShowIconBack={true}
    >
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="p-x--sm">
        <Col lg={12} className="m-b--sm">
          <InputText
            prefix={<img src={IcSearchSVG} alt="ic_search" width={16} />}
            value={costItemFilter.search}
            placeHolder={translate("generalActions.placeholder.search")}
            onChange={run}
            type={1}
            isSmall
          />
        </Col>
        <Col lg={6} className="m-b--sm">
          <TreeSelect
            placeHolder={translate(
              "goodsServices.placeholder.goodsServiceCategory"
            )}
            searchProperty="search"
            type={1}
            selectable={false}
            checkable={true}
            isUsingSearch
            searchType={null}
            isSmall
            classFilter={GoodServiceTypeFilter}
            getTreeData={
              costItemGoodsServicesRepository.getDropdownGoodsServicesCategory
            }
            listItem={costItemFilter.goodsServicesCategoryValue || []}
            onChange={handleChangeCategoryFilter}
          />
        </Col>
        <Col lg={6} className="m-b--sm">
          <MultipleSelect
            values={costItemFilter?.goodsServicesTypeValue || []}
            placeHolder={translate(
              "goodsServices.placeholder.goodsServicesType"
            )}
            getList={costItemGoodsServicesRepository.getDropdownGoodServiceType}
            classFilter={GoodServiceTypeFilter}
            onChange={handleChangeTypeFilter}
            isSmall={true}
            searchProperty="search"
            searchType={null}
            isEnumerable={false}
            appendToBody
          />
        </Col>
        <Col lg={24} className="m-b--sm">
          <StandardTable
            rowKey="id"
            isDragable
            loading={loadingList}
            columns={goodsServicesModalColumn}
            dataSource={costItemList}
            onChange={handleTableChange}
            rowSelection={rowSelection}
            scroll={{ y: "calc(100vh - 500px)" }}
          />
          {isEmpty(costItemList) && !isEmpty(costItemFilter.search) ? null : (
            <div className="page-master__pagination">
              <Pagination
                pageIndex={costItemFilter.pageIndex}
                pageSize={costItemFilter.pageSize}
                total={costItemCount}
                onChange={handlePagination}
                pageSizeOptions={DEFAULT_PAGE_SIZE_OPTION}
              />
            </div>
          )}
        </Col>
      </Row>
    </Modal>
  );
};
