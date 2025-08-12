import RestaurantLayout from "@/components/restaurant/Layout";

export const metadata = {
	title: 'Accessibility & Allergen Information',
	description: 'Accessibility features and allergen information for our guests.'
};

export default function AccessibilityAllergensPage() {
	return (
		<RestaurantLayout>
			<div className="max-w-3xl mx-auto px-6 py-12 prose prose-sm md:prose lg:prose-lg">
				<h1>Accessibility &amp; Allergen Information</h1>
				<p>
					We&apos;re preparing detailed accessibility and allergen information to help every guest feel safe and welcome.
					This page will soon include:
				</p>
				<ul>
					<li>Physical accessibility features (entrances, seating, restrooms)</li>
					<li>Service &amp; assistance policies</li>
					<li>Allergen matrix for menu items</li>
					<li>Contact information for specific dietary inquiries</li>
				</ul>
				<p>If you have an immediate question, please call us and a team member will gladly assist.</p>
			</div>
		</RestaurantLayout>
	);
}

