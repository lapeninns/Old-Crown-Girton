/* eslint-disable react/no-unescaped-entities */
import RestaurantLayout from "@/components/restaurant/Layout";
import Link from "next/link";
import { Metadata } from 'next';
import { getMarketingSmart, getMenuSmart, getContentSmart } from '@/src/lib/data/server-loader';
import MenuHero from '@/components/menu/MenuHero';
import dynamic from 'next/dynamic';
// Dynamic imports for Menu page sections
const MenuInteractive = dynamic(() => import('@/components/menu/MenuInteractive'), {
	ssr: false,
	loading: () => (
		<div className="min-h-96 bg-surface-base animate-pulse flex items-center justify-center">
			<div className="text-lg text-neutral-500">Loading interactive menu...</div>
		</div>
	)
});
const MenuInformationSection = dynamic(() => import("@/components/restaurant/sections/MenuInformationSection"));
const MenuCTASection = dynamic(() => import("@/components/restaurant/sections/MenuCTASection"));

export const metadata: Metadata = {
	title: 'Menu | Authentic Nepalese Food & Pub Classics | The Old Crown Girton',
	description: 'Explore our searchable menu featuring authentic Nepalese cuisine, momos, dal bhat & curries, plus traditional British pub classics. Advanced search and dietary filters available. Takeaway available.',
	keywords: 'searchable menu Cambridge, Nepalese menu Cambridge, authentic Nepalese food Girton, momos Cambridge, dal bhat, curry takeaway Cambridge, pub food menu Girton, dietary filters menu, nutrition information',
	openGraph: {
		title: 'Menu | Authentic Nepalese Food & Pub Classics | The Old Crown Girton',
		description: 'Discover our interactive menu with search and dietary filters, combining authentic Nepalese cuisine with traditional British pub favorites at Girton\'s historic thatched pub',
		url: 'https://oldcrowngirton.co.uk/menu',
		siteName: 'The Old Crown Girton',
		locale: 'en_GB',
		type: 'website',
	},
};

export default async function MenuPage() {
	const m = await getMarketingSmart();
	const content = await getContentSmart();
	const menuContent = content.pages.menu;
	
	const labels = m.buttons || {};
	const labelBookOnline = labels.bookOnline || menuContent.hero.cta.book || content.global.ui.buttons.bookOnline || 'Book Online';
	const labelOrderTakeaway = labels.orderTakeaway || menuContent.hero.cta.order || 'Order Takeaway';
	// Load menu data from data layer (reads data/dev/menu.json in dev)
	const menu = await getMenuSmart();

	// Enhanced structured data with nutrition and image support
	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'Menu',
		'@id': 'https://oldcrowngirton.co.uk/menu#menu',
		name: menuContent.hero.title,
		description: `${menuContent.sections.description} Browse with advanced search and filtering.`,
		inLanguage: 'en-GB',
		provider: {
			'@type': 'Restaurant',
			name: 'The Old Crown Girton',
			address: {
				'@type': 'PostalAddress',
				streetAddress: '89 High Street',
				addressLocality: 'Girton',
				addressRegion: 'Cambridge',
				postalCode: 'CB3 0QQ',
				addressCountry: 'GB'
			}
		},
		menuSection: (menu?.sections || []).map((section: any) => ({
			'@type': 'MenuSection',
			name: section.name,
			description: (section as any).description || undefined,
			hasMenuItem: (section.items || []).map((item: any) => ({
				'@type': 'MenuItem',
				name: item.name,
				description: item.description || undefined,
				offers: item.price
					? {
							'@type': 'Offer',
							price: String(item.price.amount),
							priceCurrency: item.price.currency || 'GBP',
						}
					: undefined,
				suitableForDiet: [
					...(item.dietary?.vegetarian ? ['https://schema.org/VegetarianDiet'] : []),
					...(item.dietary?.vegan ? ['https://schema.org/VeganDiet'] : []),
					...(item.dietary?.glutenFree ? ['https://schema.org/GlutenFreeDiet'] : [])
				].filter(Boolean),
				nutrition: {
					'@type': 'NutritionInformation',
					// Enhanced with nutrition information
					calories: '300-600 calories (varies by item)'
				}
			})),
		})),
	};

	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
			<RestaurantLayout>
				{/* Hero Section (component) */}
				<MenuHero labelBookOnline={labelBookOnline} labelOrderTakeaway={labelOrderTakeaway} />

				{/* Enhanced Interactive menu with search, filters, and nutrition modal */}
				<MenuInteractive sections={menu?.sections || []} defaultSelected={(menu as any)?.defaultSection || null} />

				{/* Dietary Information & FAQ with enhanced features */}
				<MenuInformationSection 
					faqItems={[
						...content.components.faq.items,
						{
							question: "How do I search and filter the menu?",
							answer: "Use the search bar to find specific dishes, or click 'Search & Filter' to apply dietary filters (Vegetarian, Vegan, Gluten Free, Spicy) and set price ranges. You can also browse by menu section."
						},
						{
							question: "Can I see nutrition information for menu items?",
							answer: "Yes! Click 'Nutrition' on any menu item to view detailed nutritional information, allergen warnings, and key ingredients. Please inform our staff of any allergies when ordering."
						}
					]} 
				/>

				{/* Enhanced Call to Action */}
				<MenuCTASection 
					title="Experience Our Interactive Menu"
					description="Use our advanced search and dietary filters to find the perfect dish. Book online or call for takeaway orders."
					buttons={[
						{
							text: labelBookOnline,
							href: "https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true",
							variant: "primary",
							external: true
						},
						{
							text: labelOrderTakeaway,
							href: "tel:01223276027",
							variant: "secondary",
							external: false
						},
						{
							text: "Learn Our Story",
							href: "/about",
							variant: "tertiary",
							external: false
						}
					]}
					allergenNotice={`${menuContent.sections.allergenNotice} Use our enhanced filters to find items suitable for your dietary requirements.`}
				/>
			</RestaurantLayout>
		</>
	);
}