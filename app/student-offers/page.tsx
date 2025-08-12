import RestaurantLayout from "@/components/restaurant/Layout";

export const metadata = { title: 'Student Offers – Old Crown Girton' };
export default function StudentOffersPage() {
	return (
		<RestaurantLayout>
			<div className="max-w-3xl mx-auto px-6 py-12 prose">
				<h1>Student Offers</h1>
				<p>We&apos;re preparing tailored value offers for students. Check back soon.</p>
			</div>
		</RestaurantLayout>
	);
}
