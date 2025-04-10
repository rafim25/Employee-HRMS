const statusOptions = [
  { value: 'applied', label: 'Applied' },
  { value: 'screening', label: 'Screening' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'interviewed', label: 'Interviewed' },
  { value: 'selected', label: 'Selected' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'archived', label: 'Archived' }
];

const StatusDropdown = ({ currentStatus, onStatusChange, candidateId }) => {
  return (
    <select
      value={currentStatus}
      onChange={(e) => onStatusChange(candidateId, e.target.value)}
      className="rounded border-gray-300 focus:border-primary"
    >
      {statusOptions.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}; 