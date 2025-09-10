import { useDebounceFn } from "ahooks";
import { Col, Row } from "antd";
import { IcSearchSVG } from "assets/icons";
import { FilterActionEnum } from "core/services/service-types";
import {
  GoodsServicesCategory,
  PurchaseRequestDetailModel,
} from "models/PurchaseRequest";
import { purchaseRequestRepository } from "pages/PurchasePage/PurchaseRequestPage/PurchaseRequestRepository";
import React, { useContext } from "react";
import {
  Checkbox,
  InputText,
  MultipleSelect,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  GoodsServicesModal,
  GoodsServicesModalContext,
} from "./GoodsServicesModalHook";
import { PurchaseRequestDetailHookContext } from "../../../PurchaseRequestDetailHook";

const Header = () => {
  const [translate] = useTranslation();

  const { modelFilter, dispatchFilter, handleLoadList } =
    useContext<GoodsServicesModal>(GoodsServicesModalContext);

  const { model } = useContext<PurchaseRequestDetailModel>(
    PurchaseRequestDetailHookContext
  );

  const { run } = useDebounceFn(
    (search: string) => {
      const trimmedText = (search || "").replace(/\s+/g, " ").trim();
      dispatchFilter({
        type: FilterActionEnum.UPDATE,
        payload: {
          search: trimmedText,
          pageIndex: 1,
        },
      });
      handleLoadList({ search: trimmedText, pageIndex: 1 });
    },
    {
      wait: 300,
    }
  );

  const handleChangeSelectFilter = React.useCallback(
    (value: GoodsServicesCategory[]) => {
      dispatchFilter({
        type: FilterActionEnum.UPDATE,
        payload: {
          categoryIds: value,
          pageIndex: 1,
        },
      });

      handleLoadList({
        ...modelFilter,
        categoryIds: value,
        pageIndex: 1,
      });
    },
    [dispatchFilter, handleLoadList, modelFilter]
  );

  const handleChangeBoolField = React.useCallback(
    (field: { fieldName: string }) => (value: boolean) => {
      dispatchFilter({
        type: FilterActionEnum.UPDATE,
        payload: {
          [field.fieldName]: value,
          pageIndex: 1,
        },
      });

      handleLoadList({
        ...modelFilter,
        [field.fieldName]: value,
        pageIndex: 1,
      });
    },
    [dispatchFilter, handleLoadList, modelFilter]
  );

  return (
    <div className="search-bar-proposal">
      <Row gutter={16}>
        <Col span={12}>
          <InputText
            prefix={<img src={IcSearchSVG} alt="ic_search" width={16} />}
            value={modelFilter.search}
            placeHolder={translate("PR.enter_goods_code_or_name")}
            onChange={run}
          />
        </Col>
        <Col span={8}>
          <MultipleSelect
            searchType=""
            placeHolder={translate("PR.goods_list")}
            valueFilter={{
              name: "",
              id: model.purchaseProposalId?.id,
            }}
            values={modelFilter?.categoryIds || []}
            getList={purchaseRequestRepository.goodsServiceCategory}
            classFilter={undefined}
            onChange={(values) => {
              handleChangeSelectFilter(values as GoodsServicesCategory[]);
            }}
          />
        </Col>
        <div className="checkbox">
          <Checkbox
            label={translate("RG.txt_quantity_received")}
            checked={modelFilter?.isFullQuantity}
            onChange={handleChangeBoolField({
              fieldName: "isFullQuantity",
            })}
          />
        </div>
      </Row>
    </div>
  );
};

export default Header;
