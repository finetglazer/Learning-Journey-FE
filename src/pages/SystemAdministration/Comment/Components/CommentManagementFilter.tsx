import { Col, Row } from "antd";
import { utilService } from "core/services/common-services/util-service";
import { filterService } from "core/services/page-services/filter-service";
import { FilterActionEnum } from "core/services/service-types";
import CommonFilter from "models/CommonFilter";
import { CommentFilter } from "models/SystemAdministration";
import { useCallback, useContext, useEffect } from "react";
import {
  Button,
  DateRangePicker,
  FormItem,
  InputText,
  MultipleSelect,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  CommentManagementContext,
  CommentManagementContextProps,
} from "../CommentManagementHook";
import commentManagementRepository from "../CommentManagementRepository";
import { TIME_FORMAT } from "core/config/consts";

const DATE_TIME_FORMAT = "DD/MM/YYYY HH:mm:ss";

export const CommentManagementFilter = () => {
  const {
    modelFilter: filter,
    dispatchFilter: updateFilter,
    handleLoadList,
  } = useContext<CommentManagementContextProps>(CommentManagementContext);
  const [translate] = useTranslation();

  const { modelFilter, dispatchFilter } = filterService.useModelFilter(
    CommentFilter,
    filter
  );

  const {
    handleChangeInputFilter,
    handleChangeDateRangeFilter,
    handleChangeMultipleSelectFilter,
  } = filterService.useFilter(modelFilter, dispatchFilter);

  // Handle reset filter
  const handleResetFilter = useCallback(() => {
    updateFilter({
      type: FilterActionEnum.SET,
      payload: {
        ...new CommentFilter(),
        subSystemId: filter.subSystemId,
      },
    });
    handleLoadList({
      ...new CommentFilter(),
      isReset: true,
    });
  }, [filter.subSystemId, handleLoadList, updateFilter]);

  // Handle apply filter
  const handleApplyFilter = useCallback(() => {
    updateFilter({
      type: FilterActionEnum.SET,
      payload: modelFilter,
    });

    handleLoadList(modelFilter);
  }, [handleLoadList, modelFilter, updateFilter]);

  useEffect(() => {
    dispatchFilter({
      type: FilterActionEnum.SET,
      payload: filter,
    });
  }, [dispatchFilter, filter]);

  return (
    <Row gutter={[16, 16]}>
      {/* Code */}
      <Col span={8}>
        <FormItem
          validateObject={utilService.getValidateObj(modelFilter, "code")}
        >
          <InputText
            isSmall={false}
            label={translate("RM.txt_coupon_code")}
            placeHolder={translate("RM.placeholder_coupon_code")}
            value={modelFilter?.code}
            onChange={handleChangeInputFilter({ fieldName: "code" })}
          />
        </FormItem>
      </Col>
      {/* Comment Sender */}
      <Col span={8}>
        <FormItem>
          <MultipleSelect
            isSmall={false}
            label={translate("RM.txt_comment_sender")}
            placeHolder={translate("RM.placeholder_comment_sender")}
            classFilter={CommonFilter}
            values={modelFilter?.creatorIdsValue || []}
            getList={commentManagementRepository.getUsers}
            onChange={handleChangeMultipleSelectFilter({
              fieldName: "creatorIds",
            })}
            isEnumerable={false}
          />
        </FormItem>
      </Col>
      {/* Mentioned Person */}
      <Col span={8}>
        <FormItem>
          <MultipleSelect
            isSmall={false}
            label={translate("RM.txt_mentioned_person")}
            placeHolder={translate("RM.placeholder_mentioned_person")}
            classFilter={CommonFilter}
            values={modelFilter?.tagIdsValue || []}
            getList={commentManagementRepository.getUsers}
            onChange={handleChangeMultipleSelectFilter({
              fieldName: "tagIds",
            })}
            isEnumerable={false}
          />
        </FormItem>
      </Col>
      {/* Delivery Time */}
      <Col span={8}>
        <FormItem>
          <DateRangePicker
            isSmall={false}
            label={translate("RM.txt_delivery_time")}
            placeholder={[
              translate("PM.payment_date_from_input_label"),
              translate("PM.payment_date_to_input_label"),
            ]}
            dateFormat={[DATE_TIME_FORMAT, DATE_TIME_FORMAT]}
            value={[
              modelFilter?.startDate?.greaterEqual,
              modelFilter?.startDate?.lessEqual,
            ]}
            onChange={handleChangeDateRangeFilter({
              fieldName: "startDate",
              fieldType: ["greaterEqual", "lessEqual"],
              useTime: true,
            })}
            showTime={{ format: TIME_FORMAT }}
          />
        </FormItem>
      </Col>
      {/* Comment Content */}
      <Col span={16}>
        <FormItem>
          <InputText
            isSmall={false}
            label={translate("RM.txt_comment_content")}
            placeHolder={translate("RM.placeholder_comment_content")}
            value={modelFilter?.content}
            onChange={handleChangeInputFilter({ fieldName: "content" })}
          />
        </FormItem>
      </Col>
      {/* Control */}
      <Col span={24}>
        <div className="d-flex flex-row justify-content-end gap-2">
          <Button type="secondary" onClick={handleResetFilter}>
            {translate("CM.btn_reset")}
          </Button>
          <Button type="primary" onClick={handleApplyFilter}>
            {translate("CM.btn_apply")}
          </Button>
        </div>
      </Col>
    </Row>
  );
};
