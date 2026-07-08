import { CheckCircle2, XCircle } from "lucide-react";

type AuthFeedbackProps = {
  error?: string;
  message?: string;
};

export function AuthFeedback({ error, message }: AuthFeedbackProps) {
  if (!error && !message) {
    return null;
  }

  const isError = Boolean(error);

  return (
    <div
      className={`mt-4 flex gap-2 rounded-lg border px-3 py-3 text-sm ${
        isError
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-green-200 bg-green-50 text-green-700"
      }`}
    >
      {isError ? (
        <XCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      ) : (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      )}
      <span>{error ?? message}</span>
    </div>
  );
}
