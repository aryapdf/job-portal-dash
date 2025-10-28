"use client"

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnResizeMode,
} from "@tanstack/react-table"
import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { GripVertical } from "lucide-react"
import { useSelector } from "react-redux"
import { RootState } from "@/store"

interface Props {
  columns: any
  data: any
}

export default function ModernTable({ columns, data }: Props) {
  const isMobile =
    useSelector((state: RootState) => state.screen.deviceType) === "mobile"

  const [rows, setRows] = useState(data)
  const [columnResizeMode] = useState<ColumnResizeMode>("onChange")

  useEffect(() => {
    setRows(data)
  }, [data])

  const table = useReactTable({
    data: rows,
    columns,
    columnResizeMode,
    getCoreRowModel: getCoreRowModel(),
  })

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setRows((items) => {
      const oldIndex = items.findIndex((item: any) => item.id === active.id)
      const newIndex = items.findIndex((item: any) => item.id === over.id)

      if (oldIndex === -1 || newIndex === -1) return items

      return arrayMove(items, oldIndex, newIndex)
    })
  }

  function SortableRow({ row }: any) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging
    } = useSortable({ id: row.original.id })

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
      zIndex: isDragging ? 1 : 0,
      position: 'relative' as const,
    }

    return (
      <TableRow
        ref={setNodeRef}
        style={style}
        className="select-none"
      >
        {row.getVisibleCells().map((cell: any) => (
          <TableCell
            key={cell.id}
            style={{
              fontSize: isMobile ? "3.5vw" : "0.9rem",
              padding: isMobile ? "2.5vw 2vw" : "0.857vw"
            }}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}

        {/* Grab handle cell */}
        <TableCell
          className="cursor-grab active:cursor-grabbing text-center"
          style={{
            width: isMobile ? "8vw" : "2.5vw",
            userSelect: "none",
            padding: isMobile ? "2vw" : "0.5vw",
          }}
          {...attributes}
          {...listeners}
        >
          <GripVertical
            className="mx-auto opacity-60 hover:opacity-100 transition"
            style={{
              width: isMobile ? "5vw" : "1.143vw",
              height: isMobile ? "5vw" : "1.143vw"
            }}
          />
        </TableCell>
      </TableRow>
    )
  }

  return (
    <div
      className="overflow-auto rounded-md border"
      style={{
        maxHeight: "70vh",
      }}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <Table className="min-w-full w-fit">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "relative font-bold bg-muted/40 select-none"
                    )}
                    style={{
                      width: header.getSize(),
                      userSelect: "none",
                      padding: isMobile ? "3vw 2vw" : "1.14vw",
                      fontSize: isMobile ? "3vw" : "0.857vw"
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getCanResize() && (
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className="absolute right-0 top-0 h-full w-1 cursor-col-resize bg-gray-300 hover:bg-gray-500"
                      />
                    )}
                  </TableHead>
                ))}
                <TableHead
                  className={cn(
                    "font-bold bg-muted/40 text-center select-none"
                  )}
                  style={{
                    width: isMobile ? "8vw" : "2.5vw",
                    fontSize: isMobile ? "3vw" : "0.857vw",
                    padding: isMobile ? "3vw 2vw" : "1.14vw"
                  }}
                >

                </TableHead>
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            <SortableContext
              items={rows.map((r: any) => r.id)}
              strategy={verticalListSortingStrategy}
            >
              {table.getRowModel().rows.map((row) => (
                <SortableRow key={row.original.id} row={row} />
              ))}
            </SortableContext>
          </TableBody>
        </Table>
      </DndContext>
    </div>
  )
}