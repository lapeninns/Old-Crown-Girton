/* eslint-disable react/no-unescaped-entities */
import RestaurantLayout from "@/components/restaurant/Layout";
import Link from "next/link";
import { Metadata } from 'next';
import { getMarketingSmart, getMenuSmart, getContentSmart } from '@/src/lib/data/server-loader';
import MenuHero from '@/components/menu/MenuHero';
import MenuInteractive from '@/components/menu/MenuInteractive';
import dynamic from 'next/dynamic';

// Dynamic imports for Menu page sections
const MenuInformationSection = dynamic(() => import("@/components/restaurant/sections/MenuInformationSection"));
const MenuCTASection = dynamic(() => import("@/components/restaurant/sections/MenuCTASection"));

export const metadata: Metadata = {
	title: 'Menu | Authentic Nepalese Food & Pub Classics | The Old Crown Girton',
	description: 'Explore our authentic Nepalese menu featuring momos, dal bhat & curries, plus traditional British pub classics. Takeaway available. Book: 01223 276027',
	keywords: 'Nepalese menu Cambridge, authentic Nepalese food Girton, momos Cambridge, dal bhat, curry takeaway Cambridge, pub food menu Girton, Sunday roast menu',
	openGraph: {
		title: 'Menu | Authentic Nepalese Food & Pub Classics | The Old Crown Girton',
		description: 'Discover our unique menu combining authentic Nepalese cuisine with traditional British pub favorites at Girton\'s historic thatched pub',
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

	// Build structured data (JSON-LD) from menu
	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'Menu',
		'@id': 'https://oldcrowngirton.co.uk/menu#menu',
		name: menuContent.hero.title,
		description: menuContent.sections.description,
		inLanguage: 'en-GB',
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
			})),
		})),
	};

	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
			<RestaurantLayout>
				{/* Hero Section (component) */}
				<MenuHero labelBookOnline={labelBookOnline} labelOrderTakeaway={labelOrderTakeaway} />

				{/* Interactive menu navigation + sections (single-page, no routes) */}
				<MenuInteractive sections={menu?.sections || []} defaultSelected={(menu as any)?.defaultSection || null} />

				{/* Dietary Information & FAQ - modular component */}
				<MenuInformationSection faqItems={content.components.faq.items} />

				{/* Call to Action - modular component */}
				<MenuCTASection 
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
					allergenNotice={menuContent.sections.allergenNotice}
				/>
			</RestaurantLayout>
		</>
	);
}