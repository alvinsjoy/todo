export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 bg-card p-6 rounded-lg shadow-lg">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 animate-pulse bg-muted rounded" />
          </div>
          <div className="h-8 w-48 mx-auto animate-pulse bg-muted rounded" />
          <div className="h-4 w-72 mx-auto animate-pulse bg-muted rounded" />
        </div>
        <div className="space-y-4">
          <div className="h-4 w-64 mx-auto animate-pulse bg-muted rounded" />
          <div className="h-10 w-full animate-pulse bg-muted rounded-md" />
        </div>
      </div>
    </div>
  );
}
