interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
}

export function ErrorMessage({ message, onDismiss }: ErrorMessageProps) {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <span className="block sm:inline">{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-0 bottom-0 right-0 px-4 py-3"
          aria-label="Dismiss error"
        >
          <span className="text-red-700">×</span>
        </button>
      )}
    </div>
  );
}

