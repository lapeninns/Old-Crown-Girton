import RestaurantLayout from "@/components/restaurant/Layout";

export const metadata = { title: 'History – Old Crown Girton' };
export default function HistoryPage() {
	return (
		<RestaurantLayout>
			<div className="max-w-3xl mx-auto px-6 py-12 prose">
				<h1>Our History</h1>
				<p>A brief heritage overview of the Old Crown will be added soon.</p>
			</div>
		</RestaurantLayout>
	);
}
