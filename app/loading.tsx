export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="h-8 w-24 animate-pulse bg-muted rounded" />
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 animate-pulse bg-muted rounded-full" />
            <div className="h-10 w-10 animate-pulse bg-muted rounded-full" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="flex justify-end">
            <div className="h-10 w-32 animate-pulse bg-muted rounded-md" />
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 rounded-lg border bg-card">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="h-6 w-48 animate-pulse bg-muted rounded" />
                      <div className="h-5 w-16 animate-pulse bg-muted rounded" />
                      <div className="h-5 w-24 animate-pulse bg-muted rounded" />
                    </div>
                    <div className="h-4 w-full animate-pulse bg-muted rounded" />
                    <div className="h-4 w-32 animate-pulse bg-muted rounded" />
                  </div>
                  <div className="flex items-center space-x-2">
                    {[...Array(3)].map((_, j) => (
                      <div
                        key={j}
                        className="h-10 w-10 animate-pulse bg-muted rounded-md"
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
