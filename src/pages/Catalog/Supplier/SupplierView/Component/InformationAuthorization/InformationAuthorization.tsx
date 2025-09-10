import { ColumnProps } from "antd/lib/table";
import CloudyEmpty from "components/EmptyTable/CloudyEmpty";
import {
  numberConstants,
  STANDARD_DATE_FORMAT_SLASH,
} from "core/config/consts";
import dayjs from "dayjs";
import { isEqual, isUndefined } from "lodash";

import ActiveSvg from "assets/icons/CostLine/ic_active.svg";
import DenySvg from "assets/icons/CostLine/ic_deny.svg";
import { useContext, useMemo } from "react";
import {
  LayoutCell,
  OneLineText,
  StandardTable,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import "./InformationAuthorization.scss";

import { SupplierAuthorization } from "models/Supplier/Supplier";
import { SupplierViewContext } from "../../SupplierViewHook";

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

  const { model } = useContext(SupplierViewContext);

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
    ],
    [translate]
  );

  return (
    <div className="authorization_container">
      {isEqual(model?.supplierAuthorizations, []) ||
      isUndefined(model?.supplierAuthorizations) ? (
        <CloudyEmpty
          content={translate("SL.txt_btn_add_authorization")}
        ></CloudyEmpty>
      ) : (
        <div className="authorization_main">
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
    </div>
  );
}
