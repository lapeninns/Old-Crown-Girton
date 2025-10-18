import RestaurantLayout from "@/components/restaurant/Layout";
import { FadeIn, BouncyEmoji, MotionLinkButton } from "@/components/animations/MotionWrappers";

export default function EventsPage() {
  return (
    <RestaurantLayout>
      <div className="min-h-screen bg-brand-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-brand-600 to-brand-800 text-white py-10 md:py-16">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-4xl mx-auto">
              <FadeIn>
                <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-3 leading-tight">
                  Events at The Old Crown, Girton
                </h1>
                <p className="text-base md:text-lg text-brand-100 mb-6 max-w-2xl mx-auto leading-relaxed">
                  Your Hub for Sport, Celebrations & Community!
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <span className="px-3 py-1.5 bg-white/20 rounded-full backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-colors duration-200 text-white text-sm">
                    <span aria-hidden="true">🎉</span> <span className="sr-only">Celebrations</span>
                    <span className="ml-2 md:inline hidden">Celebrations</span>
                  </span>
                  <span className="px-3 py-1.5 bg-white/20 rounded-full backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-colors duration-200 text-white text-sm">
                    <span aria-hidden="true">⚽</span> <span className="sr-only">Live Sports</span>
                    <span className="ml-2 md:inline hidden">Live Sports</span>
                  </span>
                  <span className="px-3 py-1.5 bg-white/20 rounded-full backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-colors duration-200 text-white text-sm">
                    <span aria-hidden="true">👥</span> <span className="sr-only">Community Events</span>
                    <span className="ml-2 md:inline hidden">Community Events</span>
                  </span>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Introduction */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <p className="text-lg text-brand-600 max-w-3xl mx-auto leading-relaxed">
                Looking for the perfect venue to host your next gathering, or simply catch the big game with friends? The Old Crown offers a unique and memorable setting for all occasions, blending the charm of a historic thatched pub with the excitement of live sports and an incredible culinary experience.
              </p>
            </div>
          </section>

          {/* Curry & Carols Highlight */}
          <section className="mb-16" aria-labelledby="events-curry-carols-highlight-heading">
            <FadeIn>
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-crimson-600 to-cardamom-700 p-8 md:p-12 text-white shadow-2xl border border-white/10">
                <div className="absolute inset-0 bg-black/10" aria-hidden="true" />
                <div className="relative space-y-6 text-center max-w-3xl mx-auto">
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/30 rounded-full backdrop-blur text-sm font-semibold tracking-wide uppercase touch-manipulation">
                    <span aria-hidden="true" role="img">🎄</span>
                    Curry &amp; Carols Returns
                  </span>
                  <h2 id="events-curry-carols-highlight-heading" className="text-2xl md:text-4xl font-display font-bold leading-tight">
                    Two magical evenings of Curry &amp; Carols this December
                  </h2>
                  <p className="text-base md:text-lg text-neutral-100 leading-relaxed">
                    Join us on <strong>16 &amp; 17 December 2025</strong> for a £35 per guest Nepalese banquet, mulled pairings, and live carols under our thatched roof. Seats release soon—secure early access now.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <MotionLinkButton
                      href="/events/curry-and-carols"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white text-brand-800 font-semibold shadow-lg hover:bg-brand-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-300 focus-visible:ring-offset-brand-700 touch-manipulation"
                      ariaLabel="Explore Curry and Carols event details"
                    >
                      <span aria-hidden="true" role="img">✨</span>
                      Discover Curry &amp; Carols
                    </MotionLinkButton>
                    <MotionLinkButton
                      href="/curry-and-carols-menu"
                      className="btn btn-outline w-full sm:w-auto min-h-[3.25rem] border-white/60 text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white focus-visible:ring-offset-brand-700 touch-manipulation"
                      ariaLabel="Preview the Curry and Carols menu"
                    >
                      <span aria-hidden="true" role="img">🍽️</span>
                      View the Menu
                    </MotionLinkButton>
                  </div>
                  <p className="text-sm text-neutral-100/90">
                    <span className="font-semibold">£35 per guest</span> · Welcome drink · Live carols both nights
                  </p>
                </div>
              </div>
            </FadeIn>
          </section>

          {/* Live Sports Section */}
          <section className="mb-16">
            <FadeIn>
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 transition-all duration-300 border border-brand-100 hover:shadow-2xl focus-within:shadow-2xl">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-100 rounded-full mb-4">
                  <span className="text-3xl" aria-hidden="true">🎯</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-700 mb-4">
                  Catch All the Live Action on Sky TV!
                </h2>
                <h3 className="text-xl text-accent-600 font-semibold">
                  Your Home for Live Sports in Cambridge
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-brand-600 mb-6 leading-relaxed">
                    Never miss a moment of the game at The Old Crown! We&apos;re proud to show a wide range of live sports on Sky TV across our screens, bringing you all the thrilling action from football, rugby, cricket, and more. Gather your mates, grab a refreshing pint from our selection of real ales, and immerse yourself in the electric atmosphere. Whether it&apos;s a tense derby or an international showdown, our pub is the perfect spot to cheer on your favourite team.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="text-accent-500 text-xl mt-1" aria-hidden="true">📺</span>
                      <div>
                        <strong className="text-brand-700">Sky TV:</strong> Access to all the major sporting events, including Premier League football and international rugby.
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-accent-500 text-xl mt-1" aria-hidden="true">🎉</span>
                      <div>
                        <strong className="text-brand-700">Great Atmosphere:</strong> Experience the excitement with fellow fans in a welcoming environment.
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-accent-500 text-xl mt-1" aria-hidden="true">🍽️</span>
                      <div>
                        <strong className="text-brand-700">Delicious Food & Drink:</strong> Fuel your cheers with our unique Nepalese dishes or classic pub favourites, alongside a fantastic range of beers, wines, and spirits from our extensive bar.
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-accent-500 text-xl mt-1" aria-hidden="true">🌳</span>
                      <div>
                        <strong className="text-brand-700">Large Garden & Terrace:</strong> Enjoy the game outdoors on a sunny day, or step out for a breather between halves.
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-accent-500 text-xl mt-1" aria-hidden="true">🐕</span>
                      <div>
                        <strong className="text-brand-700">Dog-Friendly:</strong> Your furry friends are welcome to join you in our garden areas while you watch the match!
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-accent-50 rounded-xl p-6 border border-accent-200">
                  <h4 className="font-bold text-brand-700 mb-4">📱 Stay Updated</h4>
                  <p className="text-brand-600 mb-4">
                    Check our social media or call us for the latest fixtures and upcoming matches! Looking for a specific game? Give us a call, and we&apos;ll do our best to accommodate!
                  </p>
                  <div className="flex gap-3">
                    <a href="#" className="text-accent-600 hover:text-accent-700 font-medium">📘 Facebook</a>
                    <a href="#" className="text-accent-600 hover:text-accent-700 font-medium">📸 Instagram</a>
                  </div>
                </div>
              </div>
            </div>
            </FadeIn>
          </section>

          {/* Private Events Section */}
          <section className="mb-16">
            <FadeIn>
              <div className="bg-gradient-to-r from-brand-50 to-accent-50 rounded-2xl p-8 md:p-12 border border-brand-200">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-100 rounded-full mb-4">
                  <span className="text-3xl" aria-hidden="true">🎊</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-700 mb-4">
                  Host Your Unforgettable Event at The Old Crown
                </h2>
              </div>

              <p className="text-lg text-brand-600 text-center mb-8 max-w-3xl mx-auto leading-relaxed">
                Beyond sports, The Old Crown is a versatile and picturesque venue, ideal for celebrating life&apos;s special moments, hosting business gatherings, or bringing people together. Our unique setting, combined with exceptional food and service, ensures your event will be truly memorable.
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {[
                  { icon: '🏛️', title: 'Thatched Historic Building', body: "Step into history! Our iconic, largest thatched pub in the country offers a stunning and memorable backdrop for photos and gatherings, adding a touch of unique British charm to any event." },
                  { icon: '🍛', title: 'Unique Nepalese + British Menus', body: 'Ditch the ordinary! Treat your guests to a standout culinary experience with our acclaimed authentic Nepalese cuisine alongside beloved British pub classics. We can tailor menus to suit your preferences and dietary needs.' },
                  { icon: '🌳', title: 'Large Garden & Terrace', body: 'Perfect for summer socials, family events, or simply enjoying the fresh air. Our expansive outdoor spaces and large beer garden provide a beautiful setting for mingling and relaxation.' },
                  { icon: '🚗', title: 'Easy Parking & Quick Links', body: "Conveniently located just outside the city centre with ample free parking. We&apos;re easily accessible for guests coming from Cambridge and the surrounding villages." },
                  { icon: '💰', title: 'No Heavy Deposit Required', body: "We believe in making event planning stress-free. For most bookings, you won&apos;t need a heavy deposit, making it easier to arrange your gathering." },
                  { icon: '👨‍👩‍👧‍👦', title: 'Family-Friendly Venue', body: 'We welcome families with children and can provide a kids menu upon request, making us an ideal choice for family celebrations.' },
                ].map((card) => (
                  <article key={card.title} className="bg-white rounded-xl p-6 shadow-lg transition-transform duration-300 hover:shadow-2xl focus-within:shadow-2xl">
                    <div className="text-2xl mb-3" aria-hidden="true">{card.icon}</div>
                    <h3 className="font-bold text-brand-700 mb-2">{card.title}</h3>
                    <p className="text-sm text-brand-600">{card.body}</p>
                  </article>
                ))}
              </div>
            </div>
            </FadeIn>
          </section>

          {/* Occasions Section */}
          <section className="mb-16">
            <FadeIn>
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 transition-all duration-300 border border-brand-200 hover:shadow-2xl focus-within:shadow-2xl">
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-display font-bold text-brand-700 mb-4">
                  Perfect for Any Occasion
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-brand-50 rounded-lg hover:bg-brand-100 transition-colors duration-200 border border-brand-200">
                    <span className="text-2xl" aria-hidden="true">🎂</span>
                    <div>
                      <strong className="text-brand-700">Birthday Celebrations:</strong> Make a birthday extra special in our unique setting.
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-brand-50 rounded-lg hover:bg-brand-100 transition-colors duration-200 border border-brand-200">
                    <span className="text-2xl" aria-hidden="true">💍</span>
                    <div>
                      <strong className="text-brand-700">Anniversaries:</strong> Celebrate milestones with delicious food and a charming atmosphere.
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-brand-50 rounded-lg hover:bg-brand-100 transition-colors duration-200 border border-brand-200">
                    <span className="text-2xl" aria-hidden="true">🎓</span>
                    <div>
                      <strong className="text-brand-700">Student Society Socials & Events:</strong> Perfect for student gatherings and pub quizzes with student discounts available.
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-brand-50 rounded-lg hover:bg-brand-100 transition-colors duration-200 border border-brand-200">
                    <span className="text-2xl" aria-hidden="true">💼</span>
                    <div>
                      <strong className="text-brand-700">Corporate Gatherings & Business Lunches:</strong> Impress clients or reward your team in a relaxed, sophisticated environment.
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-brand-50 rounded-lg hover:bg-brand-100 transition-colors duration-200 border border-brand-200">
                    <span className="text-2xl" aria-hidden="true">🤝</span>
                    <div>
                      <strong className="text-brand-700">Community Events:</strong> We love being a hub for Girton! Talk to us about hosting your local group&apos;s next meet-up or event.
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-brand-50 rounded-lg hover:bg-brand-100 transition-colors duration-200 border border-brand-200">
                    <span className="text-2xl" aria-hidden="true">🕊️</span>
                    <div>
                      <strong className="text-brand-700">Wakes & Memorial Gatherings:</strong> We offer compassionate service during times of remembrance with private hire options available.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </FadeIn>
          </section>

          {/* Call to Action */}
          <section className="text-center">
            <div className="bg-brand-600 rounded-2xl p-8 md:p-12 shadow-xl transition-all duration-300 hover:transform hover:-translate-y-2 border-2 border-brand-700">
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 text-white drop-shadow-lg flex items-center justify-center gap-2">
                <BouncyEmoji>🎈</BouncyEmoji> Ready to Plan Your Event?
              </h3>
              <p className="text-lg mb-8 max-w-2xl mx-auto text-white/95 leading-relaxed">
                Our friendly team can&apos;t wait to help you create a truly special occasion! Reach out to check availability, discuss your ideas, or just say hello. We love making every event memorable.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <MotionLinkButton href="/contact" ariaLabel="Book your event now" className="inline-flex items-center justify-center px-8 py-4 bg-white text-brand-700 font-bold rounded-xl shadow-lg hover:bg-brand-100 hover:text-brand-800 transition-transform duration-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-400 border-2 border-brand-100">
                  <span className="mr-2 inline-block" aria-hidden="true">📞</span> Book Your Event Now
                </MotionLinkButton>

                <MotionLinkButton href="/menu#starters" ariaLabel="View our menus" className="inline-flex items-center justify-center px-8 py-4 bg-brand-100 text-brand-800 font-bold rounded-xl shadow-lg border-2 border-brand-200 hover:bg-brand-200 hover:border-brand-400 hover:text-brand-900 transition-transform duration-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-400">
                  <span className="mr-2 inline-block" aria-hidden="true">🍽️</span> View Our Menus
                </MotionLinkButton>

                <MotionLinkButton href="/contact" ariaLabel="Contact us" className="inline-flex items-center justify-center px-8 py-4 bg-brand-700 text-white font-bold rounded-xl shadow-lg border-2 border-brand-300 hover:bg-brand-800 hover:text-white transition-transform duration-150 backdrop-blur-sm focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-200">
                  <span className="mr-2 inline-block" aria-hidden="true">💬</span> Contact Us
                </MotionLinkButton>
              </div>
            </div>
          </section>
        </div>
      </div>
    </RestaurantLayout>
  );
}
