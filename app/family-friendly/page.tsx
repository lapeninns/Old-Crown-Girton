export const metadata = { title: 'Family Friendly – Old Crown Girton' };
import RestaurantLayout from "@/components/restaurant/Layout";

export default function FamilyFriendlyPage() {
	return (
		<RestaurantLayout>
			<div className="max-w-3xl mx-auto px-6 py-12 prose">
				<h1>Family Friendly</h1>
				<p>Welcome families! We offer high chairs, children's menus, and a warm atmosphere for all ages.</p>
			</div>
		</RestaurantLayout>
	);
}
