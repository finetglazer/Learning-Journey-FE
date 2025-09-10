import { TrashCan } from "@carbon/icons-react";
import { ColumnProps } from "antd/lib/table";
import { IcPencilSvg } from "assets/icons";
import classNames from "classnames";
import { UnitTitle } from "components/UnitTitle/UnitTitle";
import { getIconFile } from "core/helpers/common";
import { formatNumber } from "core/helpers/number";
import dayjs from "dayjs";
import { DeleteRecordModal } from "pages/Catalog/DeleteRecord/DeleteRecordModal";
import { Authorizers } from "pages/Catalog/LegalEntity/LegalEntityMaster/LegalEntityMasterHooks";
import React, { Key, useContext, useState } from "react";
import {
  LayoutCell,
  OneLineText,
  STANDARD_DATE_FORMAT_INVERSE_DEFAULT,
  StandardTable,
  UploadFile,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  FileAttachments,
  LegalEntityDetail,
  LegalEntityDetailContext,
} from "../../LegalEntityDetailHooks";
import "./AuthorizationInformationTable.scss";

type Props = {
  onEditRow: (record: Authorizers) => void;
};

const AuthorizationInformationTable = ({ onEditRow }: Props) => {
  const [translate] = useTranslation();
  const { model, handleChangeSingleField, handleDownloadFileAttached } =
    useContext<LegalEntityDetail>(LegalEntityDetailContext);

  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [isOpenModelConfirmDeleteRow, setIsOpenModelConfirmDeleteRow] =
    useState(false);
  const [idDelete, setIdDelete] = useState("");
  const handleEditRow = (record: Authorizers) => {
    onEditRow(record);
  };

  const columns: ColumnProps<Authorizers>[] = React.useMemo(
    () => [
      {
        title: () => <UnitTitle title={translate("LE.txt_stt")} unit={" "} />,
        key: "stt",
        dataIndex: "stt",
        width: 40,
        ellipsis: true,
        render: (i, record, index: number) => {
          return (
            <LayoutCell>
              <OneLineText value={`${index + 1}`} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle
            title={translate("LE.txt_legal_entity_authorized_person")}
            unit={" "}
          />
        ),
        key: "name",
        dataIndex: "name",
        ellipsis: true,
        width: 150,
        render: (_, record: Authorizers) => (
          <LayoutCell>
            <OneLineText
              className="text-table-content-primary"
              value={formatNumber(record?.name)}
            />
          </LayoutCell>
        ),
      },
      {
        title: () => (
          <UnitTitle
            title={translate(
              "LE.txt_legal_entity_position_of_authorized_person"
            )}
            unit={" "}
          />
        ),
        key: "position",
        dataIndex: "position",
        ellipsis: true,
        width: 200,
        render: (_, record: Authorizers) => (
          <LayoutCell>
            <OneLineText value={formatNumber(record?.position)} />
          </LayoutCell>
        ),
      },
      {
        title: () => (
          <UnitTitle
            title={translate("LE.txt_legal_entity_authorized_letter")}
            unit={" "}
          />
        ),
        key: "powerOfAttorney",
        dataIndex: "powerOfAttorney",
        ellipsis: true,
        width: 160,
        render: (_, record: Authorizers) => (
          <LayoutCell>
            <OneLineText value={formatNumber(record?.powerOfAttorney)} />
          </LayoutCell>
        ),
      },
      {
        title: () => (
          <UnitTitle
            title={translate("LE.txt_legal_entity_start_date")}
            unit={" "}
          />
        ),
        key: "guarantee_duration",
        dataIndex: "guarantee_duration",
        width: 160,
        ellipsis: true,
        render: (_, record: Authorizers) => {
          return (
            <LayoutCell>
              <OneLineText
                value={`${dayjs(record?.startTime).format(
                  STANDARD_DATE_FORMAT_INVERSE_DEFAULT
                )} `}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => (
          <UnitTitle
            title={translate("LE.txt_legal_entity_end_date")}
            unit={" "}
          />
        ),
        key: "guarantee_duration",
        dataIndex: "guarantee_duration",
        width: 160,
        ellipsis: true,
        render: (_, record: Authorizers) => {
          return (
            <LayoutCell>
              <OneLineText
                value={`${dayjs(record?.endTime).format(
                  STANDARD_DATE_FORMAT_INVERSE_DEFAULT
                )}`}
              />
            </LayoutCell>
          );
        },
      },

      {
        title: () => (
          <UnitTitle
            title={translate(
              "LE.txt_legal_entity_input_authorized_letter_file"
            )}
            unit={" "}
          />
        ),
        key: "attachmentDocument",
        dataIndex: "attachmentDocument",
        ellipsis: true,
        width: 200,
        render: (_, record: Authorizers) => {
          return (
            <LayoutCell>
              {record?.attachmentDocuments?.map(
                (item: FileAttachments, index: number) => {
                  return (
                    <UploadFile.FileLoadedContent
                      isViewMode={true}
                      key={index}
                      file={{ ...item, id: item.systemFileId }}
                      onClickFile={() => handleDownloadFileAttached(item)}
                      className={classNames(
                        "file-loaded-item w-100 authorizers"
                      )}
                      icon={
                        <img
                          src={getIconFile(item)}
                          alt="img"
                          width={14}
                          height={24}
                        />
                      }
                    />
                  );
                }
              )}
            </LayoutCell>
          );
        },
      },
      !model?.isDetail
        ? {
            title: "",
            key: "action",
            fixed: "right",
            dataIndex: "action",
            width: 80,
            render: (_, record: Authorizers) => {
              return (
                <LayoutCell>
                  <div
                    className="payment-red cursor-pointer btn m-l--xs"
                    onClick={() => handleEditRow(record)}
                  >
                    <img
                      src={IcPencilSvg}
                      alt="edit"
                      width={20}
                      height={20}
                      className="m-r--sm"
                    />
                  </div>
                  <div className="payment-red cursor-pointer btn">
                    <TrashCan
                      size={20}
                      onClick={() => handleDeleteRowConfirm(record.id)}
                    />
                  </div>
                </LayoutCell>
              );
            },
          }
        : null,
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [translate]
  );

  const handleDeleteRowConfirm = (id: string) => {
    setIdDelete(id);
    setIsOpenModelConfirmDeleteRow(true);
  };

  const handleDeleteRow = () => {
    const authorizersEdit = model.authorizers.filter(
      (item: Authorizers) => item.id !== idDelete
    );
    handleChangeSingleField({
      fieldName: "authorizers",
    })(authorizersEdit);
    if (selectedRowKeys.includes(idDelete)) {
      setSelectedRowKeys(selectedRowKeys.filter((key) => key !== idDelete));
    }
    setIsOpenModelConfirmDeleteRow(false);
  };

  return (
    <div>
      <StandardTable
        rowKey={"id"}
        columns={columns.filter(Boolean)}
        dataSource={model?.authorizers}
        isDragable={true}
        idContainer="table-id"
        rowClassName="cost-allocation-row"
        scroll={{ y: "calc(100vh - 320px)" }}
        className="cost-allocation-row_selection"
      />
      {isOpenModelConfirmDeleteRow && (
        <DeleteRecordModal
          open
          loading={undefined}
          handleConfirm={handleDeleteRow}
          handleCancel={() => setIsOpenModelConfirmDeleteRow(false)}
          title={translate("LE.txt_confirm_delete")}
          content={translate("LE.txt_content_confirm_delete")}
        />
      )}
    </div>
  );
};

export default AuthorizationInformationTable;
