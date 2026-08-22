import React, { useState } from 'react'
import { formatDateRange } from '@/utils/formatDate'
import { MapPin, Calendar, Plus, Trash2, Edit2, ChevronUp, ChevronDown } from 'lucide-react'
import { Card, Button, ConfirmDialog } from '@/components/common'
import { EditStopModal } from './EditStopModal'

export function StopsList({
  stops = [],
  onAddStopClick,
  onUpdateStop,
  onDeleteStop,
  onReorderStops,
  isLoading = false,
}) {
  const [stopToEdit, setStopToEdit] = useState(null)
  const [stopToDelete, setStopToDelete] = useState(null)

  const handleMove = (index, direction) => {
    if (!onReorderStops) return
    const newStops = [...stops]
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= newStops.length) return

    const temp = newStops[index]
    newStops[index] = newStops[targetIndex]
    newStops[targetIndex] = temp

    onReorderStops(newStops.map((s) => s._id || s.id))
  }

  const handleDelete = async () => {
    if (!stopToDelete) return
    const stopId = stopToDelete._id || stopToDelete.id
    await onDeleteStop?.(stopId)
    setStopToDelete(null)
  }

  const handleSaveEdit = async (stopData) => {
    if (!stopToEdit) return
    const stopId = stopToEdit._id || stopToEdit.id
    await onUpdateStop?.(stopId, stopData)
    setStopToEdit(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Route Stops ({stops.length})
          </h3>
          <p className="text-[11px] text-slate-400">Sequenced cities & transit dates</p>
        </div>
        <Button size="sm" variant="primary" icon={Plus} onClick={onAddStopClick}>
          Add Stop
        </Button>
      </div>

      {stops.length === 0 ? (
        <div className="p-6 text-center bg-slate-50/70 rounded-2xl border border-dashed border-slate-200">
          <MapPin className="w-8 h-8 text-teal-600/60 mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-700">No destination stops added</p>
          <p className="text-[11px] text-slate-400 mt-0.5 mb-3">
            Add Paris, Tokyo, Rome or any city to begin sequencing your travel.
          </p>
          <Button size="sm" variant="outline" icon={Plus} onClick={onAddStopClick}>
            Add First Stop
          </Button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {stops.map((stop, idx) => {
            const stopId = stop._id || stop.id
            const cityName = stop.cityName || stop.cityId?.name || 'City'
            const country = stop.country || stop.cityId?.country || ''
            const dateRange = formatDateRange(stop.startDate, stop.endDate)

            return (
              <div
                key={stopId}
                className="group flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-teal-300 shadow-2xs transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Sequence number badge */}
                  <div className="w-6 h-6 rounded-lg bg-teal-50 text-teal-700 font-bold text-xs flex items-center justify-center shrink-0 border border-teal-200/60">
                    {idx + 1}
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {cityName}
                      {country && <span className="text-slate-400 font-normal">, {country}</span>}
                    </h4>
                    {dateRange && (
                      <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-2.5 h-2.5 text-teal-600" /> {dateRange}
                      </p>
                    )}
                    {stop.notes && (
                      <p className="text-[10px] text-slate-400 italic truncate mt-0.5">
                        {stop.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Reorder and action buttons */}
                <div className="flex items-center gap-1 shrink-0">
                  <div className="flex flex-col">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, -1)}
                      className="p-0.5 text-slate-400 hover:text-teal-600 disabled:opacity-20 cursor-pointer"
                      title="Move up"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === stops.length - 1}
                      onClick={() => handleMove(idx, 1)}
                      className="p-0.5 text-slate-400 hover:text-teal-600 disabled:opacity-20 cursor-pointer"
                      title="Move down"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStopToEdit(stop)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                    title="Edit stop"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setStopToDelete(stop)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                    title="Delete stop"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Edit Stop Modal */}
      <EditStopModal
        isOpen={Boolean(stopToEdit)}
        onClose={() => setStopToEdit(null)}
        stop={stopToEdit}
        onUpdateStop={handleSaveEdit}
        isLoading={isLoading}
      />

      {/* Delete Stop Dialog */}
      <ConfirmDialog
        isOpen={Boolean(stopToDelete)}
        onClose={() => setStopToDelete(null)}
        onConfirm={handleDelete}
        title={`Remove ${stopToDelete?.cityName || 'Stop'}?`}
        message="This will remove this destination stop from your multi-city route."
        confirmText="Remove Stop"
        confirmVariant="danger"
        isLoading={isLoading}
      />
    </div>
  )
}

export default StopsList
