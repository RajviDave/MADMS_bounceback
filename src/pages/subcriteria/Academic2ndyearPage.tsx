import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';


import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

interface Student {
  
  name: string;
  enrollmentNo: string;
  CGPA: string;
  academicyear: string;
  appeared: string;
  
}

const Academic2ndyearPage: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [cgpa, setCgpa] = useState('');
  
  
const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  const [hasAppeared, setHasAppeared] = useState<boolean | null>(null);
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    setIsDialogOpen(false);
    // Reset form
    setStudentName('');
    setCgpa('');
    setHasAppeared(null);
    setShowAdditionalFields(false);
  };

   const [info, setinfo] = useState([
      {name: 'Rajvi', enrollmentNo: '1321', CGPA: '9', academicyear: '2021',appeared:'Yes' },
     
    ]);

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      {/* Academic Performance Details */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-[#2f4883]">Academic Performance Details</h2>
          <button
            onClick={() => setIsDialogOpen(true)}
            className="px-4 py-2 bg-[#2f4883] text-white rounded hover:bg-[#25376a] transition-colors"
          >
            Add Details
          </button>
        </div>

        {/* Academic Performance Table */}
        <table className="min-w-full text-sm text-left mt-6">
          <thead className="text-gray-500 border-b">
            <tr>
              <th className="py-2 px-4">Academic Year</th>
              <th className="py-2 px-4">Mean CGPA (X)</th>
              <th className="py-2 px-4">Total Successful Students (Y)</th>
              <th className="py-2 px-4">Total Students Appeared (Z)</th>
              <th className="py-2 px-4">API = X* (Y/Z)</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            <tr className="border-b">
              <td className="py-2 px-4">CAYm1 (2023-2024)</td>
              <td className="py-2 px-4">6.95</td>
              <td className="py-2 px-4">58</td>
              <td className="py-2 px-4">58</td>
              <td className="py-2 px-4">6.95</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4">CAYm2 (2022-2023)</td>
              <td className="py-2 px-4">7.57</td>
              <td className="py-2 px-4">66</td>
              <td className="py-2 px-4">66</td>
              <td className="py-2 px-4">7.57</td>
            </tr>
            <tr>
              <td className="py-2 px-4">CAYm3 (2021-2022)</td>
              <td className="py-2 px-4">7.37</td>
              <td className="py-2 px-4">49</td>
              <td className="py-2 px-4">49</td>
              <td className="py-2 px-4">7.37</td>
            </tr>
            <tr className="border-t border-gray-300 font-medium">
              <td className="py-2 px-4">Average API = (AP1+AP2+AP3)/3</td>
              <td className="py-2 px-4"></td>
              <td className="py-2 px-4"></td>
              <td className="py-2 px-4"></td>
              <td className="py-2 px-4">7.29</td>
            </tr>
          </tbody>
        </table>

        <DataTable value={info} tableStyle={{ minWidth: '50rem' }} dataKey="enrollmentNo">
                  <Column field="name" header="name" sortable style={{ width: '25%' }}></Column>
                  <Column field="enrollment" header="enrollmentNo" sortable style={{ width: '25%' }}></Column>
                  <Column field="CGPA" header="CGPA" sortable style={{ width: '25%' }}></Column>
                  <Column field="academicyear" header="academicyear" sortable style={{ width: '25%' }}></Column>
                  <Column field="appeared" header="Appeared" sortable style={{ width: '25%' }}></Column>
                   <Column body={(rowData) => (
                    <div className="flex gap-2 justify-center">

                      </div>
                    )} exportable={false} style={{ minWidth: '8rem' }}></Column>
                    <Column body={(rowData) => (
                                <div className="flex gap-2 justify-center">
                                  <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => {}} />
                                  <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => {
    setStudentToDelete(rowData);
    setShowDeleteDialog(true);
  }} />
                                  </div>
                                )} exportable={false} style={{ minWidth: '8rem' }}></Column>
              </DataTable>

      </div>

      {/* Add Details Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-[#2f4883]">Add Student Details</h3>
              <button
                onClick={() => {
                  setIsDialogOpen(false);
                  setShowAdditionalFields(false);
                  setStudentName('');
                  setCgpa('');
                  setHasAppeared(null);
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
                  {/* CGPA Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Grade (CGPA)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      value={cgpa}
                      onChange={(e) => setCgpa(e.target.value)}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-[#2f4883] focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Exam Appearance Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Has the student appeared in exam?
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="hasAppeared"
                          checked={hasAppeared === true}
                          onChange={() => setHasAppeared(true)}
                          className="form-radio h-5 w-5 text-[#2f4883]"
                          required
                        />
                        <span className="text-gray-700">Yes</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="hasAppeared"
                          checked={hasAppeared === false}
                          onChange={() => setHasAppeared(false)}
                          className="form-radio h-5 w-5 text-[#2f4883]"
                          required
                        />
                        <span className="text-gray-700">No</span>
                      </label>
                    </div>
                  </div>

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

<Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
  <DialogContent className="sm:max-w-[400px] text-center space-y-4">
    <DialogTitle>Are you sure you want to delete?</DialogTitle>
    <div className="flex justify-center space-x-4 pt-4">
      <button
        onClick={() => {
          if (studentToDelete) {
            setinfo(prev => prev.filter(p => p.enrollmentNo !== studentToDelete.enrollmentNo));
          }
          setShowDeleteDialog(false);
          setStudentToDelete(null);
        }}
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
      >
        Yes
      </button>
      <button
        onClick={() => setShowDeleteDialog(false)}
        className="px-4 py-2 border rounded-md hover:bg-gray-100"
      >
        No
      </button>
    </div>
  </DialogContent>
</Dialog>

    </div>
  );
};

export default Academic2ndyearPage;