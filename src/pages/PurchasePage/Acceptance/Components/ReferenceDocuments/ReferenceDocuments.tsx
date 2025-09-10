import type { ColumnProps } from "antd/es/table";
import {
  emptyApplicationIcon,
  IcTrashRed,
  LoadFileIcon,
  PlusIcon,
} from "assets/icons";
import AttachedIcon from "assets/icons/attached.svg";
import { UploadFileCustom } from "components";
import { EmptyItemTable } from "components/EmptyItem/EmptyItem";
import { MAXIMUM_SIZE } from "components/UploadFileCustom/helper";
import { numberConstants, TABLE_ROW_KEY } from "core/config/consts";
import { ICON_SIZE_LARGE } from "core/config/icon-size";
import { getIconFile } from "core/helpers/common";
import { utilService } from "core/services/common-services/util-service";
import { GeneralActionEnum } from "core/services/service-types";
import { isEqual, uniqueId } from "lodash";
import { Attachment } from "models/Attachment";
import { DocumentGroup } from "models/DocumentGroup";
import { budgetRepository } from "pages/BudgetPage/BudgetRepository";
import {
  Dispatch,
  Key,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import {
  ActionBarComponent,
  Button,
  FormItem,
  InputText,
  LayoutCell,
  OneLineText,
  StandardTable,
  UploadFile,
} from "react-components-design-system";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { Trans } from "react-i18next";
import { useParams } from "react-router-dom";
import { finalize } from "rxjs";
import { useAcceptanceInformationContext } from "../../AcceptanceDetail/Components/Tabs/contexts/AcceptanceInformationContext";
import { DeleteRecordModal } from "../../DeleteRecord/DeleteRecordModal";
import styles from "./ReferenceDocuments.module.scss";
import { useReferenceDocumentsHooks } from "./ReferenceDocumentsHooks";

interface Parameters {
  contractId: string | undefined;
  acceptanceId: string | undefined;
}

interface ReferenceDocumentsProps {
  isEdit?: boolean;
}

export const ReferenceDocuments = ({ isEdit }: ReferenceDocumentsProps) => {
  const { model, dispatch } = useAcceptanceInformationContext();
  const { acceptanceId } = useParams<Parameters>();
  const [documentId, setDocumentId] = useState<string>("");
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const acceptanceFiles: DocumentGroup[] = useMemo(
    () => model?.acceptanceFiles || [],
    [model?.acceptanceFiles]
  );
  const {
    translate,
    rowSelection,
    selectedRowKeys,
    setSelectedRowKeys,
    handleUploadAttachmentError,
    fileLoading,
    handleDownloadFileAttached,
    handleAddDocument,
    handleDeleteDocumentGroup,
    handleDeleteDeleteFile,
    isOpenModelConfirmDeleteRow,
    setIsOpenModelConfirmDeleteRow,
  } = useReferenceDocumentsHooks({ acceptanceFiles, dispatch });

  const handleUploadFile = useCallback(
    ({
      files,
      documentId,
    }: {
      files: File[] | Blob[];
      documentId: string | undefined;
    }) => {
      handleAddDocument({ id: documentId, files: [] });
      return budgetRepository.import(files).pipe(
        finalize(() => {
          const fileList = fileLoading?.current || [];
          fileLoading.current = fileList?.filter(
            (document) => !isEqual(document?.documentId, documentId)
          );
        })
      );
    },
    [fileLoading, handleAddDocument]
  );

  const addReferenceDocumentsButton = () => (
    <Button
      icon={<img src={PlusIcon} alt="" />}
      iconPlace="left"
      type="secondary"
      onClick={() => {
        const id = uniqueId("acceptance-file");
        setDocumentId(id);
        handleAddDocument({ id, files: [] });
      }}
    >
      {translate("PM.payment_add_document_button_label")}
    </Button>
  );

  const handleUpdateDescription = useCallback(
    ({ id, value }: { id: string; value: string }) => {
      const newDocumentGroups = acceptanceFiles.map((document) => {
        if (isEqual(document?.id, id)) {
          return {
            ...document,
            note: value,
          };
        }

        return document;
      });
      dispatch({
        type: GeneralActionEnum.UPDATE,
        payload: {
          acceptanceFiles: newDocumentGroups,
        },
      });
    },
    [dispatch, acceptanceFiles]
  );

  const columns: ColumnProps<DocumentGroup>[] = useMemo(() => {
    const list: ColumnProps<DocumentGroup>[] = [
      {
        title: translate("PP.document_description"),
        key: "note",
        dataIndex: "note",
        width: 714,
        render(note: string, record, index) {
          return (
            <LayoutCell>
              {isEdit ? (
                <FormItem
                  isTableCell
                  validateObject={utilService.getValidateObj(
                    model,
                    `acceptanceFiles[${index}].note`
                  )}
                >
                  <InputText
                    placeHolder={translate("AC.txt_description_change")}
                    onChange={(value) => {
                      handleUpdateDescription({ id: record?.id, value });
                    }}
                    value={note}
                    isRequired
                  />
                </FormItem>
              ) : (
                <OneLineText value={note} />
              )}
            </LayoutCell>
          );
        },
      },
      {
        title: translate("AC.table_attachment"),
        key: "attachments",
        dataIndex: "attachments",
        width: 572,
        render(attachments: Attachment[], record) {
          return (
            <div className={styles["attachment-files__wrapper"]}>
              {(
                record?.fileLoading as {
                  files: FileModel[];
                  documentId: string | undefined;
                }[]
              )?.map(({ files, documentId }, index) => {
                return (
                  <>
                    {isEqual(documentId, record?.id) && (
                      <>
                        {files?.map((file) => (
                          <UploadFile.FileLoadedContent
                            key={index}
                            className={styles["file-items"]}
                            file={{
                              ...file,
                              name: file.name,
                            }}
                            icon={
                              <img
                                src={LoadFileIcon}
                                alt=""
                                width={ICON_SIZE_LARGE}
                                height={ICON_SIZE_LARGE}
                                className="rotate-image"
                              />
                            }
                            isViewMode
                          />
                        ))}
                      </>
                    )}
                  </>
                );
              })}
              {attachments?.map((file) => (
                <UploadFile.FileLoadedContent
                  key={file?.systemFileId}
                  className={styles["file-items"]}
                  file={{
                    ...file,
                    id: file?.systemFileId,
                  }}
                  removeFile={() =>
                    handleDeleteDeleteFile({
                      systemFileId: `${file?.systemFileId}`,
                      documentId: record?.id,
                    })
                  }
                  onClickFile={() =>
                    handleDownloadFileAttached(file as Attachment)
                  }
                  icon={
                    <img
                      src={getIconFile(file)}
                      width={ICON_SIZE_LARGE}
                      height={ICON_SIZE_LARGE}
                      alt=""
                    />
                  }
                />
              ))}
            </div>
          );
        },
      },
    ];

    if (isEdit) {
      list.push({
        key: "id",
        dataIndex: "id",
        width: 80,
        render(id: string) {
          return (
            <LayoutCell>
              <div className={styles["action-row"]}>
                <UploadFileCustom
                  className={styles["icon-attach"]}
                  uploadFile={(files) =>
                    handleUploadFile({ files, documentId: id })
                  }
                  updateList={(files: FileModel[]) => {
                    handleAddDocument({ id, files });
                  }}
                  setListFileLoading={(files) => {
                    const newFileLoading = fileLoading.current;
                    const findIndex = newFileLoading?.findIndex((document) =>
                      isEqual(document?.documentId, id)
                    );
                    if (isEqual(findIndex, -numberConstants.ONE)) {
                      newFileLoading.push({
                        documentId: id,
                        files: files as FileModel[],
                      });
                    } else {
                      newFileLoading.splice(findIndex, 1, {
                        documentId: id,
                        files: [
                          ...((files || []) as FileModel[]),
                          ...newFileLoading[findIndex].files,
                        ],
                      });
                    }
                    fileLoading.current = newFileLoading;
                  }}
                  maximumSize={MAXIMUM_SIZE}
                  onUploadError={handleUploadAttachmentError}
                  icon={<img src={AttachedIcon} alt="" />}
                  titleButton=""
                  isMultiple
                />
                <button
                  onClick={() => {
                    setSelectedRecordId(id);
                    setIsOpenModelConfirmDeleteRow(true);
                  }}
                >
                  <img src={IcTrashRed} alt="" />
                </button>
              </div>
            </LayoutCell>
          );
        },
      });
    }

    return list;
  }, [
    fileLoading,
    handleAddDocument,
    handleDeleteDeleteFile,
    handleDownloadFileAttached,
    handleUpdateDescription,
    handleUploadAttachmentError,
    handleUploadFile,
    isEdit,
    model,
    setIsOpenModelConfirmDeleteRow,
    translate,
  ]);

  const data = useMemo(
    () =>
      acceptanceFiles?.map((document) => ({
        ...document,
        fileLoading: fileLoading?.current,
      })),
    [acceptanceFiles, fileLoading, documentId]
  );

  const isEmptyList = useMemo(
    () => isEqual(acceptanceFiles?.length, numberConstants?.ZERO),
    [acceptanceFiles?.length]
  );

  return (
    <>
      {isEqual(isEdit, true) ? (
        <>
          {isEmptyList ? (
            <EmptyItemTable
              icon={<img src={emptyApplicationIcon} alt="" />}
              content={<Trans i18nKey="AC.txt_select_new_item_and_import" />}
            >
              {addReferenceDocumentsButton()}
            </EmptyItemTable>
          ) : (
            <div className="pb-3">{addReferenceDocumentsButton()}</div>
          )}
        </>
      ) : null}
      {(isEqual(isEmptyList, false) || (!isEdit && acceptanceId)) && (
        <>
          <ActionBarComponent
            selectedRowKeys={selectedRowKeys as Key[]}
            setSelectedRowKeys={
              setSelectedRowKeys as Dispatch<SetStateAction<Key[]>>
            }
          >
            <Button
              type="secondary"
              size="sm"
              onClick={() => {
                setIsOpenModelConfirmDeleteRow(true);
              }}
            >
              {translate("CL.delete_btn")}
            </Button>
          </ActionBarComponent>
          <div className={styles["reference-table__box"]}>
            <StandardTable
              className={styles["reference-document-table"]}
              rowKey={TABLE_ROW_KEY}
              dataSource={data}
              columns={columns}
              rowSelection={isEdit ? rowSelection : undefined}
              tableLayout="fixed"
            />
          </div>
          {isOpenModelConfirmDeleteRow && (
            <DeleteRecordModal
              open
              loading={undefined}
              handleConfirm={() => {
                if (selectedRecordId) {
                  handleDeleteDocumentGroup([selectedRecordId]);
                } else {
                  handleDeleteDocumentGroup(selectedRowKeys as string[]);
                }
              }}
              handleCancel={() => setIsOpenModelConfirmDeleteRow(false)}
              title={translate(
                "AC.title_confirm_delete_acceptance_reference_documents"
              )}
              content={translate(
                "AC.content_confirm_delete_acceptance_reference_documents"
              )}
            />
          )}
        </>
      )}
    </>
  );
};
