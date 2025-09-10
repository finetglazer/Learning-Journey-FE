import { useDebounceFn } from "ahooks";
import { IcSearchSVG } from "assets/images";
import { FilterActionEnum } from "core/services/service-types";
import { useContext } from "react";
import { Button, InputText } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  GoodsServicesCategoryMasterContextModel,
  GoodsServicesCategoryMasterContext,
} from "./GoodsServicesCategoryMasterHook";

export const GoodsServicesCategoryMasterAction = () => {
  const goodsServicesCategory =
    useContext<GoodsServicesCategoryMasterContextModel>(
      GoodsServicesCategoryMasterContext
    );
  const {
    modelFilter,
    dispatchFilter,
    handleLoadList,
    handleOpenModal,
    validAction,
  } = goodsServicesCategory;

  const [translate] = useTranslation();

  // const [visible, setVisible] = useState<boolean>(false);

  const { run } = useDebounceFn(
    (search: string) => {
      dispatchFilter({
        type: FilterActionEnum.UPDATE,
        payload: {
          search: search,
          pageIndex: 1,
          // pageSize: 10,
        },
      });
      handleLoadList({ search: search, pageIndex: 1 });
    },
    {
      wait: 300,
    }
  );

  return (
    <>
      <>
        <div className="page-master__filter-action-search d-flex align-items-center mt-4 ms-1"></div>
        <div className="page-master__actions d-flex align-items-center mt-4 me-1">
          <div className="w-300px m-r--xs">
            <InputText
              prefix={<img src={IcSearchSVG} alt="ic_search" width={16} />}
              value={modelFilter.search}
              placeHolder={translate("generalActions.placeholder.search")}
              onChange={run}
              type={1}
              isSmall
            />
          </div>

          {validAction("CREATE") && (
            <Button
              iconPlace="right"
              type="primary"
              size="lg"
              onClick={() => handleOpenModal(null)}
            >
              {translate("CM.btn_add")}
            </Button>
          )}
        </div>
      </>
    </>
  );
};
