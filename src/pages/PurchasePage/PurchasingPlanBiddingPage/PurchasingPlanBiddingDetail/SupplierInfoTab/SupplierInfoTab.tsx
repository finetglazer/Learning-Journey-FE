import {
  InformationSectionKey,
  listTypesNegotiation,
  RenderTabProps,
  SupplierRound,
} from "models/PurchasingPlan";
import { useContext } from "react";
import AdvancedCollapseView from "components/AdvancedCollapseView/AdvancedCollapseView";
import { useTranslation } from "react-i18next";
import { isArray, size } from "lodash";
import { formatDate } from "core/helpers/date-time";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import { v4 as uuidv4 } from "uuid";
import SupplierTableMoreRound from "pages/PurchasePage/PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferDetail/GenerationInfoTab/Components/SupplierInformation/Components/SupplierTableMoreRound/SupplierTableMoreRound";
import { PurchasingPlanBiddingDetailHookContext } from "../PurchasingPlanBiddingDetailHook";
import SupplierInformation from "pages/PurchasePage/PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferDetail/GenerationInfoTab/Components/SupplierInformation/SupplierInformation";

type SupplierInfoTabProps = {
  isDetail?: boolean;
};
const SupplierInfoTab = ({ isDetail = false }: SupplierInfoTabProps) => {
  const currentContext = useContext(PurchasingPlanBiddingDetailHookContext);

  const [translate] = useTranslation();

  const convertDataFromRoundSupplier = (roundSupplier: SupplierRound[]) => {
    if (!roundSupplier) {
      return [];
    }
    return roundSupplier?.map((round) => {
      return {
        ...round,
        supplierPurchasePlans: round?.supplierPurchasePlans?.map((supplier) => {
          return {
            ...supplier,
            supplierType: {
              name: supplier?.type,
            },
            emailReceiverInfo: supplier?.emailRecipients?.map((item) => {
              return {
                ...item,
                id: uuidv4(),
              };
            }),
          };
        }),
      };
    });
  };

  const roundSuppliers = convertDataFromRoundSupplier(
    currentContext?.model?.roundSuppliers
  );

  const renderTab = ({ component, key, title }: RenderTabProps) => {
    return (
      <div>
        <AdvancedCollapseView
          items={[
            {
              key: key,
              label: <div className="fw-bold">{translate(title)}</div>,
              children: component,
            },
          ]}
          showAll={false}
          defaultActiveKey={[InformationSectionKey.SUPPLIER_INFORMATION]}
        />
      </div>
    );
  };

  const moreRound = isArray(roundSuppliers) && size(roundSuppliers) > 1;

  if (!moreRound) {
    return (
      <div>
        {renderTab({
          component: (
            <SupplierInformation
              contextValue={currentContext}
              isDetail={isDetail}
              isView={isDetail}
            />
          ),
          key: InformationSectionKey.SUPPLIER_INFORMATION.toString(),
          title: "PL.purchasing_plan_supplier_information",
        })}
      </div>
    );
  }

  const renderMoreRound = () => {
    const items = roundSuppliers.map((roundSupplier) => {
      const { roundNumber, type } = roundSupplier;
      const title = listTypesNegotiation?.find(
        (item) => item?.id?.toString() === type?.toString()
      )?.name;
      const key = `${roundNumber}: ${formatDate(
        roundSupplier.startDate,
        STANDARD_DATE_FORMAT_SLASH
      )} - ${formatDate(roundSupplier.endDate, STANDARD_DATE_FORMAT_SLASH)}`;

      const titleTranslated = translate(title);

      return {
        key: roundNumber,
        label: (
          <div className="fw-bold">
            {titleTranslated} {key}
          </div>
        ),
        children: (
          <SupplierTableMoreRound
            contextValue={currentContext}
            isDetail={isDetail}
            isView={isDetail}
            idContainer={key}
            suppliers={roundSupplier?.supplierPurchasePlans}
          />
        ),
      };
    });

    return (
      <AdvancedCollapseView
        items={items}
        isFullView={true}
        showAll={false}
        defaultActiveKey={[
          ...roundSuppliers.map((roundSupplier) => roundSupplier.roundNumber),
        ]}
      />
    );
  };

  return (
    <div>
      {renderTab({
        component: renderMoreRound(),
        key: InformationSectionKey.SUPPLIER_INFORMATION.toString(),
        title: "PL.purchasing_plan_supplier_information",
      })}
    </div>
  );
};

export default SupplierInfoTab;
