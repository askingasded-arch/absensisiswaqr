
import React, { useRef } from 'react';
import { Student } from '../types';
import { Upload, Download, UserPlus, FileSpreadsheet } from 'lucide-react';
import JsBarcode from 'jsbarcode';

interface StudentManagerProps {
  students: Student[];
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const StudentManager: React.FC<StudentManagerProps> = ({ students, onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateAndDownloadBarcode = (student: Student) => {
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, student.id, {
      format: "CODE128",
      lineColor: "#000",
      width: 2,
      height: 100,
      displayValue: true
    });
    
    const link = document.createElement('a');
    link.download = `barcode-${student.name.replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const downloadAllBarcodes = () => {
    // In a real app, you might zip these, but here we can iterate or show instructions
    alert("Fitur download masal akan mengunduh satu per satu. Disarankan download saat dibutuhkan.");
    students.forEach((s, i) => {
      setTimeout(() => generateAndDownloadBarcode(s), i * 500);
    });
  };

  return (
    <div className="p-4 space-y-4">
      {/* Upload Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <FileSpreadsheet className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">Impor Data Siswa</h3>
        <p className="text-sm text-slate-500 mb-4">
          Unggah file Excel dengan kolom: <b>ID, Nama, Kelas</b>
        </p>
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={onUpload}
          accept=".xlsx, .xls"
          className="hidden"
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="w-full bg-green-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-green-100 flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <Upload className="w-5 h-5" />
          Pilih File Excel
        </button>
      </div>

      {/* Student List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-2">
          <h3 className="font-bold text-slate-700">Daftar Siswa ({students.length})</h3>
          {students.length > 0 && (
            <button 
              onClick={downloadAllBarcodes}
              className="text-blue-600 text-sm font-bold flex items-center gap-1"
            >
              <Download className="w-4 h-4" />
              Simpan Semua
            </button>
          )}
        </div>

        {students.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center border-2 border-dashed border-slate-200">
            <UserPlus className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-400 text-sm">Belum ada data siswa.<br/>Impor melalui Excel di atas.</p>
          </div>
        ) : (
          students.map(student => (
            <div key={student.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-bold text-slate-800">{student.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                    {student.className}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">ID: {student.id}</span>
                </div>
              </div>
              <button 
                onClick={() => generateAndDownloadBarcode(student)}
                className="p-3 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                title="Download Barcode"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentManager;
