export default function OfflineBackground() {
  return (
    <>
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-4 w-24 h-24 bg-brand-100 rounded-full opacity-20"></div>
        <div className="absolute bottom-1/4 -right-4 w-32 h-32 bg-brand-100 rounded-full opacity-20"></div>
        <div className="absolute top-3/4 left-1/4 w-16 h-16 bg-brand-100 rounded-full opacity-20"></div>
      </div>

      {/* Auto-reconnect script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            function updateConnectionStatus() {
              const statusEl = document.getElementById('connection-status');
              if (navigator.onLine) {
                statusEl.innerHTML = '<span class="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>Online - Reloading...';
                setTimeout(() => window.location.reload(), 1000);
              } else {
                statusEl.innerHTML = '<span class="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>Offline';
              }
            }

            window.addEventListener('online', updateConnectionStatus);
            window.addEventListener('offline', updateConnectionStatus);
            
            // Check connection every 5 seconds
            setInterval(() => {
              if (navigator.onLine) {
                updateConnectionStatus();
              }
            }, 5000);
          `
        }}
      />
    </>
  );
}