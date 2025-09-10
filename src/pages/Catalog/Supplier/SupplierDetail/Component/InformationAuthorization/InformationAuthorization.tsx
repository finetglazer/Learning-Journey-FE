import { TrashCan } from "@carbon/icons-react";
import { ColumnProps } from "antd/lib/table";
import { DeleteRoundIcon, IcPencilSvg, PlusIcon } from "assets/icons";
import CloudyEmpty from "components/EmptyTable/CloudyEmpty";
import {
  numberConstants,
  STANDARD_DATE_FORMAT_SLASH,
} from "core/config/consts";
import dayjs from "dayjs";
import { isEqual, isUndefined } from "lodash";

import { useContext, useMemo, useState } from "react";
import {
  Button,
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import ActiveSvg from "assets/icons/CostLine/ic_active.svg";
import DenySvg from "assets/icons/CostLine/ic_deny.svg";
import { useTranslation } from "react-i18next";
import "./InformationAuthorization.scss";

import ModalAuthorization from "./Modal/ModalAuthorization/ModalAuthorization";
import { SupplierDetailContext } from "../../SupplierDetailHook";
import ModalConfirmDelete from "../ModalConfirmDelete/ModalConfirmDelete";
import { SupplierAuthorization } from "models/Supplier/Supplier";

const ICON_SIZE = 12;
const SIZE_MEDIUM = 20;

const columnsWidth = {
  stt: 50,
  authorizedPerson: 200,
  positionAuthorizedPerson: 200,
  paperAuthorized: 200,
  timeStartDate: 200,
  timeEndDate: 200,
  action: 100,
};

export default function InformationAuthorization() {
  const [translate] = useTranslation();
  const [isShowModelAdd, setIsShowModelAdd] = useState<boolean>(false);
  const [recordEdit, setRecordEdit] = useState<SupplierAuthorization | null>(
    null
  );
  const [isOpenModelConfirmDeleteRow, setIsOpenModelConfirmDeleteRow] =
    useState<boolean>(false);
  const [idDelete, setIdDelete] = useState<string>("");

  const { model, handleChangeSingleField } = useContext(SupplierDetailContext);

  const columns: ColumnProps<SupplierAuthorization>[] = useMemo(
    () => [
      {
        title: () => translate("SL.txt_stt"),
        key: "stt",
        width: columnsWidth.stt,
        ellipsis: true,
        render: (_, __, index: number) => {
          return (
            <LayoutCell>
              <OneLineText value={(index + numberConstants.ONE).toString()} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => translate("SL.txt_authorized_person"),
        key: "authorizedPerson",
        dataIndex: "authorizedPerson",
        ellipsis: true,
        width: columnsWidth.authorizedPerson,
        render: (value: string) => (
          <LayoutCell>
            <OneLineText value={value} />
          </LayoutCell>
        ),
      },
      {
        title: () => translate("SL.txt_position_authorized_person"),
        key: "authorizedPersonPosition",
        dataIndex: "authorizedPersonPosition",
        width: columnsWidth.positionAuthorizedPerson,
        ellipsis: true,
        render: (value: string) => {
          return (
            <LayoutCell>
              <OneLineText value={value} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => translate("SL.txt_paper_authorized"),
        key: "authorizationLetter",
        dataIndex: "authorizationLetter",
        width: columnsWidth.paperAuthorized,
        ellipsis: true,
        render: (value: string) => {
          return (
            <LayoutCell>
              <OneLineText value={value} />
            </LayoutCell>
          );
        },
      },
      {
        title: () => translate("SL.txt_time_start_date"),
        key: "authorizedStartDate",
        dataIndex: "authorizedStartDate",
        width: columnsWidth.timeStartDate,
        ellipsis: true,
        render: (_, record) => {
          return (
            <LayoutCell>
              <OneLineText
                value={
                  record?.authorizedStartDate &&
                  dayjs(record.authorizedStartDate).format(
                    STANDARD_DATE_FORMAT_SLASH
                  )
                }
              />
            </LayoutCell>
          );
        },
      },
      {
        title: () => translate("SL.txt_time_end_date"),
        key: "authorizedDate",
        dataIndex: "authorizedDate",
        width: columnsWidth.timeEndDate,
        ellipsis: true,
        render: (_, record) => {
          return (
            <LayoutCell>
              <OneLineText
                value={
                  record?.authorizedEndDate &&
                  dayjs(record.authorizedEndDate).format(
                    STANDARD_DATE_FORMAT_SLASH
                  )
                }
              />
            </LayoutCell>
          );
        },
      },
      {
        title: translate("SL.txt_is_representative_default_title"),
        key: "isRepresentativeDefault",
        dataIndex: "isRepresentativeDefault",
        width: 150,
        sorter: false,
        render(...params: [boolean, SupplierAuthorization, number]) {
          return (
            <LayoutCell>
              <img
                src={params[0] ? ActiveSvg : DenySvg}
                alt=""
                width={20}
                height={20}
              />
            </LayoutCell>
          );
        },
      },
      {
        title: "",
        key: "action",
        fixed: "right",
        width: columnsWidth.action,
        render: (_, record) => {
          return (
            <LayoutCell>
              <div
                className="cursor-pointer btn m-l--xs"
                onClick={() => handleEditRow(record)}
              >
                <img
                  src={IcPencilSvg}
                  alt="edit"
                  width={SIZE_MEDIUM}
                  height={SIZE_MEDIUM}
                  className="m-r--sm"
                />
              </div>
              <div className="cursor-pointer color-red btn">
                <TrashCan
                  size={SIZE_MEDIUM}
                  onClick={() => handleDeleteRowConfirm(record?.id)}
                />
              </div>
            </LayoutCell>
          );
        },
      },
    ],
    [translate]
  );

  const handleEditRow = (record: SupplierAuthorization) => {
    setRecordEdit(record);
    setIsShowModelAdd(true);
  };

  const handleDeleteRowConfirm = (id: string) => {
    setIdDelete(id);
    setIsOpenModelConfirmDeleteRow(true);
  };

  const handleDeleteRow = () => {
    const warrantiesEdit = model.supplierAuthorizations.filter(
      (item: SupplierAuthorization) => item?.id !== idDelete
    );
    handleChangeSingleField({
      fieldName: "supplierAuthorizations",
    })(warrantiesEdit);
    setIsOpenModelConfirmDeleteRow(false);
  };

  const addAuthorization = () => {
    return (
      <Button
        type="secondary"
        iconPlace="left"
        className="guarantee_button"
        icon={
          <img src={PlusIcon} alt="img" width={ICON_SIZE} height={ICON_SIZE} />
        }
        onClick={() => setIsShowModelAdd(true)}
      >
        {translate("SL.txt_btn_add_authorization")}
      </Button>
    );
  };

  return (
    <div className="authorization_container">
      {isEqual(model?.supplierAuthorizations, []) ||
      isUndefined(model?.supplierAuthorizations) ? (
        <CloudyEmpty content={translate("SL.txt_btn_add_authorization")}>
          {addAuthorization()}
        </CloudyEmpty>
      ) : (
        <div className="authorization_main">
          {addAuthorization()}
          <div className="authorization_content">
            <StandardTable
              columns={columns}
              dataSource={model?.supplierAuthorizations}
              isDragable={true}
              rowClassName="cost-allocation-row"
              className="cost-allocation-row_selection"
            />
          </div>
        </div>
      )}

      <ModalConfirmDelete
        open={isOpenModelConfirmDeleteRow}
        icon={DeleteRoundIcon}
        title={translate("SL.txt_confirm_delete_authorization")}
        content={translate("SL.txt_confirm_delete_content_authorization")}
        titleButtonCancel={translate("CM.btn_close")}
        titleButtonApply={translate("CM.txt_delete")}
        handleSave={handleDeleteRow}
        handleCancel={() => setIsOpenModelConfirmDeleteRow(false)}
      />

      {isShowModelAdd && (
        <ModalAuthorization
          open={isShowModelAdd}
          recordEdit={recordEdit}
          handleCancel={() => {
            setIsShowModelAdd(false);
            setRecordEdit(null);
          }}
        />
      )}
    </div>
  );
}
