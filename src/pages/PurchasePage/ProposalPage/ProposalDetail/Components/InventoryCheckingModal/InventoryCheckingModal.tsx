import {
  Modal,
  Pagination,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

import { useContext } from "react";
import { Col, Row } from "antd";
import { isEmpty } from "lodash";
import { DEFAULT_PAGE_SIZE_OPTION } from "core/config/consts";
import {
  InventoryCheckingContext,
  InventoryCheckingContextModel,
} from "./InventoryCheckingModalHook";
import { tableService } from "core/services/page-services/table-service";

export const InventoryCheckingModal = () => {
  const {
    visible,
    columns,
    countContent,
    listContent,
    handleCloseModal,
    loadingList,
    handleLoadListContent,
    modelFilter,
    dispatchFilter,
  } = useContext<InventoryCheckingContextModel>(InventoryCheckingContext);

  const [translate] = useTranslation();

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadListContent
  );

  return (
    <Modal
      open={visible}
      title={translate("inventoryCheckings.title")}
      size={800}
      centered
      titleButtonCancel={translate("generalActions.close")}
      handleCancel={handleCloseModal}
      onCancel={handleCloseModal}
      isShowIconBack={true}
      isShowButtonApply={false}
    >
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="p-x--sm">
        <Col lg={24} className="m-b--sm">
          <StandardTable
            rowKey="id"
            isDragable
            loading={loadingList}
            columns={columns}
            dataSource={listContent}
            onChange={handleTableChange}
            rowSelection={null}
            scroll={{ y: "calc(100vh - 500px)" }}
          />
          {isEmpty(listContent) ? null : (
            <div className="page-master__pagination">
              <Pagination
                pageIndex={modelFilter.pageIndex}
                pageSize={modelFilter.pageSize}
                total={countContent}
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
