import React, { useEffect, useState } from "react";
import { useDashboardDropdown } from "./hooks/useDashboardDropdown";
import SummaryDashboard from "./components/SummaryDashboard";
import ChartDashboard from "./components/ChartDashboard";
import AdvanceChartDashboard from "./components/AdvanceChartDashboard";
import ProcessDashboard from "./components/ProcessDashboard";
import DashboardTable from "./components/DashboardTable";
import SimpleListDashboard from "./components/SimpleListDashboard";
import { Card, Col, Dropdown, Row } from "antd";
import TimeRangeSelector from "./components/TimeRangeSelector";
import { useDashboardData } from "./hooks/useDashboardData";
import IconListDashboard from "./components/IconListDashboard";
import ChartDashboardSettings from "./components/ChartDashboardSettings";
import { DashboardItem } from "./types";
import { finalize } from "rxjs";
import { AxiosError } from "axios";
import { dashboardService } from "./DashboardService";
import appMessageService from "../../core/services/common-services/app-message-service";
import { useTranslation } from "react-i18next";

const DashboardPage: React.FC = () => {
  const { data } = useDashboardDropdown();
  const { chartDateRange, setChartDateRange } = useDashboardData();
  const [isChartDashboardSettingsVisible, setChartDashboardSettingsVisible] =
    useState(false);
  const [
    isIconListDashboardSettingsVisible,
    setIconListDashboardSettingsVisible,
  ] = useState(false);
  // Phân vùng theo menuZoneCode
  const zones = {
    FirstLeftZone: [] as any[],
    SecondLeftZone: [] as any[],
    ThirdLeftInnerZone: [] as any[],
    ThirdLeftOuterZone: [] as any[],
    FourthLeftInnerZone: [] as any[],
    FourthLeftOuterZone: [] as any[],
    FirstRightZone: [] as any[],
    SecondRightZone: [] as any[],
  };

  data.forEach((item) => {
    switch (item.menuZoneCode) {
      case "FirstLeftZone":
        zones.FirstLeftZone.push(item);
        break;
      case "SecondLeftZone":
        zones.SecondLeftZone.push(item);
        break;
      case "ThirdLeftInnerZone":
        zones.ThirdLeftInnerZone.push(item);
        break;
      case "ThirdLeftOuterZone":
        zones.ThirdLeftOuterZone.push(item);
        break;
      case "FourthLeftInnerZone":
        zones.FourthLeftInnerZone.push(item);
        break;
      case "FourthLeftOuterZone":
        zones.FourthLeftOuterZone.push(item);
        break;
      case "FirstRightZone":
        zones.FirstRightZone.push(item);
        break;
      case "SecondRightZone":
        zones.SecondRightZone.push(item);
        break;
      default:
        break;
    }
  });

  const [chartDashboardSettings, setChartDashboardSettings] = useState<
    DashboardItem[]
  >([]);

  const [iconListDashboardSettings, setIconListDashboardSettings] = useState<
    DashboardItem[]
  >([]);

  useEffect(() => {
    let i = 0;
    zones.SecondLeftZone.sort((a, b) => {
      if (a.isSelected !== b.isSelected) {
        return a.isSelected ? -1 : 1;
      }

      if (a.hasPermission !== b.hasPermission) {
        return a.hasPermission ? -1 : 1;
      }

      return a.orderDisplay - b.orderDisplay;
    }).forEach((item) => {
      item.orderDisplay = i = i + 1;
      item.isSelected = item.orderDisplay <= 3;
    });

    setChartDashboardSettings([...zones.SecondLeftZone]);
    setIconListDashboardSettings([...zones.FirstRightZone]);
  }, [data]);

  const { notifyToast } = appMessageService.useCRUDMessage();
  const [translate] = useTranslation();

  const submitChartDashboardSettings = async () => {
    dashboardService
      .saveDashboardUsers(chartDashboardSettings)
      .pipe(finalize(() => setChartDashboardSettingsVisible(false)))
      .subscribe({
        next: () => {
          notifyToast({
            message: translate("CM.updateSuccess"),
            placement: "topRight",
          });
        },
        error: (error: AxiosError) => {
          notifyToast({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            message: error.response?.data?.message,
            type: "error",
          });
        },
      });
  };

  const submitIconListDashboardSettings = async () => {
    dashboardService
      .saveDashboardUsers(iconListDashboardSettings)
      .pipe(finalize(() => setIconListDashboardSettingsVisible(false)))
      .subscribe({
        next: () => {
          notifyToast({
            message: translate("CM.updateSuccess"),
            placement: "topRight",
          });
        },
        error: (error: AxiosError) => {
          notifyToast({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            message: error.response?.data?.message,
            type: "error",
          });
        },
      });
  };

  return (
    <div className="dashboard-page">
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col lg={18}>
          <section id={"first-left-zone"}>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              {zones.FirstLeftZone.map((item) => (
                <Col key={item.id} lg={8}>
                  <SummaryDashboard props={item} />
                </Col>
              ))}
            </Row>
          </section>
          <section id={"second-left-zone"}>
            <Card className="second-left-zone" bordered={false}>
              <div className="second-left-zone-header">
                <div className="second-left-zone-header-meta">
                  <TimeRangeSelector setDateRange={setChartDateRange} />
                </div>
                <Dropdown
                  open={isChartDashboardSettingsVisible}
                  onOpenChange={() => {
                    setChartDashboardSettingsVisible(
                      !isChartDashboardSettingsVisible
                    );
                  }}
                  trigger={["click"]}
                  dropdownRender={() => (
                    <ChartDashboardSettings
                      settings={chartDashboardSettings}
                      onChange={setChartDashboardSettings}
                      onSave={() => {
                        submitChartDashboardSettings();
                        setChartDashboardSettingsVisible(false);
                      }}
                      length={3}
                    />
                  )}
                  placement="topRight"
                >
                  <i
                    className="second-left-zone-header-action fa-solid fa-gear"
                    style={{ cursor: "pointer" }}
                  />
                </Dropdown>
              </div>
              <div className="second-left-zone-body">
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  {chartDashboardSettings
                    .sort((a, b) => {
                      if (a.isSelected !== b.isSelected) {
                        return a.isSelected ? -1 : 1;
                      }

                      if (a.hasPermission !== b.hasPermission) {
                        return a.hasPermission ? -1 : 1;
                      }

                      return a.orderDisplay - b.orderDisplay;
                    })
                    .slice(0, 3)
                    .map((item) => (
                      <Col key={item.id} lg={8}>
                        <ChartDashboard
                          props={item}
                          dateRange={chartDateRange}
                        />
                      </Col>
                    ))}
                </Row>
              </div>
            </Card>
          </section>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col lg={16}>
              <section id={"third-left-inner-zone"}>
                {zones.ThirdLeftInnerZone.sort((a, b) => {
                  if (a.isSelected !== b.isSelected) {
                    return a.isSelected ? -1 : 1;
                  }

                  if (a.hasPermission !== b.hasPermission) {
                    return a.hasPermission ? -1 : 1;
                  }

                  return a.orderDisplay - b.orderDisplay;
                })
                  .slice(0, 1)
                  .map((item) => (
                    <AdvanceChartDashboard key={item.id} props={item} />
                  ))}
              </section>
            </Col>
            <Col lg={8} style={{ width: "100%" }}>
              <section id={"third-left-outer-zone"}>
                {zones.ThirdLeftOuterZone.sort((a, b) => {
                  if (a.isSelected !== b.isSelected) {
                    return a.isSelected ? -1 : 1;
                  }

                  if (a.hasPermission !== b.hasPermission) {
                    return a.hasPermission ? -1 : 1;
                  }

                  return a.orderDisplay - b.orderDisplay;
                })
                  .slice(0, 3)
                  .map((item) => (
                    <ProcessDashboard key={item.id} props={item} />
                  ))}
              </section>
            </Col>
          </Row>
        </Col>
        <Col lg={6} className={"w-100"}>
          <section id={"first-right-zone"}>
            <Card className="first-right-zone" bordered={false}>
              <div className="first-right-zone-header">
                <div className="first-right-zone-header-meta">
                  <div className="first-right-zone-header-meta-icon-wrapper">
                    <i className={`fas fa-rocket`} />
                  </div>
                  {translate("dashboards.iconListDashboard.title")}
                </div>
                <Dropdown
                  open={isIconListDashboardSettingsVisible}
                  onOpenChange={() => {
                    setIconListDashboardSettingsVisible(
                      !isIconListDashboardSettingsVisible
                    );
                  }}
                  trigger={["click"]}
                  dropdownRender={() => (
                    <ChartDashboardSettings
                      settings={iconListDashboardSettings}
                      onChange={setIconListDashboardSettings}
                      onSave={() => {
                        submitIconListDashboardSettings();
                        setIconListDashboardSettingsVisible(false);
                      }}
                      length={6}
                    />
                  )}
                  placement="topRight"
                >
                  <i
                    className="first-right-zone-header-action fa-solid fa-gear"
                    style={{ cursor: "pointer" }}
                  />
                </Dropdown>
              </div>
              <div className="first-right-zone-body">
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  {iconListDashboardSettings
                    .sort((a, b) => {
                      if (a.isSelected !== b.isSelected) {
                        return a.isSelected ? -1 : 1;
                      }

                      if (a.hasPermission !== b.hasPermission) {
                        return a.hasPermission ? -1 : 1;
                      }

                      return a.orderDisplay - b.orderDisplay;
                    })
                    .slice(0, 6)
                    .map((item) => (
                      <Col key={item.id} lg={8}>
                        <IconListDashboard props={item} />
                      </Col>
                    ))}
                </Row>
              </div>
            </Card>
          </section>
          <section id={"second-right-zone"}>
            {zones.SecondRightZone.map((item) => (
              <SimpleListDashboard key={item.id} props={item} />
            ))}
          </section>
        </Col>
      </Row>

      {/*
      <section>
        {[...zones.FourthLeftInnerZone, ...zones.FourthLeftOuterZone].map(
          (item) => (
            <DashboardTable key={item.id} props={item} />
          )
        )}
      </section>*/}
    </div>
  );
};

export default DashboardPage;
