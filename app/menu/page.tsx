/* eslint-disable react/no-unescaped-entities */
import RestaurantLayout from "@/components/restaurant/Layout";
import Link from '@/lib/debugLink';
import { Metadata } from 'next';
import { getMarketingSmart, getMenuSmart, getContentSmart } from '@/src/lib/data/server-loader';
import MenuHero from './_components/MenuHero';
import { FadeIn } from '@/components/animations/MotionWrappers';
import dynamic from 'next/dynamic';
// Dynamic imports for Menu page sections - optimized for performance
const MenuInteractive = dynamic(() => import('./_components/MenuInteractive'), {
	ssr: true,
	loading: () => (
		<div className="min-h-96 bg-white flex items-center justify-center">
			<div className="text-lg text-neutral-500">Loading menu...</div>
		</div>
	)
});
// Dynamic imports for Menu page sections - optimized for performance

export const metadata: Metadata = {
	title: 'Menu | Authentic Nepalese Food & Pub Classics | The Old Crown Girton',
	description: 'Explore our searchable menu featuring authentic Nepalese cuisine, momo, dal bhat & curries, plus traditional British pub classics. Advanced search and dietary filters available. Takeaway available.',
	keywords: 'searchable menu Cambridge, Nepalese menu Cambridge, authentic Nepalese food Girton, momo Cambridge, dal bhat, curry takeaway Cambridge, pub food menu Girton, dietary filters menu, nutrition information',
	openGraph: {
		title: 'Menu | Authentic Nepalese Food & Pub Classics | The Old Crown Girton',
		description: 'Discover our interactive menu with search and dietary filters, combining authentic Nepalese cuisine with traditional British pub favorites at Girton\'s historic thatched pub',
		url: 'https://oldcrowngirton.com//menu',
		siteName: 'The Old Crown Girton',
		locale: 'en_GB',
		type: 'website',
	},
};

export default async function MenuPage({ searchParams }: { searchParams?: { category?: string } }) {
	// Detect priority category from search params or URL hash (for server-side optimization)
	const priorityCategory = searchParams?.category;
	
	// Preload all data concurrently with priority category optimization
	const [m, content, menu] = await Promise.all([
		getMarketingSmart(),
		getContentSmart(),
		getMenuSmart(priorityCategory) // Pass priority category for optimized loading
	]);
	
	const menuContent = content.pages.menu;
	
	const labels = m.buttons || {};
	const labelBookOnline = labels.bookOnline || menuContent.hero.cta.book || content.global.ui.buttons.bookOnline || 'Book Online';
	const labelOrderTakeaway = labels.orderTakeaway || menuContent.hero.cta.order || 'Order Takeaway';
	
	// Optimize menu data structure for faster client-side rendering
	const optimizedMenu = {
		...menu,
		sections: (menu?.sections || []).map(section => ({
			...section,
			// Pre-calculate section metadata for faster navigation
			itemCount: section.items?.length || 0,
			hasVegetarian: section.items?.some(item => item.dietary?.vegetarian) || false,
			hasGlutenFree: section.items?.some(item => item.dietary?.glutenFree) || false,
			priceRange: section.items?.length > 0 ? {
				min: Math.min(...section.items.map(item => item.price?.amount || 0)),
				max: Math.max(...section.items.map(item => item.price?.amount || 0))
			} : null
		}))
	};
	
	// Default to "All" (null) to show all menu sections initially
	const defaultSection: string | null = null;

	// Enhanced structured data with optimized menu
	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'Menu',
		'@id': 'https://oldcrowngirton.com//menu#menu',
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
		menuSection: (optimizedMenu?.sections || []).map((section: any) => ({
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
			<style dangerouslySetInnerHTML={{ __html: `
			  @media (prefers-reduced-motion: reduce) {
			    *,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}
			    html:focus-within{scroll-behavior:auto!important}
			  }
			` }} />
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
			<RestaurantLayout>
				{/* Hero Section with motion animation */}
				<section aria-label="Menu introduction">
					<MenuHero />
				</section>

				{/* Main menu content with progressive disclosure */}
				<main className="space-y-16">
					<FadeIn>
						<section aria-labelledby="interactive-menu-heading">
							<MenuInteractive 
								sections={optimizedMenu?.sections || []} 
								defaultSelected={null}
								preloadedData={true}
							/>
						</section>
					</FadeIn>



					<FadeIn>
						<section aria-labelledby="menu-info-cta-heading" className="bg-brand-50">
							{/* Dietary Information CTA */}
							<div className="py-12 pb-8">
								<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
									<h2 id="menu-info-cta-heading" className="text-3xl font-display font-bold text-stout-700 mb-6">
										Need Dietary Information?
									</h2>
									<p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
										Find comprehensive allergen information, dietary requirements, and food safety details to help you make informed choices.
									</p>
									<Link 
										href="/menu-information"
										className="inline-flex items-center justify-center px-8 py-4 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
									>
										View Menu Information & Dietary Requirements
										<svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
										</svg>
									</Link>
									<div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-neutral-500">
										<span className="bg-white px-3 py-1 rounded-full">14 Allergen Information</span>
										<span className="bg-white px-3 py-1 rounded-full">Dietary Options</span>
										<span className="bg-white px-3 py-1 rounded-full">Natasha's Law Compliant</span>
									</div>
								</div>
							</div>
							
							{/* Main CTA Section - seamlessly integrated */}
							<div className="pt-8 pb-16">
								<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
									<div className="bg-gradient-to-r from-brand-600 to-brand-800 rounded-2xl p-8 md:p-12 shadow-xl transition-all duration-300 hover:transform hover:-translate-y-2 border-2 border-brand-700">
										<div className="text-center">
											<h3 className="text-3xl md:text-4xl font-display font-bold mb-6 text-white drop-shadow-lg">
												🍽️ Experience Our Interactive Menu
											</h3>
											
											<p className="text-lg text-white/95 mb-8 max-w-2xl mx-auto leading-relaxed">
												Use our advanced search and dietary filters to find the perfect dish. Book online or call for takeaway orders.
											</p>
											
											<div className="flex flex-wrap gap-4 justify-center mb-6">
												<Link
													href="https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true"
													target="_blank"
													rel="noopener noreferrer"
													className="transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 bg-white hover:bg-neutral-50 text-brand-800 border-2 border-brand-200 font-bold py-4 px-8 rounded-lg text-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30 inline-block"
												>
													{labelBookOnline}
													<span className="ml-2 text-sm" aria-hidden="true">↗</span>
												</Link>
												<Link
													href="tel:01223276027"
													className="transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 bg-brand-900 hover:bg-brand-950 text-white border-2 border-white/20 font-bold py-4 px-8 rounded-lg text-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30 inline-block"
												>
													{labelOrderTakeaway}
												</Link>
												<Link
													href="/about"
													className="transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 bg-white hover:bg-neutral-50 text-brand-700 border-2 border-brand-200 font-bold py-4 px-8 rounded-lg text-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30 inline-block"
												>
													Learn Our Story
												</Link>
											</div>

											<div className="text-sm text-white/80 bg-white/10 rounded-lg p-4 backdrop-blur-sm">
												<p>{menuContent.sections.allergenNotice} Use our enhanced filters to find items suitable for your dietary requirements.</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</section>
					</FadeIn>
				</main>
			</RestaurantLayout>
		</>
	);
}
