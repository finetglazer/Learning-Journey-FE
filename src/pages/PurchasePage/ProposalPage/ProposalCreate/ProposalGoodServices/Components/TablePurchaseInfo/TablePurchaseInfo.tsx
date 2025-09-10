import { DeleteRoundIcon, IcArrowDown } from "assets/icons";
import classNames from "classnames";
import { detectIntegerCurrency } from "core/helpers/currency";
import { listService } from "core/services/page-services/list-service";
import { isEmpty, isEqual, isNil } from "lodash";
import { VND_CURRENCY } from "models/Payment";
import { ProposalCreateModel } from "models/Proposal";
import {
  GoodServiceByCategory,
  GoodServiceExtend,
} from "models/Proposal/GoodService";
import { InventoryCheckingModal } from "pages/PurchasePage/ProposalPage/ProposalDetail/Components/InventoryCheckingModal/InventoryCheckingModal";
import {
  InventoryCheckingContext,
  useInventoryCheckingModal,
} from "pages/PurchasePage/ProposalPage/ProposalDetail/Components/InventoryCheckingModal/InventoryCheckingModalHook";
import { useContext, useMemo, useState } from "react";
import {
  ActionBarComponent,
  Button,
  ModalConfirm,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { ProposalCreateHookContext } from "../../../ProposalCreateHook";
import { convertData } from "../../helper";
import { EmptyData } from "./Components/EmptyData";
import GoodServiceDrawer from "./Components/GoodServiceDrawer/GoodServiceDrawer";
import GoodServiceModal from "./Components/GoodServiceModal/GoodServiceModal";
import HeaderTable from "./Components/Header/HeaderTable";
import "./TablePurchaseInfo.scss";
import {
  handleListPurchaseNotEdit,
  renderColumns,
  renderRowSelection,
  ROUND_NUM_CALCULATE_NOT_VND,
  ROUND_NUM_NOT_VND,
} from "./helper";

const TablePurchaseInfo = () => {
  const [translate] = useTranslation();
  const [collapse, setCollapse] = useState<boolean>(true);
  const [openModalGoodService, setOpenModalGoodService] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openModalConfirmDeleteAll, setOpenModalConfirmDeleteAll] =
    useState(false);
  const [recordEdit, setRecordEdit] = useState<GoodServiceExtend>();

  const {
    handleChangeSingleField,
    model,
    changeListSelectedGood,
    handleUploadGoodsServicesFile,
    handleCancelUploadGoodsServicesFile,
    handleDownloadGoodsServicesTemplate,
  } = useContext<ProposalCreateModel>(ProposalCreateHookContext);

  const isVND = isEqual(model?.currency?.code, VND_CURRENCY);

  const roundNum = detectIntegerCurrency(model?.currency?.code)
    ? 0
    : ROUND_NUM_NOT_VND;

  const roundNumCalculate = detectIntegerCurrency(model?.currency?.code)
    ? 0
    : ROUND_NUM_CALCULATE_NOT_VND;

  const currentRate = useMemo(() => {
    if (isVND) {
      return 1;
    }
    return model?.rateInfo?.rate;
  }, [isVND, model?.rateInfo?.rate]);

  const {
    rowSelection,
    selectedRowKeys,
    setSelectedRowKeys,
    setSelectedRow,
    selectedRow,
  } = listService.useRowSelection<GoodServiceByCategory>(
    "checkbox",
    [],
    false,
    "auto",
    true
  );

  const handleChangeCollapse = () => {
    setCollapse(!collapse);
  };

  const handleBulkDeleteRow = () => {
    const editSelectedGoods = model?.selectedListGoodsServices?.filter(
      (item: GoodServiceExtend) => !selectedRowKeys.includes(item?.renderId)
    );
    handleChangeSingleField({
      fieldName: "selectedListGoodsServices",
    })(editSelectedGoods);
    setSelectedRowKeys([]);
    setSelectedRow([]);
    setOpenModalConfirmDeleteAll(false);
  };

  const columns = renderColumns({
    model,
    setRecordEdit,
    setOpenDrawer,
    currentRate,
    roundNum,
    roundNumCalculate,
    translate,
    isCurrencyVND: isVND,
  });

  const convertDataByCategory = convertData(
    model?.selectedListGoodsServices || []
  );

  const { ...context } = useInventoryCheckingModal(model);

  return (
    <InventoryCheckingContext.Provider value={context}>
      <div className="table-purchase-info-wrapper">
        <div className="header" onClick={handleChangeCollapse}>
          <div className="title">
            {translate("PP.title_purchase_information")}
          </div>
          <div>
            <img
              className={classNames("cursor-pointer", {
                "rotate-180": collapse,
                "rotate-0": !collapse,
              })}
              src={IcArrowDown}
              alt="img"
              width={16}
              height={16}
            />
          </div>
        </div>
        {collapse && (
          <div className="body">
            {isEmpty(model?.selectedListGoodsServices) ? (
              <EmptyData
                enableUpload={!isNil(model?.costGroup)}
                openAdd={() => {
                  setOpenModalGoodService(true);
                }}
                isDetail={model?.isDetail}
                onUploadFile={(event) => {
                  handleUploadGoodsServicesFile(
                    event,
                    model?.isAdjust,
                    handleListPurchaseNotEdit(convertDataByCategory)
                  );
                }}
                isLoading={model?.isLoadingGoodsServicesUpload}
                onCancelUploadFile={handleCancelUploadGoodsServicesFile}
                onDownloadTemplate={handleDownloadGoodsServicesTemplate}
              />
            ) : (
              <div>
                <HeaderTable
                  isLoading={model?.isLoadingGoodsServicesUpload}
                  isShow={!model?.isDetail}
                  onClickAdd={() => setOpenModalGoodService(true)}
                  onClickUpload={(event) => {
                    handleUploadGoodsServicesFile(
                      event,
                      model?.isAdjust,
                      handleListPurchaseNotEdit(convertDataByCategory)
                    );
                  }}
                  onClickDownloadTemplate={handleDownloadGoodsServicesTemplate}
                  handleLoadListContent={context.handleLoadListContent}
                />
                <div className="m-t--xs">
                  <ActionBarComponent
                    selectedRowKeys={selectedRow?.map((item) => item?.renderId)}
                    setSelectedRowKeys={() => {
                      setSelectedRowKeys([]);
                      setSelectedRow([]);
                    }}
                  >
                    <Button
                      type="secondary"
                      size="sm"
                      onClick={() => {
                        setOpenModalConfirmDeleteAll(true);
                      }}
                    >
                      {translate("CL.delete_btn")}
                    </Button>
                  </ActionBarComponent>
                  <StandardTable
                    dataSource={[{ isTotal: true }, ...convertDataByCategory]}
                    scroll={{ y: "420px" }}
                    rowKey={(record) =>
                      record?.renderId || record?.goodsServicesCategoryId
                    }
                    idContainer="table-purchase-info"
                    columns={columns}
                    expandable={{
                      expandIcon: ({ expanded, onExpand, record }) => {
                        if (!record.children || record.children.length === 0) {
                          return <div className="table__width-8" />;
                        }
                        return (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              onExpand(record, e);
                            }}
                          >
                            <img
                              className={classNames("cursor-pointer m-x--3xs", {
                                "rotate-180": expanded,
                                "rotate-0": !expanded,
                              })}
                              src={IcArrowDown}
                              alt="img"
                              width={10}
                              height={10}
                            />
                          </div>
                        );
                      },
                    }}
                    rowSelection={renderRowSelection({
                      dataSource: convertDataByCategory,
                      isDetail: model?.isDetail,
                      defaultRowSelection: rowSelection,
                      selectedRowKeys,
                      setSelectedRowKeys,
                      setSelectedRow,
                      selectedRow,
                    })}
                    rowClassName={(record) => {
                      return record.isTotal ? "total-row" : "";
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {openModalGoodService && (
          <GoodServiceModal
            open={openModalGoodService}
            handleCancel={() => {
              setOpenModalGoodService(false);
            }}
          />
        )}

        {openDrawer && (
          <GoodServiceDrawer
            visible={openDrawer}
            onPressClose={() => {
              setOpenDrawer(false);
            }}
            data={recordEdit}
            onPressSave={changeListSelectedGood}
            handleLoadListContent={context.handleLoadListContent}
          />
        )}

        <ModalConfirm
          open={openModalConfirmDeleteAll}
          icon={<img src={DeleteRoundIcon} alt="img" width={72} height={72} />}
          title={translate("PP.modal_confirm_title")}
          content={translate("PP.modal_confirm_content")}
          titleButtonCancel={translate("PM.cancel_btn_label")}
          titleButtonApply={translate("PM.confirm_btn_label")}
          handleSave={handleBulkDeleteRow}
          handleCancel={() => setOpenModalConfirmDeleteAll(false)}
        />
        <InventoryCheckingModal />
      </div>
    </InventoryCheckingContext.Provider>
  );
};

export default TablePurchaseInfo;
