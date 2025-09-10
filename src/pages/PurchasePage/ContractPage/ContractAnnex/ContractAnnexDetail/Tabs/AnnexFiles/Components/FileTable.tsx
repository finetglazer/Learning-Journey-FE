import { emptyIcon, LoadFileIcon, TrashIcon } from "assets/icons";
import AttachedIcon from "assets/icons/attached.svg";
import {
  numberConstants,
  STANDARD_DATE_FORMAT_SLASH,
  TABLE_ROW_KEY,
  WIDTH_400,
} from "core/config/consts";
import { ICON_SIZE_LARGE } from "core/config/icon-size";
import { getIconFile } from "core/helpers/common";
import { formatDateTimeNow } from "core/helpers/date-time";
import { utilService } from "core/services/common-services/util-service";
import { GeneralActionEnum } from "core/services/service-types";
import { clone, isEmpty, isEqual } from "lodash";
import { Attachment } from "models/Attachment";
import { DocumentGroup } from "models/DocumentGroup";
import { AcceptanceFileModel } from "pages/PurchasePage/Acceptance/AcceptanceFile/types";
import EmptyDataCM from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanMaster/Components/EmptyDataCM";
import {
  Dispatch,
  Key,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from "react";
import {
  ActionBarComponent,
  Button,
  FormItem,
  InputText,
  LayoutCell,
  OneLineText,
  STANDARD_TIME_FORMAT,
  StandardTable,
  UploadFile,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import styles from "../AnnexFile.module.scss";
import { AnnexFileContext, AnnexFileContextType } from "../AnnexFileHooks";

enum TableKey {
  UPDATED_DATE = "createdDate",
  DESCRIPTION = "description",
  FILES = "attachments",
}

enum TableWidth {
  attachment = 572,
  icon = 40,
  updateDate = 170,
}

const EMPTY_VIEW_HEIGHT = 578;
const REQUIRED = "*";

const STANDARD_DATE_TIME_FORMAT = `${STANDARD_DATE_FORMAT_SLASH} ${STANDARD_TIME_FORMAT}`;

export const FileTable = () => {
  const [translate] = useTranslation();
  const {
    model,
    dispatch,
    rowSelection,
    selectedRowKeys,
    setSelectedRowKeys,
    handleChangeDescription,
    handleDeleteRow,
    handleDownloadFileAttached,
    handleFileChange,
  } = useContext<AnnexFileContextType>(AnnexFileContext);

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const isViewMode = useMemo(() => isEqual(model?.mode, "VIEW"), [model?.mode]);

  const makeRequireTitle = useCallback(
    (key: string) => {
      const title = translate(`AC.${key}`);
      if (isViewMode) return title;

      return (
        <div className={styles["table-title__require"]}>
          <span>{title}</span>
          <span className={styles["require-text"]}>{REQUIRED}</span>
        </div>
      );
    },
    [isViewMode, translate]
  );

  const handleAttachedIconClick = useCallback((recordId: string) => {
    if (fileInputRefs.current[recordId]) {
      fileInputRefs.current[recordId].click();
    }
  }, []);

  const handleRemoveFile = useCallback(
    (fileId: string | number) => {
      const newFiles = model?.documentGroups?.map((file) => {
        return {
          ...file,
          attachments: file?.attachments?.filter(
            (item) => item?.systemFileId !== fileId
          ),
        };
      });

      dispatch({
        type: GeneralActionEnum.UPDATE,
        payload: {
          ...model,
          documentGroups: newFiles,
        },
      });
    },
    [dispatch, model]
  );

  const columns = useMemo(() => {
    let list = [
      // Updated Date
      {
        title: translate("AC.table_date_created"),
        dataIndex: TableKey.UPDATED_DATE,
        key: TableKey.UPDATED_DATE,
        width: TableWidth.updateDate,
        hide: !isViewMode,
        render(date: string) {
          return (
            <LayoutCell>
              <OneLineText
                value={formatDateTimeNow(date, STANDARD_DATE_TIME_FORMAT)}
              />
            </LayoutCell>
          );
        },
      },
      // File Attachments
      {
        title: makeRequireTitle("table_attachment"),
        dataIndex: TableKey.FILES,
        key: TableKey.FILES,
        width: TableWidth.attachment,
        render(files: Attachment[], noUse: unknown, index: number) {
          return (
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                `documentGroups[${index}].attachments`
              )}
            >
              <div className={styles["attachment-files__wrapper"]}>
                {files?.map((file) => {
                  if (file.isUpload) {
                    return (
                      <UploadFile.FileLoadedContent
                        key={file?.systemFileId}
                        isViewMode
                        className={styles["file-items"]}
                        file={{
                          ...file,
                          id: file?.systemFileId,
                        }}
                        icon={
                          <img
                            src={LoadFileIcon}
                            width={ICON_SIZE_LARGE}
                            height={ICON_SIZE_LARGE}
                            className="rotate-image"
                            alt=""
                          />
                        }
                      />
                    );
                  }

                  return (
                    <UploadFile.FileLoadedContent
                      key={file?.systemFileId}
                      className={styles["file-items"]}
                      isViewMode={isViewMode}
                      file={{
                        ...file,
                        id: file?.systemFileId,
                      }}
                      icon={
                        <img
                          src={getIconFile(file)}
                          width={ICON_SIZE_LARGE}
                          height={ICON_SIZE_LARGE}
                          alt=""
                        />
                      }
                      removeFile={() => handleRemoveFile(file?.systemFileId)}
                      onClickFile={() =>
                        handleDownloadFileAttached(file as DocumentGroup)
                      }
                    />
                  );
                })}
              </div>
            </FormItem>
          );
        },
      },
      // Attached Button
      {
        title: "",
        dataIndex: "",
        width: TableWidth.icon,
        hide: isViewMode,
        render(_: unknown, record: DocumentGroup) {
          return (
            <LayoutCell className={styles["margin-top-6px"]}>
              <div
                className="cursor-pointer"
                onClick={() => handleAttachedIconClick(record?.id)}
              >
                <img src={AttachedIcon} alt="" />
                <input
                  type="file"
                  ref={(refer) => (fileInputRefs.current[record.id] = refer)}
                  className="d-none"
                  multiple
                  onChange={(event) => handleFileChange(event, record)}
                />
              </div>
            </LayoutCell>
          );
        },
      },
      // Description
      {
        title: makeRequireTitle("table_description"),
        dataIndex: TableKey.DESCRIPTION,
        key: TableKey.DESCRIPTION,
        width: "auto",
        render(_: unknown, record: DocumentGroup, index: number) {
          return (
            <LayoutCell>
              <FormItem
                validateObject={utilService.getValidateObj(
                  model,
                  `documentGroups[${index}].description`
                )}
              >
                {isViewMode ? (
                  <OneLineText value={record?.description} useTooltip />
                ) : (
                  <InputText
                    isTableCell
                    placeHolder={translate(
                      "AC.placeholder_input_description_file"
                    )}
                    value={record?.description}
                    onChange={(value) => {
                      handleChangeDescription(record, value);
                    }}
                  />
                )}
              </FormItem>
            </LayoutCell>
          );
        },
      },
      // Delete action
      {
        title: "",
        dataIndex: "",
        width: TableWidth.icon,
        hide: isViewMode,
        render(_: unknown, record: AcceptanceFileModel) {
          return (
            <LayoutCell>
              <div
                className="cursor-pointer"
                onClick={() => {
                  handleDeleteRow(record?.id);
                }}
              >
                <TrashIcon fillColor="#DA3E33" />
              </div>
            </LayoutCell>
          );
        },
      },
    ];

    list = list.filter((item) => !item.hide);

    if (isViewMode) {
      // swap the second and the third column using destructuring
      const clonedList = clone(list);
      [clonedList[numberConstants.ONE], clonedList[numberConstants.TWO]] = [
        clonedList[numberConstants.TWO],
        clonedList[numberConstants.ONE],
      ];
      return clonedList;
    }

    return list;
  }, [
    handleAttachedIconClick,
    handleChangeDescription,
    handleDeleteRow,
    handleDownloadFileAttached,
    handleFileChange,
    handleRemoveFile,
    isViewMode,
    makeRequireTitle,
    model,
    translate,
  ]);

  return (
    <>
      {isEmpty(selectedRowKeys) ? null : (
        <ActionBarComponent
          selectedRowKeys={selectedRowKeys as Key[]}
          setSelectedRowKeys={
            setSelectedRowKeys as Dispatch<SetStateAction<Key[]>>
          }
        >
          <Button
            type="secondary"
            size="sm"
            onClick={() => handleDeleteRow(undefined)}
          >
            {translate("CL.delete_btn")}
          </Button>
        </ActionBarComponent>
      )}
      <StandardTable
        rowKey={TABLE_ROW_KEY}
        dataSource={model?.documentGroups}
        columns={columns}
        rowSelection={isViewMode ? undefined : rowSelection}
        scroll={{ y: WIDTH_400 }}
        locale={{
          emptyText: (
            <EmptyDataCM
              isFilter
              height={EMPTY_VIEW_HEIGHT}
              icon={emptyIcon}
              message={translate("CM.text_empty_information")}
            />
          ),
        }}
        rowClassName={() => styles["table-row"]}
      />
    </>
  );
};
