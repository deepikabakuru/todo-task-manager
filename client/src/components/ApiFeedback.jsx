import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ApiFeedback = () => {
  const [notice, setNotice] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let dismissTimer;
    const handleApiError = (event) => {
      const detail = event.detail || {};
      setNotice(detail);
      window.clearTimeout(dismissTimer);
      dismissTimer = window.setTimeout(() => setNotice(null), 6000);

      if (detail.unauthorized) {
        navigate('/login', { replace: true });
      }
    };

    window.addEventListener('app:api-error', handleApiError);
    return () => {
      window.removeEventListener('app:api-error', handleApiError);
      window.clearTimeout(dismissTimer);
    };
  }, [navigate]);

  if (!notice) return null;

  return (
    <div className="pointer-events-none fixed inset-x-4 top-4 z-50 flex justify-center sm:inset-x-auto sm:right-5 sm:w-full sm:max-w-md">
      <div
        role="alert"
        className="pointer-events-auto flex w-full items-start justify-between gap-4 rounded-lg border border-red-200 bg-white px-4 py-3 text-sm text-red-800 shadow-lg"
      >
        <span>{notice.message}</span>
        <button
          type="button"
          onClick={() => setNotice(null)}
          className="shrink-0 font-semibold text-red-700 hover:text-red-900"
          aria-label="Dismiss notification"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default ApiFeedback;