
import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Camera, RefreshCcw } from 'lucide-react';

interface ScannerViewProps {
  onScan: (studentId: string) => boolean;
}

const ScannerView: React.FC<ScannerViewProps> = ({ onScan }) => {
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    // Only init if scanning is true
    if (scanning) {
      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        { 
          fps: 10, 
          qrbox: { width: 250, height: 150 },
          rememberLastUsedCamera: true,
          formatsToSupport: [
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.CODE_39,
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.QR_CODE
          ]
        },
        /* verbose= */ false
      );

      scannerRef.current.render(
        (decodedText) => {
          const success = onScan(decodedText);
          if (success) {
            // Optional: Pause or visual feedback
          }
        },
        (error) => {
          // Normal errors can be ignored
        }
      );
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(e => console.error("Failed to clear scanner", e));
      }
    };
  }, [scanning, onScan]);

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      {!scanning ? (
        <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <Camera className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Mulai Absensi</h2>
          <p className="text-slate-500 mb-8 max-w-[250px]">
            Klik tombol di bawah untuk membuka kamera dan memindai barcode siswa.
          </p>
          <button 
            onClick={() => setScanning(true)}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-2"
          >
            Buka Kamera
          </button>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center">
          <div className="bg-white p-4 rounded-2xl shadow-xl w-full border border-slate-100 mb-6">
            <div id="qr-reader" className="overflow-hidden rounded-lg"></div>
          </div>
          
          <div className="flex items-center gap-4">
             <button 
              onClick={() => {
                setScanning(false);
                setTimeout(() => setScanning(true), 100);
              }}
              className="bg-slate-200 text-slate-700 px-6 py-2 rounded-lg font-medium flex items-center gap-2"
            >
              <RefreshCcw className="w-4 h-4" />
              Reset Kamera
            </button>
            <button 
              onClick={() => setScanning(false)}
              className="bg-slate-800 text-white px-6 py-2 rounded-lg font-medium"
            >
              Berhenti
            </button>
          </div>
          
          <p className="mt-8 text-sm text-slate-400 italic">
            Arahkan kamera ke barcode siswa
          </p>
        </div>
      )}
    </div>
  );
};

export default ScannerView;
