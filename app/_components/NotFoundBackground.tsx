export default function NotFoundBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 -left-4 w-24 h-24 bg-brand-100 rounded-full opacity-20"></div>
      <div className="absolute bottom-1/4 -right-4 w-32 h-32 bg-brand-100 rounded-full opacity-20"></div>
      <div className="absolute top-3/4 left-1/4 w-16 h-16 bg-brand-100 rounded-full opacity-20"></div>
    </div>
  );
}