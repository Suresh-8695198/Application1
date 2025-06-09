import { useCallback, memo, useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Select from 'react-select';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { BookOpen, Building, FileText, Calendar, Percent, Globe, Trash2, Hash, List, Upload, Eye } from 'lucide-react';

// Lazy-load DocumentPreviewModal
const DocumentPreviewModal = lazy(() => import('./DocumentPreviewModal'));

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const EducationalQualificationForm = memo(({ index, qualification, onChange, onRemove, isStatic = false }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const debouncedOnChange = debounce((index, updatedQual) => onChange(index, updatedQual), 300);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    debouncedOnChange(index, { ...qualification, [name]: value });
  };

  const handleSelectChange = (selectedOption, { name }) => {
    onChange(index, { ...qualification, [name]: selectedOption ? selectedOption.value : '' });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only PDF, JPG, JPEG, and PNG files are allowed');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('qualification_type', qualification.course || `Qualification ${index + 1}`);
    formData.append('email', localStorage.getItem('userEmail') || '');

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:8000/api/upload-marksheet/', formData, {
        headers: { 'Authorization': `Token ${token}`, 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onChange(index, { ...qualification, uploadProgress: percentCompleted });
        },
      });
      if (res.data.status === 'success') {
        toast.success('Marksheet uploaded successfully!');
        const marksheetField = {
          'S.S.L.C': 'sslc_marksheet_url',
          'HSC': 'hsc_marksheet_url',
        }[qualification.course] || 'ug_marksheet_url';
        onChange(index, { ...qualification, [marksheetField]: res.data.file_url, uploadProgress: 0 });
      } else {
        toast.error(res.data.message || 'Failed to upload marksheet');
      }
    } catch (err) {
      toast.error('Error uploading marksheet: ' + (err.response?.data?.message || err.message));
      onChange(index, { ...qualification, uploadProgress: 0 });
    }
  };

  const selectOptions = {
    mode_of_study: [
      { value: '', label: 'Select Mode' },
      { value: 'Regular', label: 'Regular' },
      { value: 'Distance', label: 'Distance' },
      { value: 'Online', label: 'Online' },
    ],
    course: [
      { value: '', label: 'Select Course' },
      { value: 'Diploma', label: 'Diploma' },
      { value: 'UG', label: 'UG' },
      { value: 'OTHERS', label: 'Others' },
    ],
  };

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(4px)',
      borderRadius: '0.75rem',
      padding: '0.5rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(34, 197, 94, 0.2)',
      fontFamily: 'Roboto, sans-serif',
      fontWeight: 500,
      fontSize: '1.125rem',
      color: '#1f2937',
      transition: 'all 0.3s ease',
      '&:hover': { borderColor: '#22c55e', boxShadow: '0 0 10px rgba(34, 197, 94, 0.2)' },
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '0.75rem',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(4px)',
      border: '1px solid rgba(34, 197, 94, 0.2)',
    }),
    option: (provided, state) => ({
      ...provided,
      fontFamily: 'Roboto, sans-serif',
      fontWeight: 500,
      fontSize: '1.125rem',
      color: state.isSelected ? '#ffffff' : '#1f2937',
      backgroundColor: state.isSelected ? '#22c55e' : state.isFocused ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
      '&:hover': { backgroundColor: 'rgba(34, 197, 94, 0.1)' },
    }),
    singleValue: (provided) => ({ ...provided, color: '#1f2937' }),
    placeholder: (provided) => ({ ...provided, color: 'rgba(75, 85, 99, 0.7)' }),
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-white/90 p-6 rounded-xl shadow-md border border-green-100/50 mb-4"
      >
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold font-roboto text-gray-800">{isStatic ? qualification.course : `Qualification ${index + 1}`}</h4>
          {!isStatic && (
            <motion.button
              type="button"
              onClick={() => onRemove(index)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-200"
            >
              <Trash2 className="h-5 w-5" />
            </motion.button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'course', label: 'Course', type: isStatic ? 'text' : 'select', icon: BookOpen },
            { name: 'institute_name', label: 'Institute Name', type: 'text', icon: Building },
            { name: 'board', label: 'Board/University', type: 'text', icon: FileText },
            { name: 'subject_studied', label: 'Subjects Studied', type: 'text', icon: BookOpen },
            { name: 'reg_no', label: 'Register Number', type: 'text', icon: FileText },
            { name: 'percentage', label: 'Percentage', type: 'number', icon: Percent, min: 0, max: 100, step: 0.01 },
            { name: 'month_year', label: 'Month & Year', type: 'text', icon: Calendar, placeholder: 'MM/YYYY' },
          ].map(({ name, label, type, icon: Icon, min, max, step, placeholder }) => (
            <div key={name} className="relative">
              <label className="block text-lg font-medium text-gray-800 font-roboto mb-2">
                {label} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                {type === 'select' ? (
                  <Select
                    name={name}
                    value={selectOptions.course.find(opt => opt.value === qualification[name]) || { value: '', label: 'Select Course' }}
                    onChange={handleSelectChange}
                    options={selectOptions.course}
                    styles={customSelectStyles}
                    className="font-roboto pl-10"
                    classNamePrefix="select"
                  />
                ) : (
                  <input
                    type={type}
                    name={name}
                    value={qualification[name] || ''}
                    onChange={handleInputChange}
                    disabled={name === 'course' && isStatic}
                    min={min}
                    max={max}
                    step={step}
                    placeholder={placeholder}
                    className={`w-full pl-10 p-4 bg-white/80 backdrop-blur-sm rounded-xl border-2 border-green-300 shadow-sm focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition duration-300 font-roboto font-medium text-lg text-gray-900 placeholder-gray-400/70 hover:border-green-400 hover:shadow-green-200/50 ${name === 'course' && isStatic ? 'cursor-not-allowed bg-gray-100/70' : ''}`}
                  />
                )}
              </div>
            </div>
          ))}
          <div className="relative">
            <label className="block text-lg font-medium text-gray-800 font-roboto mb-2">
              Mode of Study <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
              <Select
                name="mode_of_study"
                value={selectOptions.mode_of_study.find(opt => opt.value === qualification.mode_of_study) || { value: '', label: 'Select Mode' }}
                onChange={handleSelectChange}
                options={selectOptions.mode_of_study}
                styles={customSelectStyles}
                className="font-roboto pl-10"
                classNamePrefix="select"
              />
            </div>
          </div>
          <div className="relative">
            <label className="block text-lg font-medium text-gray-800 font-roboto mb-2">
              Upload Marksheet <span className="text-red-500">*</span>
            </label>
            <div className="relative border-2 border-dashed border-green-300 rounded-xl p-4 bg-white/80 backdrop-blur-sm hover:border-green-400 transition duration-300">
              <input
                type="file"
                id={`marksheet-${index}`}
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center text-center">
                <Upload className="h-8 w-8 text-green-500 mb-2" />
                <p className="text-gray-600 font-roboto text-sm">
                  Drag and drop your marksheet or <span className="text-green-600 font-semibold">click to upload</span>
                </p>
                <p className="text-gray-400 text-xs mt-1">PDF, JPG, JPEG (max 5MB)</p>
                {qualification.uploadProgress > 0 && (
                  <div className="w-full mt-2">
                    <div className="bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-green-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${qualification.uploadProgress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <p className="text-green-600 text-xs mt-1">{qualification.uploadProgress}%</p>
                  </div>
                )}
              </div>
            </div>
            {(qualification.sslc_marksheet_url || qualification.hsc_marksheet_url || qualification.ug_marksheet_url) && (
              <motion.button
                type="button"
                onClick={() => setPreviewOpen(true)}
                whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(34, 197, 94, 0.5)' }}
                whileTap={{ scale: 0.95 }}
                animate={{ scale: [1, 1.02, 1], transition: { duration: 1.5, repeat: Infinity } }}
                disabled={qualification.uploadProgress > 0}
                className="mt-3 flex items-center px-5 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg font-roboto font-semibold text-sm shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview Marksheet
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
      <Suspense fallback={<div className="text-gray-600 font-roboto text-sm">Loading preview...</div>}>
        <DocumentPreviewModal
          isOpen={previewOpen}
          onClose={() => setPreviewOpen(false)}
          documentUrl={qualification.sslc_marksheet_url || qualification.hsc_marksheet_url || qualification.ug_marksheet_url}
          documentType={qualification.sslc_marksheet_url ? 'application/pdf' : 'image/jpeg'}
        />
      </Suspense>
    </>
  );
});

const SemesterMarksForm = memo(({ index, semester, onChange, onRemove, isOptional = false }) => {
  const debouncedOnChange = debounce((index, updatedSem) => onChange(index, updatedSem), 300);

  const handleSemesterChange = (e) => {
    const { name, value } = e.target;
    debouncedOnChange(index, { ...semester, [name]: value });
  };

  const handleSubjectChange = (subjectIndex, updatedSubject) => {
    const updatedSubjects = semester.subjects.map((sub, i) => i === subjectIndex ? updatedSubject : sub);
    onChange(index, { ...semester, subjects: updatedSubjects });
  };

  const handleAddSubject = () => {
    onChange(index, {
      ...semester,
      subjects: [...semester.subjects, { subject_name: '', category: '', max_marks: '', obtained_marks: '', month_year: '' }],
    });
  };

  const handleRemoveSubject = (subjectIndex) => {
    onChange(index, { ...semester, subjects: semester.subjects.filter((_, i) => i !== subjectIndex) });
  };

  const handleSelectChange = (selectedOption, { name }, subjectIndex) => {
    const updatedSubjects = [...semester.subjects];
    updatedSubjects[subjectIndex] = { ...updatedSubjects[subjectIndex], [name]: selectedOption ? selectedOption.value : '' };
    onChange(index, { ...semester, subjects: updatedSubjects });
  };

  const selectOptions = {
    category: [
      { value: '', label: 'Select Category' },
      { value: 'Theory', label: 'Theory' },
      { value: 'Practical', label: 'Practical' },
    ],
  };

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(4px)',
      borderRadius: '0.75rem',
      padding: '0.5rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(124, 58, 237, 0.2)',
      fontFamily: 'Roboto, sans-serif',
      fontWeight: 500,
      fontSize: '1.125rem',
      color: '#1f2937',
      transition: 'all 0.3s ease',
      '&:hover': { borderColor: '#7c3aed', boxShadow: '0 0 10px rgba(124, 58, 237, 0.2)' },
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '0.75rem',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(4px)',
      border: '1px solid rgba(124, 58, 237, 0.2)',
    }),
    option: (provided, state) => ({
      ...provided,
      fontFamily: 'Roboto, sans-serif',
      fontWeight: 500,
      fontSize: '1.125rem',
      color: state.isSelected ? '#ffffff' : '#1f2937',
      backgroundColor: state.isSelected ? '#7c3aed' : state.isFocused ? 'rgba(124, 58, 237, 0.1)' : 'transparent',
      '&:hover': { backgroundColor: 'rgba(124, 58, 237, 0.1)' },
    }),
    singleValue: (provided) => ({ ...provided, color: '#1f2937' }),
    placeholder: (provided) => ({ ...provided, color: 'rgba(75, 85, 99, 0.7)' }),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white/90 p-6 rounded-xl shadow-md border border-purple-100/50 mb-4"
    >
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold font-roboto text-gray-800">Semester {index + 1} {isOptional ? '(Optional)' : ''}</h4>
        <motion.button
          type="button"
          onClick={() => onRemove(index)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-200"
        >
          <Trash2 className="h-5 w-5" />
        </motion.button>
      </div>
      <div className="mb-4">
        <label className="block text-lg font-medium text-gray-800 font-roboto mb-2">
          Semester/Year <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-500" />
          <input
            type="text"
            name="semester"
            value={semester.semester || ''}
            onChange={handleSemesterChange}
            placeholder="e.g., Semester 1 or Year 1"
            className="w-full pl-10 p-4 bg-white/80 backdrop-blur-sm rounded-xl border-2 border-purple-300 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition duration-300 font-roboto font-medium text-lg text-gray-900 placeholder-gray-400/70 hover:border-purple-400 hover:shadow-purple-200/50"
          />
        </div>
      </div>
      <div className="space-y-4">
        <h5 className="text-lg font-semibold font-roboto text-gray-800">Subjects</h5>
        {semester.subjects.map((subject, subIndex) => (
          <motion.div
            key={subIndex}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white/80 p-4 rounded-lg border border-purple-200/50"
          >
            <div className="flex justify-between items-center mb-3">
              <h6 className="text-base font-medium font-roboto text-gray-700">Subject {subIndex + 1}</h6>
              <motion.button
                type="button"
                onClick={() => handleRemoveSubject(subIndex)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-1 bg-red-400 text-white rounded-full hover:bg-red-500 transition duration-200"
              >
                <Trash2 className="h-4 w-4" />
              </motion.button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'subject_name', label: 'Subject Name', type: 'text', icon: BookOpen },
                { name: 'max_marks', label: 'Max Marks', type: 'number', icon: Percent, min: 0, step: 1 },
                { name: 'obtained_marks', label: 'Obtained Marks', type: 'number', icon: Percent, min: 0, step: 1 },
                { name: 'month_year', label: 'Month & Year', type: 'text', icon: Calendar, placeholder: 'MM/YYYY' },
              ].map(({ name, label, type, icon: Icon, min, step, placeholder }) => (
                <div key={name} className="relative">
                  <label className="block text-base font-medium text-gray-800 font-roboto mb-2">
                    {label} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-500" />
                    <input
                      type={type}
                      name={name}
                      value={subject[name] || ''}
                      onChange={(e) => handleSubjectChange(subIndex, { ...subject, [name]: e.target.value })}
                      min={min}
                      step={step}
                      placeholder={placeholder}
                      className="w-full pl-10 p-3 bg-white/80 backdrop-blur-sm rounded-xl border-2 border-purple-300 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition duration-300 font-roboto font-medium text-base text-gray-900 placeholder-gray-400/70 hover:border-purple-400 hover:shadow-purple-200/50"
                    />
                  </div>
                </div>
              ))}
              <div className="relative">
                <label className="block text-base font-medium text-gray-800 font-roboto mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <List className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-500" />
                  <Select
                    name="category"
                    value={selectOptions.category.find(opt => opt.value === subject.category) || { value: '', label: 'Select Category' }}
                    onChange={(opt) => handleSelectChange(opt, { name: 'category' }, subIndex)}
                    options={selectOptions.category}
                    styles={customSelectStyles}
                    className="font-roboto pl-10"
                    classNamePrefix="select"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        <motion.button
          type="button"
          onClick={handleAddSubject}
          whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(124, 58, 237, 0.4)' }}
          whileTap={{ scale: 0.95 }}
          className="px-5 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl hover:from-purple-600 hover:to-indigo-600 transition duration-300 font-roboto font-semibold text-base shadow-md flex items-center"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Add Subject
        </motion.button>
      </div>
    </motion.div>
  );
});

const SemesterMarksheetUpload = memo(({ onFileChange, marksheetUrl, uploadProgress }) => {
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only PDF files are allowed');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds 10MB limit');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('qualification_type', 'Semester Marks');
    formData.append('email', localStorage.getItem('userEmail') || '');

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:8000/api/upload-marksheet/', formData, {
        headers: { 'Authorization': `Token ${token}`, 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onFileChange({ uploadUrl: '', uploadProgress: percentCompleted });
        },
      });
      if (res.data.status === 'success') {
        toast.success('Semester marksheet uploaded successfully!');
        onFileChange({ uploadUrl: res.data.file_url || '', uploadProgress: 0 });
      } else {
        toast.error(res.data.message || 'Failed to upload marksheet');
        onFileChange({ uploadUrl: '', uploadProgress: 0 });
      }
    } catch (err) {
      toast.error('Error uploading marksheet: ' + (err.response?.data?.message || err.message));
      onFileChange({ uploadUrl: '', uploadProgress: 0 });
    }
  };

  return (
    <>
      <div className="relative mt-4">
        <label className="block text-lg font-medium text-gray-800 font-roboto mb-2">
          Upload a single PDF containing all semester marksheets <span className="text-red-500">*</span>
        </label>
        <div className="relative border-2 border-dashed border-purple-300 rounded-xl p-6 bg-white/80 backdrop-blur-sm hover:border-purple-400 transition duration-200">
          <input
            type="file"
            id="semester-marksheet"
            onChange={handleFileChange}
            accept=".pdf"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center justify-center text-center">
            <Upload className="h-8 w-8 text-purple-500 mb-2" />
            <p className="text-gray-600 font-roboto text-sm">
              Drag and drop your semester marksheet PDF or <span className="text-purple-600 font-semibold">click to upload</span>
            </p>
            <p className="text-gray-400 text-sm mt-2">PDF only (max 10MB)</p>
            {uploadProgress > 0 && (
              <div className="w-full mt-3">
                <div className="bg-gray-200 rounded-full h-3">
                  <motion.div
                    className="bg-purple-500 h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="text-purple-600 text-sm mt-1">{uploadProgress}%</p>
              </div>
            )}
          </div>
        </div>
        {marksheetUrl && (
          <motion.button
            type="button"
            onClick={() => setPreviewOpen(true)}
            whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(124, 58, 237, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            animate={{ scale: [1, 1.02, 1], transition: { duration: 1.5, repeat: Infinity } }}
            disabled={uploadProgress > 0}
            className="mt-3 flex items-center px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-roboto font-semibold text-sm shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview Marksheet
          </motion.button>
        )}
      </div>
      <Suspense fallback={<div className="text-gray-600 font-roboto text-sm">Loading preview...</div>}>
        <DocumentPreviewModal
          isOpen={previewOpen}
          onClose={() => setPreviewOpen(false)}
          documentUrl={marksheetUrl}
          documentType="application/pdf"
        />
      </Suspense>
    </>
  );
});

const QualificationsAndSemesters = memo(({ formData, setFormData, loading, isOptionalSemester }) => {
  const calculateTotals = useCallback(() => {
    const totalMaxMarks = formData.semester_marks.reduce((sum, semester) =>
      sum + semester.subjects.reduce((subSum, subject) => subSum + (parseFloat(subject.max_marks) || 0), 0), 0);
    const totalObtainedMarks = formData.semester_marks.reduce((sum, semester) =>
      sum + semester.subjects.reduce((subSum, subject) => subSum + (parseFloat(subject.obtained_marks) || 0), 0), 0);
    const percentage = totalMaxMarks > 0 ? ((totalObtainedMarks / totalMaxMarks) * 100).toFixed(2) : 0;
    return { totalMaxMarks, totalObtainedMarks, percentage };
  }, [formData.semester_marks]);

  const handleQualificationChange = useCallback((index, updatedQualification) => {
    setFormData(prev => ({
      ...prev,
      qualifications: prev.qualifications.map((qual, i) => i === index ? updatedQualification : qual),
    }));
  }, [setFormData]);

  const handleAddQualification = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      qualifications: [
        ...prev.qualifications,
        { course: '', institute_name: '', board: '', subject_studied: '', reg_no: '', percentage: '', month_year: '', mode_of_study: '', ug_marksheet_url: '', uploadProgress: 0 },
      ],
      semester_marks: [
        ...prev.semester_marks,
        ...Array.from({ length: 6 }).map((_, i) => ({
          semester: `Semester ${(prev.semester_marks?.length || 0) + i + 1}`,
          subjects: [],
        })),
      ],
    }));
  }, [setFormData]);

  const handleRemoveQualification = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== index),
      semester_marks: prev.semester_marks.length > 6 ? prev.semester_marks.slice(0, -6) : prev.semester_marks,
    }));
  }, [setFormData]);

  const handleSemesterChange = useCallback((index, updatedSemester) => {
    setFormData(prev => {
      const updatedSemesters = prev.semester_marks.map((sem, i) => i === index ? updatedSemester : sem);
      const { totalMaxMarks, totalObtainedMarks, percentage } = calculateTotals();
      return {
        ...prev,
        semester_marks: updatedSemesters,
        total_max_marks: totalMaxMarks,
        total_obtained_marks: totalObtainedMarks,
        percentage: percentage,
      };
    });
  }, [setFormData, calculateTotals]);

  const handleAddSemester = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      semester_marks: [
        ...prev.semester_marks,
        { semester: `Semester ${prev.semester_marks.length + 1}`, subjects: [] },
      ],
    }));
  }, [setFormData]);

  const handleRemoveSemester = useCallback((index) => {
    setFormData(prev => {
      const updatedSemesters = prev.semester_marks.filter((_, i) => i !== index);
      const { totalMaxMarks, totalObtainedMarks, percentage } = calculateTotals();
      return {
        ...prev,
        semester_marks: updatedSemesters,
        total_max_marks: totalMaxMarks,
        total_obtained_marks: totalObtainedMarks,
        percentage: percentage,
      };
    });
  }, [setFormData, calculateTotals]);

  const handleSemesterMarksheetChange = useCallback(({ uploadUrl, uploadProgress }) => {
    setFormData(prev => ({
      ...prev,
      semester_marksheet: { url: uploadUrl || prev.semester_marksheet?.url || '', uploadProgress: uploadProgress },
    }));
  }, [setFormData]);

  const handleSummaryChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }, [setFormData]);

  const selectOptions = {
    class_obtained: [
      { value: '', label: 'Select Class' },
      { value: 'First Class', label: 'First Class' },
      { value: 'Second Class', label: 'Second Class' },
      { value: 'Third Class', label: 'Third Class' },
      { value: 'Pass', label: 'Pass' },
    ],
  };

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(4px)',
      borderRadius: '0.75rem',
      padding: '0.5rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(124, 58, 237, 0.2)',
      fontFamily: 'Roboto, sans-serif',
      fontWeight: 500,
      fontSize: '1.125rem',
      color: '#1f2937',
      transition: 'all 0.3s ease',
      '&:hover': { borderColor: '#7c3aed', boxShadow: '0 0 10px rgba(124, 58, 237, 0.2)' },
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '0.75rem',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(4px)',
      border: '1px solid rgba(124, 58, 237, 0.2)',
    }),
    option: (provided, state) => ({
      ...provided,
      fontFamily: 'Roboto, sans-serif',
      fontWeight: 500,
      fontSize: '1.125rem',
      color: state.isSelected ? '#ffffff' : '#1f2937',
      backgroundColor: state.isSelected ? '#7c3aed' : state.isFocused ? 'rgba(124, 58, 237, 0.1)' : 'transparent',
      '&:hover': { backgroundColor: 'rgba(124, 58, 237, 0.1)' },
    }),
    singleValue: (provided) => ({ ...provided, color: '#1f2937' }),
    placeholder: (provided) => ({ ...provided, color: 'rgba(75, 85, 99, 0.7)' }),
  };

  const hasAdditionalQualifications = formData.qualifications.some(qual => !['S.S.L.C', 'HSC'].includes(qual.course));

  return (
    <div className="space-y-6">
      <div className="space-y-6 bg-white/80 p-6 rounded-xl shadow-sm border border-purple-100/50">
        <h3 className="text-2xl font-semibold font-montserrat bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600 mb-6">
          Educational Qualifications
        </h3>
        <AnimatePresence>
          {formData?.qualifications?.map((qualification, index) => (
            <EducationalQualificationForm
              key={`qual-${index}`}
              index={index}
              qualification={qualification}
              onChange={handleQualificationChange}
              onRemove={handleRemoveQualification}
              isStatic={['S.S.L.C', 'HSC'].includes(qualification.course)}
            />
          ))}
        </AnimatePresence>
        <motion.button
          type="button"
          onClick={handleAddQualification}
          whileHover={{ scale: 1.05, boxShadow: '0 0 10px rgba(34, 197, 94, 0.4)' }}
          whileTap={{ scale: 0.95 }}
          disabled={loading}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-300 disabled:text-gray-500 transition duration-200 font-roboto font-semibold text-lg"
        >
          <BookOpen className="h-5 w-5 mr-2" />
          Add Qualification
        </motion.button>
      </div>
      {hasAdditionalQualifications && (
        <div className="space-y-6 bg-white/80 p-6 rounded-xl shadow-sm border border-purple-100/50">
          <h3 className="text-2xl font-semibold font-montserrat bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 mb-6">
            Semester Marks
          </h3>
          <AnimatePresence>
            {formData?.semester_marks?.map((semester, index) => (
              <SemesterMarksForm
                key={`sem-${index}`}
                index={index}
                semester={semester}
                onChange={handleSemesterChange}
                onRemove={handleRemoveSemester}
                isOptional={isOptionalSemester(index)}
              />
            ))}
          </AnimatePresence>
          {formData?.semester_marks?.length >= 6 && (
            <motion.button
              type="button"
              onClick={handleAddSemester}
              whileHover={{ scale: 1.05, boxShadow: '0 0 10px rgba(124, 58, 237, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-400 disabled:text-gray-500 transition duration-200 font-roboto font-semibold text-lg"
            >
              <FileText className="h-5 w-5 mr-2" />
              Add Semester
            </motion.button>
          )}
          <SemesterMarksheetUpload
            onFileChange={handleSemesterMarksheetChange}
            marksheetUrl={formData?.semester_marksheet?.url}
            uploadProgress={formData?.semester_marksheet?.uploadProgress || 0}
          />
        </div>
      )}
      {hasAdditionalQualifications && (
        <div className="space-y-6 bg-white/80 p-6 rounded-xl shadow-sm border border-purple-100/50">
          <h4 className="text-xl font-semibold font-montserrat text-gray-800 mb-4">Semester Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'total_max_marks', label: 'Total Maximum Marks', type: 'number', disabled: true },
              { name: 'total_obtained_marks', label: 'Total Marks Obtained', type: 'number', disabled: true },
              { name: 'percentage', label: 'Percentage of Marks', type: 'number', disabled: true },
              { name: 'cgpa', label: 'CGPA', type: 'text' },
              { name: 'overall_grade', label: 'Overall Grade', type: 'text' },
            ].map(({ name, label, type, disabled }) => (
              <div key={name} className="relative">
                <label className="block text-base font-medium text-gray-800 font-roboto mb-2">
                  {label} {name !== 'cgpa' && name !== 'overall_grade' && <span className="text-red-500">*</span>}
                </label>
                <div className="relative">
                  <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-500" />
                  <input
                    type={type}
                    name={name}
                    value={formData[name] || ''}
                    onChange={handleSummaryChange}
                    disabled={disabled}
                    className={`w-full pl-10 p-3 bg-white/80 backdrop-blur-sm rounded-lg border-2 border-purple-300 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition duration-300 font-roboto font-medium text-base text-gray-900 ${disabled ? 'cursor-not-allowed bg-gray-100/70' : 'hover:border-purple-400'}`}
                  />
                </div>
              </div>
            ))}
            <div className="relative">
              <label className="block text-base font-medium text-gray-800 font-roboto mb-2">
                Class Obtained <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <List className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-500" />
                <Select
                  name="class_obtained"
                  value={selectOptions.class_obtained.find(opt => opt.value === formData.class_obtained) || { value: '', label: 'Select Class' }}
                  onChange={(opt) => setFormData(prev => ({ ...prev, class_obtained: opt ? opt.value : '' }))}
                  options={selectOptions.class_obtained}
                  styles={customSelectStyles}
                  className="font-roboto pl-10"
                  classNamePrefix="select"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default QualificationsAndSemesters;