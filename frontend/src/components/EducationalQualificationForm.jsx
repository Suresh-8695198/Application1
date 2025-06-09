import { useState } from 'react';

const EducationalQualificationForm = ({ index, qualification, onChange, onRemove }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(index, { ...qualification, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // In a real app, upload the file to the server and get the URL
    const fileUrl = file ? URL.createObjectURL(file) : ''; // For demo purposes
    onChange(index, { ...qualification, marksheet_url: fileUrl });
  };

  return (
    <div className="border p-4 mb-4 rounded">
      <h3 className="text-lg font-semibold mb-2">Qualification {index + 1}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Course</label>
          <select
            name="course"
            value={qualification.course || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Course</option>
            <option value="S.S.L.C">S.S.L.C (10th)</option>
            <option value="HSC">HSC (12th)</option>
            <option value="UG">UG</option>
            <option value="OTHERS">Others</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Institute Name</label>
          <input
            type="text"
            name="institute_name"
            value={qualification.institute_name || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Board/University</label>
          <input
            type="text"
            name="board"
            value={qualification.board || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Subject Studied</label>
          <input
            type="text"
            name="subject_studied"
            value={qualification.subject_studied || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Registration No</label>
          <input
            type="text"
            name="reg_no"
            value={qualification.reg_no || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Percentage</label>
          <input
            type="number"
            name="percentage"
            value={qualification.percentage || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Month & Year of Passing</label>
          <input
            type="text"
            name="month_year"
            value={qualification.month_year || ''}
            onChange={handleChange}
            placeholder="e.g., May 2023"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Mode of Study</label>
          <select
            name="mode_of_study"
            value={qualification.mode_of_study || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Mode</option>
            <option value="Regular">Regular</option>
            <option value="Private">Private (Distance)</option>
            <option value="Others">Others</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Upload Marksheet (Optional)</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
      <button
        onClick={() => onRemove(index)}
        className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
      >
        Remove
      </button>
    </div>
  );
};

export default EducationalQualificationForm;