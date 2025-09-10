import React, { useContext, useState } from "react";
import { ColumnProps } from "antd/lib/table";
import {
  ActionBarComponent,
  Button,
  LayoutCell,
  OneLineText,
  Pagination,
  StandardTable,
  Tag,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  DEFAULT_PAGE_SIZE_OPTION,
  STANDARD_DATE_FORMAT_SLASH,
  TABLE_ROW_KEY,
  WIDTH_400,
} from "core/config/consts";
import EmptyData from "components/EmptyData/EmptyData";
import { tableService } from "core/services/page-services/table-service";
import { combineText, listLegalStatus, listTicketType } from "../../constants";
import { isEqual } from "lodash";
import Tooltip from "antd/es/tooltip";
import { addZStringToDate, formatDate } from "core/helpers/date-time";
import { ContractAdjustment } from "models/ContractAdjustment";
import { LegalSignatureMaster, LegalSignatureMasterContext } from "../context";
import EmptyIcon from "assets/icons/empty_data_settlement.svg";
import { listService } from "core/services/page-services/list-service";
import ModalPreview from "../../Components/ModalPreview/ModalPreview";
import { CreateUser, Legal, Organization } from "models/LegalSignature";

const LegalSignatureTabTable = () => {
  const {
    list,
    loadingList,
    modelFilter,
    dispatchFilter,
    count,
    handleLoadList,
    handlePreview,
    model,
    loadingPreview,
  } = useContext<LegalSignatureMaster>(LegalSignatureMasterContext);
  const [translate] = useTranslation();
  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const getLinkFollowTicketType = (type: number) => {
    return listTicketType.find((el) => el.id === type)?.url;
  };
  const openLinkInNewTab = (record: Legal) => {
    const path = getLinkFollowTicketType(record?.requestType);
    if (!path) return;
    const url = `${window.location.origin}${path}/${record?.requestId}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const columns: ColumnProps<Legal>[] = [
    {
      title: translate("AC.txt_ticket_type"),
      key: "requestTypeName",
      dataIndex: "requestTypeName",
      width: 160,
      render(value) {
        return (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("CT.ticket_code"),
      key: "code",
      dataIndex: "code",
      width: 140,
      render(value, record) {
        return (
          <LayoutCell>
            <span
              onClick={() => openLinkInNewTab(record)}
              className="text-truncate"
            >
              <OneLineText
                className="text-table-content-primary hyperlink "
                value={value}
              />
            </span>
          </LayoutCell>
        );
      },
    },
    {
      title: translate("legalSignature.voucher_name_description"),
      key: "description",
      dataIndex: "description",
      width: 293,
      render(value) {
        return (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("contractAdjustment.txt_adjustment_unit_create"),
      key: "organization",
      dataIndex: "organization",
      width: 220,
      render(organization: Organization, record) {
        return (
          <LayoutCell>
            <Tooltip
              trigger={["hover"]}
              placement="top"
              title={record?.organizationName}
            >
              <OneLineText value={organization?.name} />
            </Tooltip>
          </LayoutCell>
        );
      },
    },
    {
      title: translate("contractAdjustment.txt_adjustment_create"),
      key: "createUser",
      dataIndex: "createUser",
      width: 180,
      render(createUser: CreateUser, record) {
        return (
          <LayoutCell>
            <Tooltip
              trigger={["hover"]}
              placement="top"
              title={combineText(createUser?.email, createUser?.name)}
              overlayStyle={{ maxWidth: 500 }}
            >
              <div className="d-inline-block text-in-table-cell text-truncate">
                {createUser?.email}
              </div>
            </Tooltip>
          </LayoutCell>
        );
      },
    },
    {
      title: translate("contractAdjustment.table_grounds_created_date"),
      key: "createdDate",
      dataIndex: "createdDate",
      width: 110,
      render(createdDate: string) {
        const dateOnly = addZStringToDate(createdDate);

        return (
          <LayoutCell>
            <OneLineText
              value={formatDate(dateOnly, STANDARD_DATE_FORMAT_SLASH)}
            />
          </LayoutCell>
        );
      },
    },
    {
      title: translate("contractAdjustment.list.title.status"),
      key: "status",
      dataIndex: "status",
      width: 105,
      render(id: string) {
        const item = listLegalStatus().find((type) => isEqual(type?.id, id));
        return (
          <LayoutCell>
            <Tag
              size="md"
              value={item?.name}
              status={item?.code}
              isShowDot={false}
              isShowBorder
            />
          </LayoutCell>
        );
      },
    },
    {
      key: "id",
      fixed: "right",
      width: 98,
      align: "center",
      render(record: ContractAdjustment) {
        return (
          <LayoutCell>
            <Button
              type={"secondary"}
              onClick={() => {
                setIsOpenModal(true);
                handlePreview(record);
              }}
            >
              {translate("legalSignature.view_file_signature")}
            </Button>
          </LayoutCell>
        );
      },
    },
  ];

  const { rowSelection, selectedRowKeys, setSelectedRowKeys } =
    listService.useRowSelection<Legal>("checkbox", [], true);
  //TODO: handle select row

  const [isOpenModal, setIsOpenModal] = useState(false);

  return (
    <>
      <div className="page-master__table">
        {!loadingList && list?.length <= 0 && !modelFilter?.search ? (
          <EmptyData
            message={translate("CM.message_empty_data")}
            height={WIDTH_400}
            icon={EmptyIcon}
          ></EmptyData>
        ) : (
          <>
            <ActionBarComponent
              selectedRowKeys={selectedRowKeys?.filter(Boolean)}
              setSelectedRowKeys={setSelectedRowKeys}
            >
              <div className="d-flex align-items-center gap-2">
                <Button
                  type="secondary"
                  size="sm"
                  onClick={() => {
                    console.log("legalSignature", selectedRowKeys);
                  }}
                >
                  {translate("legalSignature.title")}
                </Button>
                <Button
                  type="secondary"
                  size="sm"
                  onClick={() => {
                    setSelectedRowKeys([]);
                  }}
                >
                  {translate("CM.txt_status_close")}
                </Button>
              </div>
            </ActionBarComponent>
            <StandardTable
              rowKey={TABLE_ROW_KEY}
              columns={columns}
              dataSource={loadingList ? [] : list}
              loading={loadingList}
              onChange={handleTableChange}
              isDragable={true}
              scroll={{ y: "calc(100vh - 350px)" }}
              idContainer="legal-signature-table"
              tableLayout="fixed"
              rowSelection={rowSelection}
              locale={{
                emptyText: (
                  <EmptyData
                    message={translate("CM.message_empty_data")}
                    height={WIDTH_400}
                    icon={EmptyIcon}
                  ></EmptyData>
                ),
              }}
            />

            <div className="page-master__pagination">
              <Pagination
                total={count}
                pageIndex={modelFilter?.pageIndex}
                pageSize={modelFilter?.pageSize}
                onChange={handlePagination}
                pageSizeOptions={DEFAULT_PAGE_SIZE_OPTION}
              />
            </div>
          </>
        )}
        <ModalPreview
          model={model}
          loadingPreview={loadingPreview}
          open={isOpenModal}
          handleCancel={() => setIsOpenModal(false)}
          onSave={(data) => {
            setIsOpenModal(false);
          }}
        />
      </div>
    </>
  );
};

export default LegalSignatureTabTable;
