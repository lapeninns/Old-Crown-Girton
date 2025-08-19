/* eslint-disable react/no-unescaped-entities */
import RestaurantLayout from "@/components/restaurant/Layout";
import Link from "next/link";
import { Metadata } from 'next';
import { getMarketingSmart, getMenuSmart } from '@/src/lib/data/loader';
import MenuHero from '@/components/menu/MenuHero';
import MenuNav from '@/components/menu/MenuNav';
import MenuSections from '@/components/menu/MenuSections';

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
	const labels = m.buttons || {};
	const labelBookOnline = labels.bookOnline || 'Book Online';
	const labelOrderTakeaway = labels.orderTakeaway || 'Order Takeaway';
	// Load menu data from data layer (reads data/dev/menu.json in dev)
	const menu = await getMenuSmart();

	// Build structured data (JSON-LD) from menu
	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'Menu',
		'@id': 'https://oldcrowngirton.co.uk/menu#menu',
		name: 'The Old Crown Menu',
		description: 'Authentic Nepalese cuisine and traditional British pub classics',
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

				{/* Menu navigation (component) */}
				<MenuNav sections={menu?.sections || []} />

				{/* Sections (component) */}
				<MenuSections sections={menu?.sections || []} />

				{/* Traditional British Pub Classics removed per request */}
				{/* Dietary Information & FAQ */}
				<section className="py-16 bg-crown-cream/20">
					<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
						<h2 className="text-3xl font-display font-bold text-crown-slate text-center mb-12">
							Menu Information & Dietary Requirements
						</h2>
            
						<div className="grid md:grid-cols-2 gap-8">
							<div className="space-y-6">
								<div className="p-6 bg-white rounded-lg">
									<h3 className="font-bold text-crown-slate mb-2">Are there vegetarian options on the Nepalese menu?</h3>
									<p className="text-gray-700">Yes! We offer dal bhat, vegetable momo, vegetable thali, and several vegetarian curries. All clearly marked on our menu.</p>
								</div>
                
								<div className="p-6 bg-white rounded-lg">
									<h3 className="font-bold text-crown-slate mb-2">Can you adjust spice levels?</h3>
									<p className="text-gray-700">Absolutely! Our chefs can adjust spice levels for most Nepalese dishes. Just let your server know your preference when ordering.</p>
								</div>
                
								<div className="p-6 bg-white rounded-lg">
									<h3 className="font-bold text-crown-slate mb-2">Do you have a children's menu?</h3>
									<p className="text-gray-700">Yes, we offer mild Nepalese dishes and traditional pub favorites sized for children, including fish & chips, chicken nuggets, and pasta.</p>
								</div>
							</div>
              
							<div className="space-y-6">
								<div className="p-6 bg-white rounded-lg">
									<h3 className="font-bold text-crown-slate mb-2">What about gluten-free options?</h3>
									<p className="text-gray-700">Many of our Nepalese curries are naturally gluten-free. We also offer gluten-free alternatives for fish & chips and other pub classics.</p>
								</div>
                
								<div className="p-6 bg-white rounded-lg">
									<h3 className="font-bold text-crown-slate mb-2">Is takeaway available for all menu items?</h3>
									<p className="text-gray-700">Yes! All our dishes are available for takeaway. Call 01223 276027 to place your order. Collection typically ready in 20-30 minutes.</p>
								</div>
                
								<div className="p-6 bg-white rounded-lg">
									<h3 className="font-bold text-crown-slate mb-2">How authentic is your Nepalese food?</h3>
									<p className="text-gray-700">Our Nepalese dishes use traditional recipes and cooking methods, with spices imported directly from Nepal for authentic flavors.</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Call to Action */}
				<section className="py-16 bg-crown-slate text-white">
					<div className="max-w-4xl mx-auto text-center px-4">
						<h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
							Ready to Try Our Unique Menu?
						</h2>
						<p className="text-xl text-gray-200 mb-8">
							Book a table or order takeaway to experience the best of Nepal and Britain at Girton's historic thatched pub.
						</p>
						<div className="flex flex-wrap gap-4 justify-center">
							<a href="https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true" target="_blank" rel="noopener noreferrer" className="bg-crown-gold hover:bg-crown-gold-dark text-white font-bold py-4 px-8 rounded-lg text-lg">
								{labelBookOnline}
							</a>
							<a href="tel:01223276027" className="bg-crown-red hover:bg-crown-red-dark text-white font-bold py-4 px-8 rounded-lg text-lg">
								{labelOrderTakeaway}
							</a>
							<Link href="/about" className="bg-white hover:bg-gray-100 text-crown-slate font-bold py-4 px-8 rounded-lg text-lg">
								Learn Our Story
							</Link>
						</div>
            
						<div className="mt-8 text-sm text-gray-300">
							<p><strong>Address:</strong> 89 High Street, Girton, Cambridge CB3 0QQ</p>
							<p><strong>Kitchen Hours:</strong> Daily 12:00-22:00 (22:30 Fri/Sat, 21:30 Sun)</p>
						</div>
					</div>
				</section>
			</RestaurantLayout>
		</>
	);
}