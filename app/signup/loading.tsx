export default function Loading() {
  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <div className="h-10 w-10 animate-pulse bg-muted rounded-full" />
      </div>
      <div className="w-full max-w-md space-y-6 bg-card p-6 rounded-lg shadow-lg">
        <div className="space-y-2 text-center">
          <div className="h-8 w-56 mx-auto animate-pulse bg-muted rounded" />
          <div className="h-4 w-72 mx-auto animate-pulse bg-muted rounded" />
        </div>
        <div className="space-y-4">
          <div className="h-10 w-full animate-pulse bg-muted rounded-md" />
          <div className="h-10 w-full animate-pulse bg-muted rounded-md" />
          <div className="h-10 w-full animate-pulse bg-muted rounded-md" />
          <div className="h-10 w-full animate-pulse bg-muted rounded-md" />
        </div>
        <div className="text-center">
          <div className="h-4 w-48 mx-auto animate-pulse bg-muted rounded" />
        </div>
      </div>
    </div>
  );
}
