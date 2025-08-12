import RestaurantLayout from "@/components/restaurant/Layout";

export const metadata = { title: 'Guest Reviews – Old Crown Girton' };
export default function ReviewsPage() {
	return (
		<RestaurantLayout>
			<div className="max-w-3xl mx-auto px-6 py-12 prose">
				<h1>Guest Reviews</h1>
				<p>Curated testimonials and recent feedback will appear here soon.</p>
			</div>
		</RestaurantLayout>
	);
}
