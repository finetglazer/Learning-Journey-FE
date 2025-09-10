import { TableColumnsType } from "antd/lib";
import { IcTrashRed, PlusIcon } from "assets/icons";
import CloudyEmpty from "components/EmptyTable/CloudyEmpty";
import TableWithEmpty from "components/TableWithEmpty/TableWithEmpty";
import { EMAIL_REGEX, MAX_LENGTH_255 } from "core/config/consts";
import { utilService } from "core/services/common-services/util-service";
import { listService } from "core/services/page-services/list-service";
import { uniqueId } from "lodash";
import { EmailReceiverInformation, SupplierModel } from "models/PurchasingPlan";
import {
  ActionBarComponent,
  Button,
  FormItem,
  InputText,
  LayoutCell,
  OneLineText,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";

interface IProps {
  data: EmailReceiverInformation[];
  onChangeData?: (data: SupplierModel) => void;
  isDetail?: boolean;
}

export default function EmailRecipientDetails({
  data,
  onChangeData,
  isDetail = false,
}: IProps) {
  const [translate] = useTranslation();
  const { rowSelection, selectedRowKeys, setSelectedRowKeys } =
    listService.useRowSelection<unknown>("checkbox", [], true, "manual", true);
  const addRecipient = () => {
    return (
      <div className="d-flex gap-2">
        <Button
          type="secondary"
          iconPlace="left"
          icon={<img src={PlusIcon} alt="" />}
          onClick={() => {
            onChangeData({
              emailRecipients: [
                ...data,
                {
                  id: uniqueId(),
                  email: "",
                  name: "",
                },
              ],
            });
          }}
          disabled={isDetail}
        >
          {translate("PL.purchasing_plane_add_email_receiver")}
        </Button>
      </div>
    );
  };

  const handleDelete = (ids: string[]) => {
    const newData = data.filter((item) => !ids.includes(item.id));
    onChangeData({
      emailRecipients: newData,
    });
    const emailReceiverInfoIds = newData.map((item) => item.id);
    const newSelectedRowKeys = selectedRowKeys.filter((item) =>
      emailReceiverInfoIds.includes(item as string)
    );
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleUpdate = (dataUpdate: EmailReceiverInformation, id: string) => {
    onChangeData({
      emailRecipients: data.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            ...dataUpdate,
          };
        }
        return item;
      }),
    });
  };

  const columns: TableColumnsType<EmailReceiverInformation> = [
    {
      title: () => (
        <div className="payment-font-14">
          {translate("PL.purchasing_plan_email")}
          <span className="text-danger">&nbsp;*</span>
        </div>
      ),
      key: "email",
      dataIndex: "email",
      render: (email, record) => {
        if (isDetail) {
          return (
            <LayoutCell>
              <OneLineText value={email} />
            </LayoutCell>
          );
        }

        return (
          <LayoutCell>
            <FormItem
              validateObject={utilService.getValidateObj(record, "email")}
              isTableCell
            >
              <InputText
                placeHolder={translate("PL.purchasing_plan_email_placeholder")}
                value={email}
                onChange={(value) => {
                  handleUpdate(
                    {
                      email: value,
                      errors: {
                        ...record?.errors,
                        email: undefined,
                      },
                    },
                    record.id
                  );
                }}
                regexInput={EMAIL_REGEX}
                translate={translate}
                maxLength={MAX_LENGTH_255}
                isTableCell
                isRequired
                isByteCheck
                allowClear
              />
            </FormItem>
          </LayoutCell>
        );
      },
    },
    {
      title: () => (
        <div className="payment-font-14">
          {translate("PL.purchasing_plan_full_name")}
        </div>
      ),
      key: "name",
      dataIndex: "name",
      render: (name, record) => {
        if (isDetail) {
          return (
            <LayoutCell>
              <OneLineText value={name} />
            </LayoutCell>
          );
        }

        return (
          <LayoutCell>
            <FormItem
              validateObject={utilService.getValidateObj(record, "name")}
              isTableCell
            >
              <InputText
                isTableCell
                placeHolder={translate(
                  "PL.purchasing_plan_full_name_placeholder"
                )}
                value={name}
                onChange={(value) => {
                  handleUpdate(
                    {
                      name: value,
                      errors: {
                        ...record?.errors,
                        name: undefined,
                      },
                    },
                    record.id
                  );
                }}
                maxLength={MAX_LENGTH_255}
                translate={translate}
              />
            </FormItem>
          </LayoutCell>
        );
      },
    },
    {
      key: "id",
      dataIndex: "id",
      align: "center",
      width: 40,
      render: (value: string) => {
        return (
          <LayoutCell className="justify-content-center">
            <div className="action-row position-static">
              <button onClick={() => handleDelete([value])}>
                <img src={IcTrashRed} alt="" />
              </button>
            </div>
          </LayoutCell>
        );
      },
      hidden: isDetail,
    },
  ];

  return (
    <TableWithEmpty
      list={data}
      columns={columns}
      rowSelection={isDetail ? undefined : rowSelection}
      actionBarComponent={
        <>
          {!isDetail && (
            <>
              <div className="mb-2">{addRecipient()}</div>
              <ActionBarComponent
                selectedRowKeys={selectedRowKeys}
                setSelectedRowKeys={setSelectedRowKeys}
              >
                <Button
                  type="secondary"
                  size="sm"
                  onClick={() => handleDelete(selectedRowKeys as string[])}
                >
                  {translate("CM.txt_delete")}
                </Button>
              </ActionBarComponent>
            </>
          )}
        </>
      }
      emptyExtra={
        <CloudyEmpty content={translate("CM.message_empty_data")}>
          {!isDetail ? addRecipient() : ""}
        </CloudyEmpty>
      }
    />
  );
}
