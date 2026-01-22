
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Scan, 
  Users, 
  History, 
  Upload, 
  Trash2, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  QrCode
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { Student, AttendanceRecord, AppTab } from './types';
import ScannerView from './components/ScannerView';
import StudentManager from './components/StudentManager';
import AttendanceHistory from './components/AttendanceHistory';

const STORAGE_KEY_STUDENTS = 'absensi_students_v1';
const STORAGE_KEY_LOGS = 'absensi_logs_v1';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('SCAN');
  const [students, setStudents] = useState<Student[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Load data from LocalStorage on mount
  useEffect(() => {
    const storedStudents = localStorage.getItem(STORAGE_KEY_STUDENTS);
    const storedLogs = localStorage.getItem(STORAGE_KEY_LOGS);
    if (storedStudents) setStudents(JSON.parse(storedStudents));
    if (storedLogs) setRecords(JSON.parse(storedLogs));
  }, []);

  // Sync state with LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(records));
  }, [records]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAttendance = useCallback((studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) {
      showToast('Siswa tidak terdaftar!', 'error');
      return false;
    }

    const newRecord: AttendanceRecord = {
      id: Math.random().toString(36).substr(2, 9),
      studentId: student.id,
      studentName: student.name,
      timestamp: new Date().toISOString(),
      type: 'IN' // Default to IN for simplicity, logic can be added for toggling
    };

    setRecords(prev => [newRecord, ...prev]);
    showToast(`Absen berhasil: ${student.name}`);
    return true;
  }, [students]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json<any>(ws);

        const newStudents: Student[] = data.map((item, index) => ({
          id: item.ID || item.id || `STU-${Date.now()}-${index}`,
          name: item.Nama || item.name || 'Unknown Student',
          className: item.Kelas || item.class || 'N/A'
        }));

        setStudents(prev => [...prev, ...newStudents]);
        showToast(`${newStudents.length} siswa berhasil diimpor`);
      } catch (error) {
        showToast('Gagal membaca file Excel', 'error');
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = ''; // Reset input
  };

  const clearLogs = () => {
    if (window.confirm('Hapus semua riwayat absensi?')) {
      setRecords([]);
      showToast('Riwayat dihapus');
    }
  };

  const clearStudents = () => {
    if (window.confirm('Hapus semua data siswa?')) {
      setStudents([]);
      showToast('Data siswa dihapus');
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-2xl relative overflow-hidden">
      {/* Header */}
      <header className="bg-blue-600 text-white px-4 py-4 flex items-center justify-between shrink-0 shadow-md z-10">
        <div className="flex items-center gap-2">
          <QrCode className="w-6 h-6" />
          <h1 className="text-xl font-bold tracking-tight">Absensi Barcode</h1>
        </div>
        {activeTab === 'HISTORY' && records.length > 0 && (
          <button onClick={clearLogs} className="p-2 hover:bg-blue-700 rounded-full transition-colors">
            <Trash2 className="w-5 h-5" />
          </button>
        )}
        {activeTab === 'STUDENTS' && students.length > 0 && (
          <button onClick={clearStudents} className="p-2 hover:bg-blue-700 rounded-full transition-colors">
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-slate-50 relative pb-20 no-scrollbar">
        {activeTab === 'SCAN' && (
          <ScannerView onScan={handleAttendance} />
        )}
        {activeTab === 'STUDENTS' && (
          <StudentManager 
            students={students} 
            onUpload={handleFileUpload} 
          />
        )}
        {activeTab === 'HISTORY' && (
          <AttendanceHistory records={records} />
        )}
      </main>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-lg flex items-center gap-2 transition-all duration-300 animate-bounce ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex items-center justify-around py-2 px-4 safe-area-bottom z-20">
        <NavButton 
          active={activeTab === 'SCAN'} 
          onClick={() => setActiveTab('SCAN')} 
          icon={<Scan className="w-6 h-6" />} 
          label="Scan" 
        />
        <NavButton 
          active={activeTab === 'STUDENTS'} 
          onClick={() => setActiveTab('STUDENTS')} 
          icon={<Users className="w-6 h-6" />} 
          label="Siswa" 
        />
        <NavButton 
          active={activeTab === 'HISTORY'} 
          onClick={() => setActiveTab('HISTORY')} 
          icon={<History className="w-6 h-6" />} 
          label="Riwayat" 
        />
      </nav>
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-all duration-200 ${
      active ? 'text-blue-600 transform scale-110 font-bold' : 'text-slate-400'
    }`}
  >
    {icon}
    <span className="text-xs">{label}</span>
  </button>
);

export default App;
