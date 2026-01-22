
import React from 'react';
import { AttendanceRecord } from '../types';
import { Calendar, Clock, UserCheck } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface AttendanceHistoryProps {
  records: AttendanceRecord[];
}

const AttendanceHistory: React.FC<AttendanceHistoryProps> = ({ records }) => {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="font-bold text-slate-700">Log Absensi Terbaru</h3>
        <span className="text-xs text-slate-400 font-medium bg-slate-100 px-2 py-1 rounded-full uppercase tracking-tighter">
          {records.length} Baris
        </span>
      </div>

      {records.length === 0 ? (
        <div className="bg-white rounded-xl p-10 text-center border-2 border-dashed border-slate-200">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-400 text-sm">Belum ada riwayat absensi hari ini.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map(record => (
            <div key={record.id} className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-l-blue-500 flex items-center justify-between animate-in slide-in-from-left duration-300">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 leading-tight">{record.studentName}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {format(new Date(record.timestamp), 'HH:mm:ss')}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {format(new Date(record.timestamp), 'dd MMM yyyy', { locale: id })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-[10px] font-black rounded uppercase">
                  HADIR
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttendanceHistory;
