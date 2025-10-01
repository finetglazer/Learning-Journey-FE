"use client"

import { RoundedButton } from "@/components/core/button/rounded-button"
import { TimeDropdown } from "@/components/core/dropdown/time-dropdown"
import { Icon } from "@/components/core/icon/icon"
import { useState } from "react"
export default function InputWithIcons() {
  const [selectedTimeId, setSelectedTimeId] = useState<string | null>(null);
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
        selectedTimeId={selectedTimeId}
        setSelectedTimeId={setSelectedTimeId}
      />
    </div>
  )
}