import React, { useState } from "react";
import { Checkbox, Button, List } from "antd";
import { useTranslation } from "react-i18next";

interface Props {
  settings: any[];
  onChange: (updated: any[]) => void;
  onSave: () => void;
  length: number | null | undefined;
}

const ChartDashboardSettings: React.FC<Props> = ({
  settings,
  onChange,
  onSave,
  length,
}) => {
  const [translate] = useTranslation();

  const handleCheck = (id: string, checked: boolean) => {
    const updated = settings.map((item) =>
      item.id === id ? { ...item, isSelected: checked } : item
    );
    let i = 1;
    for (let j = 0; j < updated.length; j++) {
      if (updated[j].isSelected) {
        updated[j].orderDisplay = i;
        i++;
      }
    }
    onChange(updated);
  };

  return (
    <div style={{ width: 300 }} className={"chart-dashboard-settings"}>
      <div className={"chart-dashboard-settings-header"}>
        {translate("dashboards.chartDashboard.selected")}
      </div>
      <List
        dataSource={settings.filter((it) => it.isSelected)}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <Checkbox
              checked={item.isSelected}
              onChange={(e) => handleCheck(item.id, e.target.checked)}
            >
              {item.name}
            </Checkbox>
          </List.Item>
        )}
      />
      <div className={"chart-dashboard-settings-header"}>
        {translate("dashboards.chartDashboard.unSelected")}
      </div>
      <List
        dataSource={settings
          .filter((it) => !it.isSelected)
          .sort((a, b) => a.name.localeCompare(b.name))}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <Checkbox
              checked={item.isSelected}
              onChange={(e) => handleCheck(item.id, e.target.checked)}
              disabled={
                settings.filter((it) => it.isSelected).length === (length ?? 3)
              }
            >
              {item.name}
            </Checkbox>
          </List.Item>
        )}
        style={{ maxHeight: 200, overflowY: "auto" }}
      />
      <div style={{ marginTop: 8 }}>
        <Button type="primary" block onClick={onSave}>
          {translate("dashboards.chartDashboard.button.save")}
        </Button>
      </div>
    </div>
  );
};

export default ChartDashboardSettings;
