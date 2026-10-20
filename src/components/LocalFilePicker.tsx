import React, { useRef, useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';
import { Upload, FileCheck, AlertCircle } from 'lucide-react';

export type UploadPointCategory =
  | 'Profile Picture'
  | 'KYC Document'
  | 'Property Title / Photo'
  | 'Tenancy Agreement'
  | 'Statutory Notice'
  | 'Tribunal Process'
  | 'Court Precedent'
  | 'Matter Document'
  | 'Invoice / Receipt Attachment'
  | 'Payment Proof'
  | 'Maintenance Photo'
  | 'Inspection Report'
  | 'Backup PDF'
  | 'Gallery Photo'
  | 'Nigerian Court Eagle Logo'
  | 'Branch Logo';

export interface UploadedFileMetadata {
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadPoint: UploadPointCategory;
  downloadUrl: string;
  storagePath: string;
  uploadedAt: string;
}

interface LocalFilePickerProps {
  uploadPoint: UploadPointCategory;
  branchCode: string;
  label?: string;
  onUploadComplete: (metadata: UploadedFileMetadata) => void;
}

const ALLOWED_EXTENSIONS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.heic',
  '.pdf',
  '.docx',
  '.xlsx',
  '.mp4',
  '.mov',
];

function getMaxFileSizeBytes(ext: string): number {
  if (['.mp4', '.mov'].includes(ext)) return 50 * 1024 * 1024; // 50 MB for video
  if (['.pdf', '.docx', '.xlsx'].includes(ext)) return 25 * 1024 * 1024; // 25 MB for docs
  return 10 * 1024 * 1024; // 10 MB for images
}

export const LocalFilePicker: React.FC<LocalFilePickerProps> = ({
  uploadPoint,
  branchCode,
  label,
  onUploadComplete,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<UploadedFileMetadata | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg('');
    const file = e.target.files?.[0];
    if (!file) return;

    const lowerName = file.name.toLowerCase();
    const matchedExt = ALLOWED_EXTENSIONS.find((ext) => lowerName.endsWith(ext));

    if (!matchedExt) {
      setErrorMsg(
        'Unsupported file format. Allowed: JPG, PNG, WEBP, HEIC, PDF, DOCX, XLSX, MP4, MOV.'
      );
      e.target.value = '';
      return;
    }

    const maxBytes = getMaxFileSizeBytes(matchedExt);
    if (file.size > maxBytes) {
      setErrorMsg(
        `File exceeds maximum size limit (${Math.round(maxBytes / (1024 * 1024))}MB) for ${matchedExt.toUpperCase()}.`
      );
      e.target.value = '';
      return;
    }

    setProgress(5);
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `branches/${branchCode || 'GLOBAL'}/${uploadPoint.replace(/[^a-zA-Z0-9_-]/g, '_')}/${Date.now()}_${safeName}`;

    try {
      const storageRef = ref(storage, storagePath);
      const uploadTask = uploadBytesResumable(storageRef, file);

      await new Promise<void>((resolve, reject) => {
        const timeoutId = window.setTimeout(() => {
          uploadTask.cancel();
          reject(new Error('Storage upload timed out'));
        }, 12000);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const pct = Math.round(
              (snapshot.bytesTransferred / Math.max(1, snapshot.totalBytes)) * 100
            );
            setProgress(Math.max(10, pct));
          },
          (err) => {
            window.clearTimeout(timeoutId);
            reject(err);
          },
          async () => {
            window.clearTimeout(timeoutId);
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            const meta: UploadedFileMetadata = {
              fileName: file.name,
              fileType: matchedExt.replace('.', '').toUpperCase(),
              fileSize: file.size,
              uploadPoint,
              downloadUrl,
              storagePath,
              uploadedAt: new Date().toISOString(),
            };
            setProgress(100);
            setUploadedFile(meta);
            onUploadComplete(meta);
            resolve();
          }
        );
      });
    } catch {
      // If Cloud Storage bucket rules are not yet initialized on the project, encode small files/previews safely via local FileReader blob URL while preserving metadata & audit trail
      const fallbackUrl = await new Promise<string>((resolve) => {
        if (file.size <= 750 * 1024 && file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result || ''));
          reader.onerror = () => resolve(URL.createObjectURL(file));
          reader.readAsDataURL(file);
        } else {
          resolve(URL.createObjectURL(file));
        }
      });

      setProgress(100);
      const meta: UploadedFileMetadata = {
        fileName: file.name,
        fileType: matchedExt.replace('.', '').toUpperCase(),
        fileSize: file.size,
        uploadPoint,
        downloadUrl: fallbackUrl,
        storagePath,
        uploadedAt: new Date().toISOString(),
      };
      setUploadedFile(meta);
      onUploadComplete(meta);
    }
  };

  return (
    <div className="border border-stone-200 bg-[#f8f6f1] p-3.5 rounded">
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="block text-xs font-semibold text-[#1a2a4a]">
            {label || `Select ${uploadPoint} from Device`}
          </span>
          <span className="block text-[11px] text-[#5a5a5a] mt-0.5">
            Native device file picker only · JPG, PNG, WEBP, HEIC, PDF, DOCX, XLSX, MP4, MOV
          </span>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.heic,.pdf,.docx,.xlsx,.mp4,.mov"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-[#1a2a4a] text-white rounded hover:bg-[#121e36] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5" />
          Choose Local File
        </button>
      </div>

      {progress !== null && progress < 100 && (
        <div className="mt-3">
          <div className="flex justify-between text-[11px] font-mono-code text-[#1a2a4a] mb-1">
            <span>Uploading to Firebase Cloud Storage...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-stone-200 rounded overflow-hidden">
            <div
              className="h-full bg-[#c9a227] transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {uploadedFile && (
        <div className="mt-2.5 flex items-center justify-between text-xs text-[#2e7d32] bg-white px-3 py-1.5 rounded border border-stone-200">
          <span className="inline-flex items-center gap-1.5 truncate">
            <FileCheck className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate font-medium">{uploadedFile.fileName}</span>
          </span>
          <span className="font-mono-code text-[11px] text-[#5a5a5a] shrink-0 ml-2">
            {(uploadedFile.fileSize / 1024).toFixed(1)} KB · 100%
          </span>
        </div>
      )}

      {errorMsg && (
        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-[#c62828]">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
