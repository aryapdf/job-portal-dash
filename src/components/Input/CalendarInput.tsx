"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { format, addMonths, subMonths, addYears, subYears, startOfDecade } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ViewMode = "day" | "month" | "year";

interface CustomCalendarFieldProps {
  value?: Date;
  onChange?: (date: Date) => void;
}

export default function CalendarInput({ value, onChange }: CustomCalendarFieldProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("day");
  const [currentDate, setCurrentDate] = useState(value || new Date());

  const isMobile =
    useSelector((state: RootState) => state.screen.deviceType) === "mobile";

  // ===== Header navigation =====
  function handleHeaderClick() {
    if (viewMode === "day") setViewMode("month");
    else if (viewMode === "month") setViewMode("year");
  }

  function handlePrev() {
    if (viewMode === "day") setCurrentDate(subMonths(currentDate, 1));
    else if (viewMode === "month") setCurrentDate(subYears(currentDate, 1));
    else if (viewMode === "year") setCurrentDate(subYears(currentDate, 10));
  }

  function handleNext() {
    if (viewMode === "day") setCurrentDate(addMonths(currentDate, 1));
    else if (viewMode === "month") setCurrentDate(addYears(currentDate, 1));
    else if (viewMode === "year") setCurrentDate(addYears(currentDate, 10));
  }

  // ===== Date Calculations =====
  const decadeStart = startOfDecade(currentDate).getFullYear();
  const decadeYears = Array.from({ length: 10 }, (_, i) => decadeStart + i);

  const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const startDay = start.getDay();
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const days = Array.from({ length: 42 }, (_, i) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      i - startDay + 1
    );
    return date;
  });

  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  // ===== Render UI =====
  return (
    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
          style={{
            padding: isMobile ? "3.5vw 4vw" : "1.41vw 1.143vw",
            fontSize: isMobile ? "3.5vw" : "1vw",
          }}
        >
          <CalendarIcon
            className="ml-auto opacity-50"
            style={{
              width: isMobile ? "4vw" : "1.143vw",
              height: isMobile ? "4vw" : "1.143vw",
            }}
          />
          {value ? format(value, "dd MMMM yyyy") : "Select date"}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-auto p-0">
        <div
          className="bg-white border rounded-2xl shadow-sm select-none"
          style={{
            width: isMobile ? "70vw" : "20vw",
            padding: isMobile ? "3vw" : "1vw",
          }}
        >
          {/* Header */}
          <div
            className="flex justify-between items-center"
            style={{ marginBottom: isMobile ? "3vw" : "1vw" }}
          >
            <button
              onClick={handlePrev}
              className="p-1 rounded-full hover:bg-slate-100"
            >
              <ChevronLeft
                style={{
                  width: isMobile ? "4vw" : "1vw",
                  height: isMobile ? "4vw" : "1vw",
                }}
              />
            </button>

            <div
              onClick={handleHeaderClick}
              className="font-semibold cursor-pointer hover:opacity-80 transition text-center"
              style={{
                fontSize: isMobile ? "3.5vw" : "1vw",
              }}
            >
              {viewMode === "day" && format(currentDate, "MMM yyyy")}
              {viewMode === "month" && format(currentDate, "yyyy")}
              {viewMode === "year" && `${decadeStart} - ${decadeStart + 9}`}
            </div>

            <button
              onClick={handleNext}
              className="p-1 rounded-full hover:bg-slate-100"
            >
              <ChevronRight
                style={{
                  width: isMobile ? "4vw" : "1vw",
                  height: isMobile ? "4vw" : "1vw",
                }}
              />
            </button>
          </div>

          {/* Body */}
          {viewMode === "day" && (
            <>
              <div
                className="grid grid-cols-7 text-center font-semibold text-slate-400"
                style={{
                  fontSize: isMobile ? "3vw" : "0.8vw",
                  marginBottom: isMobile ? "2vw" : "0.5vw",
                }}
              >
                {weekDays.map((d, i) => (
                  <div key={`d-${i}`}>{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 text-center">
                {days.map((d, i) => {
                  const isCurrentMonth = d.getMonth() === currentDate.getMonth();
                  const isSelected = value && d.toDateString() === value.toDateString();
                  return (
                    <div
                      key={i}
                      onClick={() => {
                        onChange?.(d);
                        setCalendarOpen(false);
                      }}
                      className={cn(
                        "rounded-lg cursor-pointer transition-all",
                        isCurrentMonth ? "text-slate-900" : "text-slate-300",
                        isSelected
                          ? "bg-teal-600 text-white"
                          : "hover:bg-slate-100"
                      )}
                      style={{
                        padding: isMobile ? "2.5vw" : "0.5vw",
                        fontSize: isMobile ? "3.5vw" : "0.9vw",
                      }}
                    >
                      {d.getDate()}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {viewMode === "month" && (
            <div
              className="grid grid-cols-3 text-center"
              style={{
                gap: isMobile ? "2vw" : "0.5vw",
                fontSize: isMobile ? "3.5vw" : "0.9vw",
              }}
            >
              {monthNames.map((m, i) => (
                <div
                  key={m}
                  onClick={() => {
                    setCurrentDate(new Date(currentDate.getFullYear(), i, 1));
                    setViewMode("day");
                  }}
                  className="p-2 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  {m}
                </div>
              ))}
            </div>
          )}

          {viewMode === "year" && (
            <div
              className="grid grid-cols-3 text-center"
              style={{
                gap: isMobile ? "2vw" : "0.5vw",
                fontSize: isMobile ? "3.5vw" : "0.9vw",
              }}
            >
              {decadeYears.map((y) => (
                <div
                  key={y}
                  onClick={() => {
                    setCurrentDate(new Date(y, currentDate.getMonth(), 1));
                    setViewMode("month");
                  }}
                  className="p-2 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  {y}
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
