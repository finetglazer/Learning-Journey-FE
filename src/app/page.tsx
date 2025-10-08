"use client"

import { CalendarDayView } from "@/components/core/calendar/calendar-day-view";
import { CalendarWeekView } from "@/components/core/calendar/calendar-week-view";
import { TaskEditor } from "@/components/core/task-editor/task-editor";
import { BaseTask } from "@/components/core/task/base-task";
import { dayJsToISOString, reId } from "@/lib/utils";
import { Task } from "@/model/task";
import dayjs from "dayjs";
import { useMemo } from "react";
export default function RootPage() {
  const tasks = useMemo(() => {
    const taskArray: Task[] = [];
    const today = dayjs();
    const startOfWeek = today.startOf('week');

    for (let i = 0; i < 1; i++) {
      const taskDay = startOfWeek.add(1, 'day');
      const startTime = dayJsToISOString(taskDay.hour(9).minute(0).second(0));
      const endTime = dayJsToISOString(taskDay.hour(17).minute(0).second(0));

      taskArray.push({
        id: startTime,
        startTime,
        endTime,
        type: "task",
        title: "Task 1",
        description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc,",
      });
    }
    return taskArray;
  }, []);

  return (
    // <CalendarWeekView tasks={tasks} />
    // <BaseTask 
    //   task={tasks[0]}
    //   calendarType="month-planning"
    // />
    <TaskEditor 
      task={{
        ...tasks[0],
        type: 'big-task',
        subtasks: ([
          {
            ...tasks[0],
            id: "123123",
          },
          tasks[0]
        ])
      }}
      // setUpdatedTasks={}
    />
  );
}