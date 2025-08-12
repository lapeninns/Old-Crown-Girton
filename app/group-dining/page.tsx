import RestaurantLayout from "@/components/restaurant/Layout";

export const metadata = { title: 'Group Dining – Old Crown Girton' };
export default function GroupDiningPage() {
	return (
		<RestaurantLayout>
			<div className="max-w-3xl mx-auto px-6 py-12 prose">
				<h1>Group Dining</h1>
				<p>Details on pre‑order menus and larger party options coming soon. Call us to discuss.</p>
			</div>
		</RestaurantLayout>
	);
}
