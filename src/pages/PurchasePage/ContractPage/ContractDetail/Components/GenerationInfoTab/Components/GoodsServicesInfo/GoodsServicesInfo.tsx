import { ExpandableConfig } from "antd/lib/table/interface";
import classNames from "classnames";
import { isEmpty } from "lodash";
import CollapseCard from "pages/PurchasePage/ContractPage/CollapseCard/CollapseCard";
import {
  ActionBarComponent,
  Button,
  ModalConfirm,
  StandardTable,
} from "react-components-design-system";

import { GoodServiceByCategory } from "models/PurchaseRequest";
import { useGoodsServicesInfoHook } from "./GoodsServicesInfoHook";

import {
  DeleteRoundIcon,
  IcArrowDown,
  IcEmptyGoodsServices,
  IcPlusSVG,
} from "assets/icons";
import styles from "./GoodsServicesInfo.module.scss";
import useColumnGoodServicesInfo from "./useColumnGoodServicesInfo";

interface GoodsServicesInfoProps {
  isDetailPage?: boolean;
}

const GoodsServicesInfo = ({ isDetailPage }: GoodsServicesInfoProps) => {
  const {
    translate,
    modelMaster,
    selectedDetailGoodsServicesId,
    convertDataByCategory,
    rowSelections,
    roundNum,
    currencyCode,
    isOpenDeleteConfirmModal,
    selectedRowKeys,
    setSelectedRowKeys,
    setDeletingGoodsServicesId,
    setIsOpenDeleteConfirmModal,
    handleDeleteGoodsServicesRows,
    handleCloseDeleteConfirmModal,
    handleOpenGoodsServicesModal,
    setSelectedDetailGoodsServicesId,
    shouldDisabledAddGoodsServices,
  } = useGoodsServicesInfoHook();

  const { columns } = useColumnGoodServicesInfo({
    modelMaster,
    currencyCode,
    roundNum,
    isDetailPage,
    setSelectedDetailGoodsServicesId,
    setDeletingGoodsServicesId,
    setIsOpenDeleteConfirmModal,
  });

  const expandable: ExpandableConfig<GoodServiceByCategory> = {
    expandIcon: ({ expanded, onExpand, record }) => {
      if (!record.children || record.children.length === 0) {
        return <div className="table__width-8" />;
      }
      return (
        <div
          onClick={(event) => {
            event.stopPropagation();
            onExpand(record, event);
          }}
          className="text-center"
        >
          <img
            className={classNames("cursor-pointer m-x--3xs", {
              "rotate-0": expanded,
              "rotate-negative-90": !expanded,
            })}
            src={IcArrowDown}
            alt="img"
            width={10}
            height={10}
          />
        </div>
      );
    },
  };

  return (
    <div className="contract-detail-section">
      <CollapseCard title={translate("CT.goods_services_info")}>
        <div className={styles["goods-services-info-container"]}>
          {!isEmpty(modelMaster?.contractGoodsServicesList) ? (
            <div className={styles["goods-services-info__list"]}>
              {isDetailPage && (
                <Button
                  iconPlace="left"
                  icon={<img src={IcPlusSVG} width={16} alt="Add Icon" />}
                  type="secondary"
                  size="lg"
                  onClick={handleOpenGoodsServicesModal}
                >
                  {translate("CT.add_goods_services")}
                </Button>
              )}
              <ActionBarComponent
                selectedRowKeys={modelMaster?.contractGoodsServicesList
                  ?.filter((item) => selectedRowKeys?.includes(item?.id))
                  ?.map((item) => item.id)}
                setSelectedRowKeys={setSelectedRowKeys}
              >
                <Button
                  type="secondary"
                  size="sm"
                  onClick={() => {
                    setIsOpenDeleteConfirmModal(true);
                  }}
                >
                  {translate("CL.delete_btn")}
                </Button>
              </ActionBarComponent>
              <StandardTable
                rowKey="id"
                isDragable
                columns={columns}
                dataSource={[{ isTotal: true }, ...convertDataByCategory]}
                scroll={{ y: "calc(100vh - 320px)" }}
                rowSelection={isDetailPage ? rowSelections : undefined}
                expandable={expandable}
                rowClassName={(rowData) => {
                  const classes = [];
                  if (isDetailPage) classes.push("detail-row");
                  if (rowData.isTotal) classes.push("total-row");
                  if (
                    selectedDetailGoodsServicesId &&
                    rowData.id === selectedDetailGoodsServicesId
                  )
                    classes.push("editable-row");
                  return classes.join(" ");
                }}
              />
            </div>
          ) : (
            <div className={styles["empty-goods-services-info"]}>
              <div className={styles["empty-goods-services-info__wrapper"]}>
                <img
                  src={IcEmptyGoodsServices}
                  alt="img"
                  width={140}
                  height={140}
                />

                <div className={styles["empty-goods-services-info__container"]}>
                  <span className={styles["no-goods-services-info-text"]}>
                    {translate("CM.message_empty_data")}
                  </span>
                  {isDetailPage && (
                    <Button
                      iconPlace="left"
                      icon={<img src={IcPlusSVG} width={16} alt="Add Icon" />}
                      type="secondary"
                      size="lg"
                      disabled={shouldDisabledAddGoodsServices()}
                      onClick={handleOpenGoodsServicesModal}
                    >
                      {translate("CT.add_goods_services")}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </CollapseCard>

      <ModalConfirm
        open={!!isOpenDeleteConfirmModal}
        icon={<img src={DeleteRoundIcon} alt="img" width={72} height={72} />}
        title={translate("CT.confirm_delete_goods_services")}
        content={translate("CT.delete_warning")}
        titleButtonCancel={translate("PM.cancel_btn_label")}
        titleButtonApply={translate("PM.confirm_btn_label")}
        handleSave={() => handleDeleteGoodsServicesRows()}
        handleCancel={handleCloseDeleteConfirmModal}
      />
    </div>
  );
};

export default GoodsServicesInfo;
