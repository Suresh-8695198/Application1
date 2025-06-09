import { useState } from 'react';
import { toast } from 'react-hot-toast';

const SemesterMarksForm = ({ index, semester, onChange, onRemove }) => {
  const [subjects, setSubjects] = useState(semester.subjects || []);

  const handleSemesterChange = (e) => {
    const { name, value } = e.target;
    onChange(index, { ...semester, [name]: value, subjects });
  };

  const handleSubjectChange = (subjectIndex, updatedSubject) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[subjectIndex] = updatedSubject;
    setSubjects(updatedSubjects);
    onChange(index, { ...semester, subjects: updatedSubjects });
  };

  const addSubject = () => {
    const newSubject = { subject_name: '', category: '', max_marks: '', obtained_marks: '', month_year: '' };
    setSubjects([...subjects, newSubject]);
    onChange(index, { ...semester, subjects: [...subjects, newSubject] });
    toast('Please fill in all fields for the new subject before submitting.', { icon: 'ℹ️' });
  };

  const removeSubject = (subjectIndex) => {
    const updatedSubjects = subjects.filter((_, i) => i !== subjectIndex);
    setSubjects(updatedSubjects);
    onChange(index, { ...semester, subjects: updatedSubjects });
  };

  return (
    <div className="border p-4 mb-4 rounded">
      <h3 className="text-lg font-semibold mb-2">Semester {index + 1}</h3>
      <div className="mb-4">
        <label className="block text-sm font-medium">Semester/Year</label>
        <input
          type="text"
          name="semester"
          value={semester.semester || ''}
          onChange={handleSemesterChange}
          placeholder={`e.g., Semester ${index + 1}`}
          className="w-full p-2 border rounded"
        />
      </div>
      <h4 className="text-md font-medium mb-2">Subjects</h4>
      {subjects.map((subject, subjectIndex) => (
        <div key={subjectIndex} className="border p-2 mb-2 rounded">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium">Subject/Course Name</label>
              <input
                type="text"
                value={subject.subject_name || ''}
                onChange={(e) =>
                  handleSubjectChange(subjectIndex, { ...subject, subject_name: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Category</label>
              <select
                value={subject.category || ''}
                onChange={(e) =>
                  handleSubjectChange(subjectIndex, { ...subject, category: e.target.value })
                }
                className="w-full p-2 border rounded"
              >
                <option value="">Select Category</option>
                <option value="Theory">Theory</option>
                <option value="Practical">Practical</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Maximum Marks</label>
              <input
                type="number"
                value={subject.max_marks || ''}
                onChange={(e) =>
                  handleSubjectChange(subjectIndex, { ...subject, max_marks: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Obtained Marks</label>
              <input
                type="number"
                value={subject.obtained_marks || ''}
                onChange={(e) =>
                  handleSubjectChange(subjectIndex, { ...subject, obtained_marks: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Month & Year of Passing</label>
              <input
                type="text"
                value={subject.month_year || ''}
                onChange={(e) =>
                  handleSubjectChange(subjectIndex, { ...subject, month_year: e.target.value })
                }
                placeholder="e.g., Dec 2023"
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <button
            onClick={() => removeSubject(subjectIndex)}
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
          >
            Remove Subject
          </button>
        </div>
      ))}
      <button
        onClick={addSubject}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add Subject
      </button>
      <button
        onClick={() => onRemove(index)}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Remove Semester
      </button>
    </div>
  );
};

export default SemesterMarksForm;