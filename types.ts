
export interface Student {
  id: string;
  name: string;
  className?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  timestamp: string;
  type: 'IN' | 'OUT';
}

export type AppTab = 'SCAN' | 'STUDENTS' | 'HISTORY';
