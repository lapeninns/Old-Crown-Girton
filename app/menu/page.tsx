/* eslint-disable react/no-unescaped-entities */
import RestaurantLayout from "@/components/restaurant/Layout";
import Link from "next/link";
import { Metadata } from 'next';
import { getMarketingSmart, getMenuSmart, getContentSmart } from '@/src/lib/data/server-loader';
import MenuHero from '@/components/menu/MenuHero';
import MenuInteractive from '@/components/menu/MenuInteractive';
import MenuInfoCollapse from '@/components/menu/MenuInfoCollapse';

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

				{/* Traditional British Pub Classics removed per request */}
				{/* Dietary Information & FAQ - collapsed accordion */}
				<section className="py-16 bg-brand-50/20">
					<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
						<h2 className="text-3xl font-display font-bold text-stout-700 text-center mb-12">
							Menu Information & Dietary Requirements
						</h2>

						<MenuInfoCollapse
							items={content.components.faq.items.map((item: any) => ({
								title: item.question,
								content: <>{item.answer}</>
							}))}
						/>
					</div>
				</section>

				{/* Call to Action */}
				<section className="py-16 bg-stout-700 text-white">
					<div className="max-w-4xl mx-auto text-center px-4">
						<h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
							Ready to Try Our Unique Menu?
						</h2>
						<p className="text-xl text-neutral-200 mb-8">
							Book a table or order takeaway to experience the best of Nepal and Britain at Girton's historic thatched pub.
						</p>
						<div className="flex flex-wrap gap-4 justify-center">
							<a href="https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true" target="_blank" rel="noopener noreferrer" className="bg-accent hover:bg-accent-700 text-white font-bold py-4 px-8 rounded-lg text-lg">
								{labelBookOnline}
							</a>
							<a href="tel:01223276027" className="bg-crimson-600 hover:bg-crimson-800 text-white font-bold py-4 px-8 rounded-lg text-lg">
								{labelOrderTakeaway}
							</a>
							<Link href="/about" className="bg-white hover:bg-neutral-100 text-stout-700 font-bold py-4 px-8 rounded-lg text-lg">
								Learn Our Story
							</Link>
						</div>
            
						<div className="mt-8 text-sm text-neutral-300">
							<p className="text-neutral-300">{menuContent.sections.allergenNotice}</p>
						</div>
					</div>
				</section>
			</RestaurantLayout>
		</>
	);
}