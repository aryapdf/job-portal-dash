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
import { GripVertical, Edit, Save, X, Check, Trash2 } from "lucide-react"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

interface Props {
  columns: any
  data: any
  onSaveOrder?: (newOrder: any[]) => void
  onUpdateStatus?: (ids: string[], status: 'approved' | 'declined') => void
  onDelete?: (ids: string[]) => void
}

export default function ModernTable({ columns, data, onSaveOrder, onUpdateStatus, onDelete }: Props) {
  const isMobile = useSelector((state: RootState) => state.screen.deviceType) === "mobile"

  const [rows, setRows] = useState(data)
  const [originalRows, setOriginalRows] = useState(data)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [columnResizeMode] = useState<ColumnResizeMode>("onChange")

  useEffect(() => {
    setRows(data)
    setOriginalRows(data)
  }, [data])

  const table = useReactTable({
    data: rows,
    columns,
    columnResizeMode,
    getCoreRowModel: getCoreRowModel(),
    enableColumnResizing: true,
    columnResizeDirection: "ltr",
  })

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    if (!isEditMode) return

    const { active, over } = event
    if (!over || active.id === over.id) return

    setRows((items: any) => {
      const oldIndex = items.findIndex((item: any) => item.id === active.id)
      const newIndex = items.findIndex((item: any) => item.id === over.id)

      if (oldIndex === -1 || newIndex === -1) return items

      return arrayMove(items, oldIndex, newIndex)
    })
  }

  const handleEditClick = () => {
    setIsEditMode(true)
  }

  const handleSaveOrder = () => {
    setOriginalRows(rows)
    setIsEditMode(false)
    if (onSaveOrder) {
      onSaveOrder(rows)
    }
  }

  const handleCancelEdit = () => {
    setRows(originalRows)
    setIsEditMode(false)
  }

  const toggleRowSelection = (id: string) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const toggleSelectAll = () => {
    if (selectedRows.size === rows.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(rows.map((r: any) => r.id)))
    }
  }

  const handleApprove = () => {
    if (selectedRows.size === 0) return
    if (onUpdateStatus) {
      onUpdateStatus(Array.from(selectedRows), 'approved')
    }
    setSelectedRows(new Set())
  }

  const handleDecline = () => {
    if (selectedRows.size === 0) return
    if (onUpdateStatus) {
      onUpdateStatus(Array.from(selectedRows), 'declined')
    }
    setSelectedRows(new Set())
  }

  const handleDelete = () => {
    if (selectedRows.size === 0) return
    if (confirm(`Are you sure you want to delete ${selectedRows.size} item(s)?`)) {
      if (onDelete) {
        onDelete(Array.from(selectedRows))
      }
      setSelectedRows(new Set())
    }
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

    const isSelected = selectedRows.has(row.original.id)

    return (
      <TableRow
        ref={setNodeRef}
        style={style}
        className={cn(
          "select-none",
          isSelected && "bg-blue-50"
        )}
      >
        {isEditMode && (
          <TableCell
            className="cursor-grab active:cursor-grabbing text-center"
            style={{
              width: isMobile ? "8vw" : "40px",
              minWidth: isMobile ? "8vw" : "40px",
              maxWidth: isMobile ? "8vw" : "40px",
              userSelect: "none",
              padding: isMobile ? "2vw" : "0.571vw",
            }}
            {...attributes}
            {...listeners}
          >
            <GripVertical
              className="mx-auto opacity-60 hover:opacity-100 transition"
              style={{
                width: isMobile ? "4vw" : "16px",
                height: isMobile ? "4vw" : "16px"
              }}
            />
          </TableCell>
        )}

        {!isEditMode && (
          <TableCell
            className="text-center"
            style={{
              width: isMobile ? "8vw" : "40px",
              minWidth: isMobile ? "8vw" : "40px",
              maxWidth: isMobile ? "8vw" : "40px",
              padding: isMobile ? "2vw" : "0.571vw",
            }}
          >
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => toggleRowSelection(row.original.id)}
              style={{
                width: isMobile ? "4vw" : "16px",
                height: isMobile ? "4vw" : "16px"
              }}
            />
          </TableCell>
        )}

        {row.getVisibleCells().map((cell: any) => (
          <TableCell
            key={cell.id}
            style={{
              fontSize: isMobile ? "3vw" : "0.857vw",
              padding: isMobile ? "2vw 1.5vw" : "0.571vw 0.857vw",
              width: cell.column.getSize(),
              minWidth: cell.column.getSize(),
              maxWidth: cell.column.getSize(),
            }}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    )
  }

  const selectedCount = selectedRows.size

  return (
    <div
      className="w-full flex flex-col"
      style={{
        gap: isMobile ? "3vw" : "0.857vw",
        height: "100%"
      }}
    >
      {/* Action Buttons */}
      <div
        className="flex items-center justify-end flex-shrink-0"
        style={{
          gap: isMobile ? "2vw" : "0.571vw",
          flexWrap: "wrap"
        }}
      >
        {isEditMode ? (
          <>
            <Button
              onClick={handleSaveOrder}
              className="flex items-center bg-green-600 hover:bg-green-700"
              style={{
                gap: isMobile ? "1.5vw" : "0.429vw",
                padding: isMobile ? "2vw 3vw" : "0.429vw 0.857vw",
                fontSize: isMobile ? "3vw" : "0.857vw",
                height: isMobile ? "8vw" : "auto"
              }}
            >
              <Save
                style={{
                  width: isMobile ? "3.5vw" : "1vw",
                  height: isMobile ? "3.5vw" : "1vw"
                }}
              />
              Save
            </Button>
            <Button
              onClick={handleCancelEdit}
              variant="outline"
              className="flex items-center"
              style={{
                gap: isMobile ? "1.5vw" : "0.429vw",
                padding: isMobile ? "2vw 3vw" : "0.429vw 0.857vw",
                fontSize: isMobile ? "3vw" : "0.857vw",
                height: isMobile ? "8vw" : "auto"
              }}
            >
              <X
                style={{
                  width: isMobile ? "3.5vw" : "1vw",
                  height: isMobile ? "3.5vw" : "1vw"
                }}
              />
              Cancel
            </Button>
          </>
        ) : (
          <>
            {selectedCount > 0 && (
              <div
                className="text-sm text-gray-600"
                style={{
                  fontSize: isMobile ? "2.5vw" : "0.786vw",
                  marginRight: isMobile ? "2vw" : "0.571vw"
                }}
              >
                {selectedCount} selected
              </div>
            )}
            <Button
              onClick={handleApprove}
              disabled={selectedCount === 0}
              className="flex items-center bg-green-600 hover:bg-green-700 disabled:opacity-50"
              style={{
                gap: isMobile ? "1.5vw" : "0.429vw",
                padding: isMobile ? "2vw 3vw" : "0.429vw 0.857vw",
                fontSize: isMobile ? "3vw" : "0.857vw",
                height: isMobile ? "8vw" : "auto"
              }}
            >
              <Check
                style={{
                  width: isMobile ? "3.5vw" : "1vw",
                  height: isMobile ? "3.5vw" : "1vw"
                }}
              />
              Approve
            </Button>
            <Button
              onClick={handleDecline}
              disabled={selectedCount === 0}
              className="flex items-center bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
              style={{
                gap: isMobile ? "1.5vw" : "0.429vw",
                padding: isMobile ? "2vw 3vw" : "0.429vw 0.857vw",
                fontSize: isMobile ? "3vw" : "0.857vw",
                height: isMobile ? "8vw" : "auto"
              }}
            >
              <X
                style={{
                  width: isMobile ? "3.5vw" : "1vw",
                  height: isMobile ? "3.5vw" : "1vw"
                }}
              />
              Decline
            </Button>
            <Button
              onClick={handleDelete}
              disabled={selectedCount === 0}
              className="flex items-center bg-red-600 hover:bg-red-700 disabled:opacity-50"
              style={{
                gap: isMobile ? "1.5vw" : "0.429vw",
                padding: isMobile ? "2vw 3vw" : "0.429vw 0.857vw",
                fontSize: isMobile ? "3vw" : "0.857vw",
                height: isMobile ? "8vw" : "auto"
              }}
            >
              <Trash2
                style={{
                  width: isMobile ? "3.5vw" : "1vw",
                  height: isMobile ? "3.5vw" : "1vw"
                }}
              />
              Delete
            </Button>
            <Button
              onClick={handleEditClick}
              variant="outline"
              className="flex items-center"
              style={{
                gap: isMobile ? "1.5vw" : "0.429vw",
                padding: isMobile ? "2vw 3vw" : "0.429vw 0.857vw",
                fontSize: isMobile ? "3vw" : "0.857vw",
                height: isMobile ? "8vw" : "auto"
              }}
            >
              <Edit
                style={{
                  width: isMobile ? "3.5vw" : "1vw",
                  height: isMobile ? "3.5vw" : "1vw"
                }}
              />
              Edit
            </Button>
          </>
        )}
      </div>

      {/* Table Container with Sticky Header */}
      <div
        className="rounded-md border overflow-hidden"
        style={{
          width: "100%",
        }}
      >
        {/* Table Header - Fixed */}
        <div className="overflow-hidden">
          <Table
            style={{
              width: table.getTotalSize(),
              minWidth: "100%"
            }}
          >
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  <TableHead
                    className={cn(
                      "font-bold bg-muted/40 text-center select-none"
                    )}
                    style={{
                      width: isMobile ? "8vw" : "40px",
                      minWidth: isMobile ? "8vw" : "40px",
                      maxWidth: isMobile ? "8vw" : "40px",
                      fontSize: isMobile ? "2.5vw" : "0.786vw",
                      padding: isMobile ? "2vw" : "0.571vw",
                    }}
                  >
                    {!isEditMode && (
                      <Checkbox
                        checked={selectedRows.size === rows.length && rows.length > 0}
                        onCheckedChange={toggleSelectAll}
                        style={{
                          width: isMobile ? "4vw" : "16px",
                          height: isMobile ? "4vw" : "16px"
                        }}
                      />
                    )}
                  </TableHead>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "relative font-bold bg-muted/40 select-none"
                      )}
                      style={{
                        width: header.getSize(),
                        minWidth: header.getSize(),
                        maxWidth: header.getSize(),
                        userSelect: "none",
                        padding: isMobile ? "2vw 1.5vw" : "0.571vw 0.857vw",
                        fontSize: isMobile ? "2.5vw" : "0.786vw",
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
                          className={cn(
                            "absolute right-0 top-0 h-full w-1 cursor-col-resize bg-blue-400/50 hover:bg-blue-500 transition-colors",
                            header.column.getIsResizing() && "bg-blue-600"
                          )}
                          style={{
                            userSelect: "none",
                            touchAction: "none",
                          }}
                        />
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
          </Table>
        </div>

        {/* Table Body - Scrollable */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div
            className="overflow-auto"
            style={{
              maxHeight: "60vh",
            }}
          >
            <Table
              style={{
                width: table.getTotalSize(),
                minWidth: "100%"
              }}
            >
              <TableBody>
                <SortableContext
                  items={rows.map((r: any) => r.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {table.getRowModel().rows.map((row: any) => (
                    <SortableRow key={row.original.id} row={row} />
                  ))}
                </SortableContext>
              </TableBody>
            </Table>
          </div>
        </DndContext>
      </div>
    </div>
  )
}