"use client"

import { WarningAlertDialog } from "@/components/core/alert/alert";
import { DropdownItem } from "@/components/core/dropdown/type"
import { GradientLoadingBar } from "@/components/core/loading-bar/loading-bar";
import { SegmentedControlOption } from "@/components/core/segmented-control/segmented-control"
import { TaskEditor } from "@/components/core/task/task";
import { TimeConstraintCard } from "@/components/core/time-constraint-card/time-constraint-card";
import { useState } from "react"
export default function InputWithIcons() {
  const [selectedItem, setSelectedItem] = useState<DropdownItem | null>(null);
  const [currentView, setCurrentView] = useState("week");
  const viewOptions: SegmentedControlOption[] = [
    { label: "Year", value: "year" },
    { label: "Month", value: "month" },
    { label: "Week", value: "week" },
    { label: "Day", value: "day" },
  ];
  return (
    <div className="flex-col w-full h-[100vh]">
      {/* <RoundedButton
        id={"D"}
        label={"Save"}
        disabled={false}
      /> */}
      {/* <Icon 
        name="SandClock"
        className="text-blue-600"
      /> */}
      {/* <Icon
        name="SuccessIcon"
        className="text-[#91EEFF]"
      /> */}
      {/* <Icon 
        name="InfoCircle"
      /> */}
      {/* <TimeDropdown
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        useSearch
        label={"AAAAAA"}
      /> */}
      {/* <IntegratedDropdown 
        prefix={(
          <Icon name="StackIcon" className="!h-7 !w-7 mt-2" />
        )}
        useSearch
        label="BBBBBBB"
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        items={[
          {
            id: "1",
            content: "This is A dropdown item",
          },
          {
            id: "2",
            content: "This is B dropdown item 1",
          },
                    {
            id: "3",
            content: "This is a dropdown item",
          },
                    {
            id: "4",
            content: "This is C dropdown item 2",
          },
                    {
            id: "5",
            content: "This is AabBCc dropdown item 12",
          },
        ]}
      /> */}

      {/* <Tag 
        content="Routine"
        type="task"
      /> */}

      {/* <DateRangeNavigator
        dateRangeLabel="AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
      /> */}

      {/* <SegmentedControl
        options={viewOptions}
        value={currentView}
        onValueChange={(value) => setCurrentView(value)}
      /> */}

      {/* <DayWeekViewCalendar 
        tasks={(() => {
          const tasks: Task[] = [];
          const today = dayjs();
          const startOfWeek = today.startOf('week');
          for (let i = 0; i < 1; i++) {
            const startTime = dayJsToISOString(startOfWeek.subtract(2, 'day').hour(9).minute(0).second(0));
            const endTime = dayJsToISOString(startOfWeek.add(14, 'day').hour(17).minute(0).second(0));

            tasks.push({
              id: startTime,
              startTime,
              endTime,
              type: "routine",
              routineStartTime: startTime,
              routineEndTime: endTime,
              routineStartHour: "09:00",
              routineEndHour: "10:00",
            });
          }
          const startTime = dayJsToISOString(startOfWeek.add(2, 'day').hour(13).minute(0).second(0));
          const endTime = dayJsToISOString(startOfWeek.add(2, 'day').hour(15).minute(0).second(0));
          tasks.push({
            id: startTime,
            startTime,
            endTime,
          });
          tasks.push({
            id: startTime,
            startTime,
            endTime,
          });
          tasks.push({
            id: startTime,
            startTime,
            endTime,
          });
          tasks.push({
            id: startTime,
            startTime,
            endTime,
          });
          tasks.push({
            id: startTime,
            startTime,
            endTime,
          });
          tasks.push({
            id: startTime,
            startTime,
            endTime,
          });
          tasks.push({
            id: dayJsToISOString(startOfWeek.add(2, 'day').hour(7).minute(0).second(0)),
            startTime: dayJsToISOString(startOfWeek.add(2, 'day').hour(7).minute(0).second(0)),
            endTime: dayJsToISOString(startOfWeek.add(2, 'day').hour(18).minute(0).second(0)),
          });
          return tasks;
        })()}
      /> */ }

      {/* <WarningAlertDialog /> */}
      {/* <TaskEditor /> */}
      {/* <TimeConstraintCard progress={80} /> */}
      <GradientLoadingBar />
    </div>
  )
}