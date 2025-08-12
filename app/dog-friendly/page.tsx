export const metadata = { title: 'Dog Friendly Pub – Old Crown Girton' };
import RestaurantLayout from "@/components/restaurant/Layout";

export default function DogFriendlyPage() {
	return (
		<RestaurantLayout>
			<div className="max-w-3xl mx-auto px-6 py-12 prose">
				<h1>Dog Friendly</h1>
				<p>Four-legged friends welcome! We have water bowls and treats available for your canine companions.</p>
			</div>
		</RestaurantLayout>
	);
}
