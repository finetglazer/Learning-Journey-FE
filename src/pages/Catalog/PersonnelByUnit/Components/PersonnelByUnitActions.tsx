import { useDebounceFn } from "ahooks";
import { Dropdown } from "antd";
import {
  DowLoadTemplateIcon,
  IcSearchSVG,
  UploadDocumentIcon,
} from "assets/icons";
import { FilterIcon } from "assets/images/FilterIcon";
import {
  DEBOUNCE_TIME_300,
  numberConstants,
  STANDARD_DATE_FORMAT_US,
} from "core/config/consts";
import { formatDate } from "core/helpers/date-time";
import { FilterActionEnum } from "core/services/service-types";
import dayjs from "dayjs";
import { gt } from "lodash";
import { useContext, useMemo, useRef } from "react";
import {
  Button,
  DatePicker,
  InputText,
  Tag,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import {
  PersonnelByUnitMasterContext,
  PersonnelByUnitModal,
} from "../PersonnelByUnitMasterHooks";
import { PersonnelByUnitAdvanceFilter } from "./PersonnelByUnitAdvanceFilter";
import { UploadFileCustom } from "components";

const ICON_SIZE = 16;
const DATE_FORMAT = ["MM-YYYY"];

export const PersonnelByUnitActions = () => {
  const {
    modelFilter,
    countFilter,
    dispatchFilter,
    handleLoadList,
    handleResetList,
    handleActionPersonnelByUnit,
    handleImport,
    handleExport,
    handleDownloadTemplate,
    validAction,
  } = useContext(PersonnelByUnitMasterContext);

  const [translate] = useTranslation();
  const addContainerRef = useRef<HTMLDivElement>(null);

  const filterContainerRef = useRef<HTMLDivElement>(null);

  const { run } = useDebounceFn(
    (search: string) => {
      const filter = {
        search: search,
        pageIndex: numberConstants.ONE,
      };
      dispatchFilter({
        type: FilterActionEnum.UPDATE,
        payload: filter,
      });
      handleLoadList(filter);
    },
    {
      wait: DEBOUNCE_TIME_300,
    }
  );

  const { run: handleChangeMonth } = useDebounceFn(
    (date: dayjs.Dayjs) => {
      const filter = {
        date: formatDate(date, STANDARD_DATE_FORMAT_US),
        pageIndex: numberConstants.ONE,
      };
      dispatchFilter({
        type: FilterActionEnum.UPDATE,
        payload: filter,
      });
      handleLoadList(filter);
    },
    {
      wait: DEBOUNCE_TIME_300,
    }
  );

  const handleAddNew = () =>
    handleActionPersonnelByUnit({
      modal: PersonnelByUnitModal.CREATE,
      id: null,
    });

  const defaultDate = useMemo(() => {
    const dateInput = dayjs(modelFilter?.date);
    const isValidDate = dateInput.isValid();
    return isValidDate ? dateInput : dayjs();
  }, [modelFilter?.date]);

  return (
    <div className="personnel-by-unit__action">
      <div className="personnel-by-unit__action__left">
        <DatePicker
          isSmall
          picker="month"
          defaultValue={defaultDate}
          className="personnel-by-unit__action__left__date"
          dateFormat={DATE_FORMAT}
          onChange={handleChangeMonth}
        />
        {validAction("CREATE") && (
          <UploadFileCustom
            type="button"
            titleButton=""
            isMultiple={false}
            icon={<img src={UploadDocumentIcon} alt="img" />}
            className="button__upload"
            uploadFile={handleImport}
          />
        )}
        <Button
          type="icon-ghost"
          className="button__download"
          size="sm"
          icon={<img src={UploadDocumentIcon} alt="img" />}
          iconPlace="left"
          onClick={handleExport}
        />
        {validAction("CREATE") && (
          <Button
            type="tertiary"
            icon={<img src={DowLoadTemplateIcon} alt="img" />}
            className="button__download-template"
            iconPlace="left"
            onClick={handleDownloadTemplate}
          >
            {translate("BG.download_template_file")}
          </Button>
        )}
      </div>
      <div className="personnel-by-unit__action__right">
        {gt(countFilter, numberConstants.ZERO) ? (
          <Tag
            isShowDot={false}
            backgroundColor="#FFD4BC"
            color="#0C2042"
            value={translate("CM.tag_filter", { count: countFilter })}
            action={handleResetList}
            className="tag__container"
          />
        ) : null}
        <div className="w-300px">
          <InputText
            prefix={<img src={IcSearchSVG} alt="ic_search" width={ICON_SIZE} />}
            value={modelFilter.search}
            placeHolder={translate("PBU.placeholder_quickly_search")}
            onChange={run}
            type={numberConstants.ONE}
            isSmall
          />
        </div>
        <Dropdown
          dropdownRender={() => (
            <PersonnelByUnitAdvanceFilter
              setVisible={() => filterContainerRef.current?.click()}
            />
          )}
          trigger={["click"]}
        >
          <div ref={filterContainerRef}>
            <Button
              type="tertiary"
              size="lg"
              icon={<FilterIcon />}
              isUseStrokeSvg
              iconPlace="left"
            >
              {translate("CM.btn_filter")}
            </Button>
          </div>
        </Dropdown>
        {validAction("CREATE") && (
          <div ref={addContainerRef}>
            <Button
              iconPlace="right"
              type="primary"
              size="lg"
              onClick={handleAddNew}
            >
              {translate("BG.btn_add")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
