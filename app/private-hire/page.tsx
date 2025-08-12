export const metadata = { title: 'Private Hire – Old Crown Girton' };
import RestaurantLayout from "@/components/restaurant/Layout";

export default function PrivateHirePage() {
	return (
		<RestaurantLayout>
			<div className="max-w-3xl mx-auto px-6 py-12 prose">
				<h1>Private Hire</h1>
				<p>Host your special event at Old Crown Girton. Contact us for availability and pricing.</p>
			</div>
		</RestaurantLayout>
	);
}
