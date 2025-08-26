"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export interface DateRange {
  start: Date | null
  end: Date | null
}

interface DatePickerWithRangeProps {
  date?: DateRange
  onDateChange?: (date: DateRange) => void
  className?: string
  placeholder?: string
}

export function DatePickerWithRange({
  date,
  onDateChange,
  className,
  placeholder = "Pick a date range"
}: DatePickerWithRangeProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [tempStart, setTempStart] = React.useState("")
  const [tempEnd, setTempEnd] = React.useState("")

  React.useEffect(() => {
    if (date?.start) {
      setTempStart(format(date.start, "yyyy-MM-dd"))
    }
    if (date?.end) {
      setTempEnd(format(date.end, "yyyy-MM-dd"))
    }
  }, [date])

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setTempStart(value)
    
    if (value) {
      // Parse YYYY-MM-DD into local Date to avoid timezone shifts when using new Date(string)
      const [y, m, d] = value.split('-').map(Number);
      const startDate = new Date(y, (m || 1) - 1, d || 1);
      onDateChange?.({ start: startDate, end: date?.end || null })
    }
  }

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setTempEnd(value)
    
    if (value) {
      const [y, m, d] = value.split('-').map(Number);
      const endDate = new Date(y, (m || 1) - 1, d || 1);
      onDateChange?.({ start: date?.start || null, end: endDate })
    }
  }

  const formatDisplayText = () => {
    if (date?.start && date?.end) {
      return `${format(date.start, "MMM dd, yyyy")} - ${format(date.end, "MMM dd, yyyy")}`
    }
    if (date?.start) {
      return `${format(date.start, "MMM dd, yyyy")} - ...`
    }
    return placeholder
  }

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="outline"
        className={cn(
          "w-full justify-start text-left font-normal",
          !date?.start && !date?.end && "text-muted-foreground"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {formatDisplayText()}
      </Button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-md border bg-popover p-4 text-popover-foreground shadow-md">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Start Date</label>
              <Input
                type="date"
                value={tempStart}
                onChange={handleStartDateChange}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">End Date</label>
              <Input
                type="date"
                value={tempEnd}
                onChange={handleEndDateChange}
                className="w-full"
                min={tempStart}
              />
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  onDateChange?.({ start: null, end: null })
                  setTempStart("")
                  setTempEnd("")
                }}
              >
                Clear
              </Button>
              <Button
                size="sm"
                onClick={() => setIsOpen(false)}
                className="ml-auto"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}