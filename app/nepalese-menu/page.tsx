export const metadata = { title: 'Nepalese Menu – Old Crown Girton' };
import RestaurantLayout from "@/components/restaurant/Layout";

export default function NepaleseMenuPage() {
	return (
		<RestaurantLayout>
			<div className="max-w-3xl mx-auto px-6 py-12 prose">
				<h1>Nepalese Menu</h1>
				<p>Discover our authentic Nepalese dishes featuring traditional spices and cooking methods.</p>
			</div>
		</RestaurantLayout>
	);
}
