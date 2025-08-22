import RestaurantLayout from "@/components/restaurant/Layout";

export default function AboutPage() {
  return (
    <RestaurantLayout>
      <div className="min-h-screen bg-neutral-50">
        {/* Hero Section */}
        <div className="relative bg-brand-700 text-neutral-50 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              About <span className="text-accent">Himalayan Spice</span>
            </h1>
            <p className="text-xl text-neutral-100 max-w-2xl mx-auto">
              A unique blend of authentic Nepalese cuisine and traditional British pub culture
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-display font-bold text-brand-700 mb-6">
              Our Story
            </h2>
            
            <p className="text-neutral-600 mb-6">
              Located in the picturesque village of Girton, just minutes from Cambridge, 
              Old Crown offers a truly unique dining experience. We proudly serve authentic 
              Nepalese cuisine alongside traditional pub classics, creating a warm and 
              welcoming atmosphere for locals and visitors alike.
            </p>
            
            <p className="text-neutral-600 mb-6">
              Whether you&apos;re looking for an authentic taste of the Himalayas or comforting pub fare, 
              our talented chefs use only the freshest ingredients and time-honored recipes.
            </p>
            
            <p className="text-neutral-600 mb-6">
              As part of the Le Papillon Inns group, we&apos;re committed to providing exceptional 
              hospitality and unforgettable dining experiences. Join us for lunch, dinner, 
              or just a drink in our cozy bar.
            </p>

            <h3 className="text-2xl font-display font-bold text-brand-700 mb-4 mt-8">
              Awards & Recognition
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-neutral-100 p-6 rounded-lg">
                <h4 className="font-bold text-brand-700 mb-2">🏆 Best Curry House 2023</h4>
                <p className="text-neutral-600">Cambridge Food Awards</p>
              </div>
              <div className="bg-neutral-100 p-6 rounded-lg">
                <h4 className="font-bold text-brand-700 mb-2">⭐ TripAdvisor Excellence</h4>
                <p className="text-neutral-600">Certificate of Excellence</p>
              </div>
            </div>

            <h3 className="text-2xl font-display font-bold text-brand-700 mb-4">
              Visit Us Today
            </h3>
            
            <p className="text-neutral-600 mb-6">
              Experience the perfect blend of Nepalese hospitality and British pub tradition. 
              Call us to book your table or place a takeaway order.
            </p>

            <div className="bg-accent-50 rounded-xl p-8 text-center">
              <h4 className="text-xl font-display font-bold text-brand-700 mb-4">
                Ready to dine with us?
              </h4>
              <a
                href="tel:01223276027"
                className="inline-block bg-accent hover:bg-accent-700 text-neutral-50 font-bold py-4 px-8 rounded-lg text-lg transition-colors duration-200"
              >
                📞 Call: 01223 276027
              </a>
              <div className="mt-4 text-sm text-neutral-600">
                <p>Open Daily: 12:00 - 22:00 (Restaurant)</p>
                <p>Bar: 12:00 - 23:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RestaurantLayout>
  );
}
