const LoadingSpinner = ({ label = 'Loading...', size = 'h-5 w-5' }) => (
  <span className="inline-flex items-center gap-2" role="status" aria-live="polite">
    <span
      className={`${size} animate-spin rounded-full border-2 border-current border-r-transparent`}
      aria-hidden="true"
    />
    <span>{label}</span>
  </span>
);

export default LoadingSpinner;