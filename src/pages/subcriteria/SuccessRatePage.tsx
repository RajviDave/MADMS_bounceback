import React, { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

// Import PrimeReact styles
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
  const [deleteStudentDialog, setDeleteStudentDialog] = useState(false);
  const [deleteStudentsDialog, setDeleteStudentsDialog] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [enrollmentNo, setEnrollmentNo] = useState('');
  const [hasBacklog, setHasBacklog] = useState(false);
  const [selectedSemesters, setSelectedSemesters] = useState<number[]>([]);
  const [gradeHistory, setGradeHistory] = useState<File | null>(null);
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [students, setStudents] = useState<Student[]>(dummyStudents);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const dt = useRef<DataTable<Student[]>>(null);
  const toast = useRef<Toast>(null);

  const handleSemesterChange = (semester: number) => {
    setSelectedSemesters(prev =>
      prev.includes(semester)
        ? prev.filter(s => s !== semester)
        : [...prev, semester]
    );
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setGradeHistory(file);
    }
  };

  const hideDeleteStudentDialog = () => {
    setDeleteStudentDialog(false);
    setStudentToDelete(null);
  };

  const hideDeleteStudentsDialog = () => {
    setDeleteStudentsDialog(false);
  };

  const confirmDeleteStudent = (student: Student) => {
    setStudentToDelete(student);
    setDeleteStudentDialog(true);
  };

  const confirmDeleteSelected = () => {
    setDeleteStudentsDialog(true);
  };

  const deleteStudent = () => {
    setStudents(students.filter(s => s.id !== studentToDelete?.id));
    setDeleteStudentDialog(false);
    setStudentToDelete(null);
    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Student deleted successfully', life: 3000 });
  };

  const deleteSelectedStudents = () => {
    const remainingStudents = students.filter(s => !selectedStudents.includes(s));
    setStudents(remainingStudents);
    setDeleteStudentsDialog(false);
    setSelectedStudents([]);
    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Selected students deleted successfully', life: 3000 });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newStudent: Student = {
      id: Math.random().toString(36).substr(2, 9),
      name: studentName,
      enrollmentNo: enrollmentNo,
      hasBacklog: hasBacklog,
      backlogSemesters: selectedSemesters,
      gradeHistory: gradeHistory ? URL.createObjectURL(gradeHistory) : ''
    };
    setStudents(prev => [...prev, newStudent]);
    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Student added successfully', life: 3000 });
    setIsDialogOpen(false);
    // Reset form
    setStudentName('');
    setEnrollmentNo('');
    setHasBacklog(false);
    setSelectedSemesters([]);
    setGradeHistory(null);
    setShowAdditionalFields(false);
  };

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      {/* Success Rate Details */}
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

        <div className="card overflow-hidden">
          <Toolbar className="mb-4" 
            left={<div className="flex flex-wrap gap-2">
              {/* <Button label="New" icon="pi pi-plus" severity="success" onClick={() => setIsDialogOpen(true)} />
              <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedStudents || !selectedStudents.length} /> */}
            </div>}
            right={<span className="p-input-icon-left">
              {/* <i className="pi pi-search" /> */}
              <InputText type="search" onInput={(e) => setGlobalFilter((e.target as HTMLInputElement).value)} placeholder="Search..." />
            </span>}
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
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} students"
            globalFilter={globalFilter}
            header={<h3 className="text-xl font-semibold text-[#2f4883]">Student Records</h3>}
            className="p-datatable-sm p-datatable-gridlines"
          >
            <Column selectionMode="multiple" exportable={false} style={{ width: '3rem' }}></Column>
            <Column field="name" header="Name" sortable style={{ minWidth: '14rem' }}></Column>
            <Column field="enrollmentNo" header="Enrollment No." sortable style={{ minWidth: '14rem' }}></Column>
            <Column field="hasBacklog" header="Has Backlog" body={(rowData) => rowData.hasBacklog ? 'Yes' : 'No'} sortable style={{ minWidth: '10rem' }}></Column>
            <Column field="backlogSemesters" header="Backlog Semesters" body={(rowData) => rowData.backlogSemesters.join(', ')} style={{ minWidth: '14rem' }}></Column>
            <Column field="gradeHistory" header="Grade History" body={(rowData) => (
              <Button icon="pi pi-file-pdf" className="p-button-rounded p-button-text" onClick={() => {}} tooltip="View Grade History" />
            )} style={{ minWidth: '10rem' }}></Column>
            <Column body={(rowData) => (
              <div className="flex gap-2 justify-center">
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => {}} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteStudent(rowData)} />
              </div>
            )} exportable={false} style={{ minWidth: '8rem' }}></Column>
          </DataTable>
        </div>
      </div>

      {/* Add Details Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-[#2f4883]">Add Student Details</h3>
              <button
                onClick={() => {
                  setIsDialogOpen(false);
                  setShowAdditionalFields(false);
                  setStudentName('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Student Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student Name
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => {
                    setStudentName(e.target.value);
                    if (e.target.value) {
                      setShowAdditionalFields(true);
                    } else {
                      setShowAdditionalFields(false);
                    }
                  }}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-[#2f4883] focus:border-transparent"
                  required
                />
              </div>



              {showAdditionalFields && (
                <>
                  {/* Grade History Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Grade History
                    </label>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded file:border-0
                        file:text-sm file:font-medium
                        file:bg-[#2f4883] file:text-white
                        hover:file:bg-[#25376a]"
                      required
                    />
                  </div>

                  {/* Backlog Status */}
                  <div>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasBacklog}
                        onChange={(e) => setHasBacklog(e.target.checked)}
                        className="form-checkbox h-5 w-5 text-[#2f4883] rounded"
                      />
                      <span className="text-gray-700">Has Backlog</span>
                    </label>
                  </div>

                  {/* Semester Selection */}
                  {hasBacklog && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Semesters with Backlog
                      </label>
                      <div className="grid grid-cols-4 gap-4">
                        {Array.from({ length: 8 }, (_, i) => i + 1).map((semester) => (
                          <label key={semester} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedSemesters.includes(semester)}
                              onChange={() => handleSemesterChange(semester)}
                              className="form-checkbox h-5 w-5 text-[#2f4883] rounded"
                            />
                            <span className="text-gray-700">Semester {semester}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#2f4883] text-white rounded hover:bg-[#25376a] transition-colors"
                    >
                      Submit
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}
          <Dialog visible={deleteStudentDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={
        <>
          <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteStudentDialog} />
          <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteStudent} />
        </>
      } onHide={hideDeleteStudentDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {studentToDelete && (
            <span>
              Are you sure you want to delete <b>{studentToDelete.name}</b>?
            </span>
          )}
        </div>
      </Dialog>

      <Dialog visible={deleteStudentsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={
        <>
          <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteStudentsDialog} />
          <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedStudents} />
        </>
      } onHide={hideDeleteStudentsDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          <span>Are you sure you want to delete the selected students?</span>
        </div>
      </Dialog>
    </div>
  );
};

export default SuccessRatePage;
