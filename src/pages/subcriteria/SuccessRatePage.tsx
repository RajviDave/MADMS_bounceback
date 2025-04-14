// SuccessRatePage.tsx

import React, { useEffect, useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Toast } from 'primereact/toast';
import { useApi } from '@/contexts/ApiContext';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

interface Student {
  id: string;
  name: string;
  enrollmentNo: string;
  hasBacklog: boolean;
  backlogSemesters: number[];
  gradeHistory: string;
}

const dummyStudents: Student[] = [
  { id: '1', name: 'John Doe', enrollmentNo: 'EN001', hasBacklog: false, backlogSemesters: [], gradeHistory: '' },
  { id: '2', name: 'Jane Smith', enrollmentNo: 'EN002', hasBacklog: true, backlogSemesters: [3, 4], gradeHistory: '' },
  { id: '3', name: 'Mike Johnson', enrollmentNo: 'EN003', hasBacklog: false, backlogSemesters: [], gradeHistory: '' },
  { id: '4', name: 'Sarah Williams', enrollmentNo: 'EN004', hasBacklog: true, backlogSemesters: [2], gradeHistory: '' },
  { id: '5', name: 'David Brown', enrollmentNo: 'EN005', hasBacklog: false, backlogSemesters: [], gradeHistory: '' },
  { id: '6', name: 'Emily Davis', enrollmentNo: 'EN006', hasBacklog: true, backlogSemesters: [1, 2], gradeHistory: '' },
  { id: '7', name: 'Alex Wilson', enrollmentNo: 'EN007', hasBacklog: false, backlogSemesters: [], gradeHistory: '' },
  { id: '8', name: 'Lisa Anderson', enrollmentNo: 'EN008', hasBacklog: true, backlogSemesters: [5], gradeHistory: '' },
  { id: '9', name: 'Tom Taylor', enrollmentNo: 'EN009', hasBacklog: false, backlogSemesters: [], gradeHistory: '' },
  { id: '10', name: 'Rachel Moore', enrollmentNo: 'EN010', hasBacklog: true, backlogSemesters: [3], gradeHistory: '' }
];

const SuccessRatePage: React.FC = () => {
  const { apiBaseUrl } = useApi();
  const [deleteStudentDialog, setDeleteStudentDialog] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [enrollmentNo, setEnrollmentNo] = useState('');
  const [hasBacklog, setHasBacklog] = useState(false);
  const [selectedSemesters, setSelectedSemesters] = useState<number[]>([]);
  const [gradeHistory, setGradeHistory] = useState<File | null>(null);
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [suggestions, setSuggestions] = useState<Student[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dt = useRef<DataTable<Student[]>>(null);
  const toast = useRef<Toast>(null);

  const handleSemesterChange = (semester: number) => {
    setSelectedSemesters(prev =>
      prev.includes(semester) ? prev.filter(s => s !== semester) : [...prev, semester]
    );
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setGradeHistory(file);
    }
  };

  const confirmDeleteStudent = (student: Student) => {
    setStudentToDelete(student);
    setDeleteStudentDialog(true);
  };

  const deleteStudent = () => {
    setStudents(students.filter(s => s.id !== studentToDelete?.id));
    setDeleteStudentDialog(false);
    setStudentToDelete(null);
    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Student deleted successfully', life: 3000 });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newStudent: Student = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      enrollmentNo,
      hasBacklog,
      backlogSemesters: selectedSemesters,
      gradeHistory: gradeHistory ? URL.createObjectURL(gradeHistory) : ''
    };
    setStudents(prev => [...prev, newStudent]);
    setIsDialogOpen(false);
    setEnrollmentNo('');
    setHasBacklog(false);
    setSelectedSemesters([]);
    setGradeHistory(null);
    setShowAdditionalFields(false);
    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Student added successfully', life: 3000 });
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      const trimmed = enrollmentNo.trim();
      if (!trimmed) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await fetch(`${apiBaseUrl}/student/search?q=${encodeURIComponent(trimmed)}`, {
          credentials: 'include',
        });
        const data = await res.json();

        if (Array.isArray(data)) {
          setSuggestions(data);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        console.error('Suggestion fetch error:', err);
        setSuggestions([]);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [enrollmentNo, apiBaseUrl]);

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <Toast ref={toast} />

      <div className="bg-white rounded-xl shadow p-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-[#2f4883]">Success Rate Details</h2>
          <button
            onClick={() => setIsDialogOpen(true)}
            className="px-4 py-2 bg-[#2f4883] text-white rounded hover:bg-[#25376a] transition-colors"
          >
            Add Details
          </button>
        </div>

        <Toolbar
          className="mb-4"
          right={
            <span className="p-input-icon-left">
              <InputText type="search" onInput={(e) => setGlobalFilter((e.target as HTMLInputElement).value)} placeholder="Search..." />
            </span>
          }
        />

        <DataTable
          ref={dt}
          value={students}
          selection={selectedStudents}
          selectionMode="multiple"
          onSelectionChange={(e) => setSelectedStudents(e.value)}
          dataKey="id"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          globalFilter={globalFilter}
          header={<h3 className="text-xl font-semibold text-[#2f4883]">Student Records</h3>}
          className="p-datatable-sm p-datatable-gridlines"
        >
          <Column selectionMode="multiple" style={{ width: '3rem' }} />
          <Column field="enrollmentNo" header="Enrollment No." sortable />
          <Column field="hasBacklog" header="Has Backlog" body={(row) => (row.hasBacklog ? 'Yes' : 'No')} sortable />
          <Column field="backlogSemesters" header="Backlog Semesters" body={(row) => row.backlogSemesters.join(', ')} />
          <Column field="gradeHistory" header="Grade History" body={() => (
            <Button icon="pi pi-file-pdf" className="p-button-rounded p-button-text" />
          )} />
          <Column
            body={(row) => (
              <div className="flex gap-2 justify-center">
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteStudent(row)} />
              </div>
            )}
            exportable={false}
          />
        </DataTable>
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-[#2f4883]">Add Student Details</h3>
              <button
                onClick={() => {
                  setIsDialogOpen(false);
                  setShowAdditionalFields(false);
                  setEnrollmentNo('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Number</label>
                <input
                  type="text"
                  value={enrollmentNo}
                  onChange={(e) => {
                    setEnrollmentNo(e.target.value);
                    if (e.target.value) setShowSuggestions(true);
                  }}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  onFocus={() => enrollmentNo && setShowSuggestions(true)}
                  placeholder="Enter enrollment number"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-[#2f4883] focus:border-transparent"
                  required
                />
                {showSuggestions && (
                  <ul className="absolute z-50 w-full border bg-white mt-1 max-h-40 overflow-y-auto rounded-md shadow">
                    {suggestions.length > 0 ? (
                      suggestions.map((s, i) => (
                        <li
                          key={i}
                          className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setEnrollmentNo(s.enrollmentNo);
                            setShowSuggestions(false);
                          }}
                        >
                          {s.enrollmentNo}
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-2 text-sm text-gray-500">No matching records</li>
                    )}
                  </ul>
                )}
              </div>

              {showAdditionalFields && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Has Backlog</label>
                    <input
                      type="checkbox"
                      checked={hasBacklog}
                      onChange={(e) => setHasBacklog(e.target.checked)}
                    />
                  </div>

                  {hasBacklog && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Select Backlog Semesters</label>
                      <div className="flex gap-4">
                        {[1, 2, 3, 4, 5, 6].map((semester) => (
                          <div key={semester}>
                            <input
                              type="checkbox"
                              value={semester}
                              checked={selectedSemesters.includes(semester)}
                              onChange={() => handleSemesterChange(semester)}
                            />
                            <label className="ml-2">{`Semester ${semester}`}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Grade History</label>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-[#2f4883] focus:border-transparent"
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-4 mt-4">
                <Button type="button" onClick={() => setIsDialogOpen(false)} className="p-button-secondary">
                  Cancel
                </Button>
                <Button type="submit" className="p-button-primary">Submit</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Dialog visible={deleteStudentDialog} style={{ width: '450px' }} header="Confirm" modal footer={
        <div>
          <Button label="No" icon="pi pi-times" onClick={() => setDeleteStudentDialog(false)} className="p-button-text" />
          <Button label="Yes" icon="pi pi-check" onClick={deleteStudent} className="p-button-text p-button-danger" />
        </div>
      }>
        <p>Are you sure you want to delete this student record?</p>
      </Dialog>
    </div>
  );
};

export default SuccessRatePage;