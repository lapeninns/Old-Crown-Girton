import RestaurantLayout from "@/components/restaurant/Layout";

export default function CareersPage() {
  return (
    <RestaurantLayout>
      <div className="mx-auto max-w-3xl p-6">
        <h1 className="text-3xl font-bold tracking-tight">Careers</h1>
        <p className="mt-4 text-sm text-base-content/70">There are no openings at the moment. Please check back later or contact us.</p>
      </div>
    </RestaurantLayout>
  );
}
