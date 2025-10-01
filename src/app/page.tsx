"use client"

import { RoundedButton } from "@/components/core/button/rounded-button"
import { IntegratedDropdown } from "@/components/core/dropdown/integrated-dropdown"
import { TimeDropdown } from "@/components/core/dropdown/time-dropdown"
import { DropdownItem } from "@/components/core/dropdown/type"
import { Icon } from "@/components/core/icon/icon"
import { Tag } from "@/components/core/tag/tag"
import { useState } from "react"
export default function InputWithIcons() {
  const [selectedItem, setSelectedItem] = useState<DropdownItem | null>(null);
  return (
    <div className="flex-col">
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
      <TimeDropdown
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        useSearch
        label={"AAAAAA"}
      />
      <IntegratedDropdown 
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
      />

      {/* <Tag 
        content="Routine"
        type="task"
      /> */}
    </div>
  )
}