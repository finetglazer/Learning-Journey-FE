import {
  InputText,
  Modal,
  Pagination,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  CostLineCostItemDetailContext,
  CostLineCostItemDetailContextModel,
} from "../CostLineCostItemDetailHook"; // Replace with the actual path to the context
import { useContext } from "react";
import { Col, Row } from "antd";
import { IcSearchSVG } from "assets/icons";
import { isEmpty } from "lodash";
import { DEFAULT_PAGE_SIZE_OPTION } from "core/config/consts";

export const CostItemSelectModal = () => {
  const {
    visibleCostItem,
    handleSaveCostItemModal,
    handleCloseCostItemModal,
    run,
    costItemFilter,
    loadingList,
    costItemModalColumn,
    costItemList,
    costItemCount,
    handlePagination,
    handleTableChange,
    rowSelection,
  } = useContext<CostLineCostItemDetailContextModel>(
    CostLineCostItemDetailContext
  );

  const [translate] = useTranslation();
  return (
    <Modal
      open={visibleCostItem}
      title={`${translate("costLineCostItems.selectCostItem")}`}
      size={800}
      centered
      titleButtonApply={translate("generalActions.save")}
      titleButtonCancel={translate("generalActions.close")}
      handleCancel={handleCloseCostItemModal}
      onCancel={handleCloseCostItemModal}
      handleSave={handleSaveCostItemModal}
      isShowIconBack={true}
    >
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="p-x--sm">
        <Col lg={24} className="m-b--sm">
          <InputText
            prefix={<img src={IcSearchSVG} alt="ic_search" width={16} />}
            value={costItemFilter.search}
            placeHolder={translate("generalActions.placeholder.search")}
            onChange={run}
            type={1}
            isSmall
          />
        </Col>
        <Col lg={24} className="m-b--sm">
          <StandardTable
            rowKey="id"
            isDragable
            loading={loadingList}
            columns={costItemModalColumn}
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
