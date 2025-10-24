"use client"

interface LoadingOverlayProps {
  isLoading: boolean;
  fullScreen?: boolean;
  backgroundColor?: string;
  dotColor?: string;
}

export function LoadingOverlay({
                                 isLoading,
                                 fullScreen = false,
                                 backgroundColor = "bg-white/80",
                                 dotColor = "bg-slate-700"
                               }: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
      <div
          className={`${fullScreen ? 'fixed' : 'absolute'} inset-0 ${backgroundColor} backdrop-blur-sm flex items-center justify-center z-50 rounded-sm`}
      >
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
              <div
                  key={i}
                  className={`w-3 h-3 ${dotColor} rounded-full animate-bounce`}
                  style={{
                    animationDelay: `${i * 0.15}s`,
                    animationDuration: '0.6s'
                  }}
              />
          ))}
        </div>
      </div>
  );
}