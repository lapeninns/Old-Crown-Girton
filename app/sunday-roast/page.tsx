import RestaurantLayout from "@/components/restaurant/Layout";

export const metadata = { title: 'Sunday Roast – Old Crown Girton' };
export default function SundayRoastPage() {
	return (
		<RestaurantLayout>
			<div className="max-w-3xl mx-auto px-6 py-12 prose">
				<h1>Sunday Roast</h1>
				<p>Locally sourced roasts with seasonal veg & proper gravy. Details will appear here soon.</p>
			</div>
		</RestaurantLayout>
	);
}
