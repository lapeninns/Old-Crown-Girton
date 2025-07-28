import RestaurantLayout from "@/components/restaurant/Layout";

export default function EventsPage() {
  const events = [
    {
      title: "Curry Night Special",
      description: "Every Tuesday - 20% off all Nepalese curries",
      frequency: "Every Tuesday",
      icon: "🌶️"
    },
    {
      title: "Pub Quiz Night",
      description: "Test your knowledge every Thursday at 8pm. Prizes to be won!",
      frequency: "Every Thursday, 8:00 PM",
      icon: "🧠"
    },
    {
      title: "Live Music Weekend",
      description: "Enjoy acoustic performances in our beer garden",
      frequency: "First Saturday of each month",
      icon: "🎵"
    }
  ];

  return (
    <RestaurantLayout>
      <div className="min-h-screen bg-crown-cream py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-crown-slate mb-4">
              Events & <span className="text-crown-gold">Special Offers</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Join us for regular events and special occasions throughout the year. 
              Call ahead to reserve your spot!
            </p>
          </div>

          {/* Regular Events */}
          <div className="space-y-6 mb-12">
            {events.map((event, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{event.icon}</span>
                  <div className="flex-1">
                    <h3 className="text-xl font-display font-bold text-crown-slate mb-2">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 mb-2">{event.description}</p>
                    <p className="text-sm font-medium text-crown-gold">{event.frequency}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Private Events */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="text-center">
              <span className="text-6xl mb-4 block">🎉</span>
              <h2 className="text-2xl font-display font-bold text-crown-slate mb-4">
                Private Events & Functions
              </h2>
              <p className="text-gray-600 mb-6">
                Planning a birthday, anniversary, business meeting, or special celebration? 
                Our private dining room and terrace garden are perfect for your event.
              </p>
              
              <div className="bg-crown-cream rounded-lg p-6 mb-6">
                <h3 className="font-bold text-crown-slate mb-3">We can accommodate:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>• Birthday parties</div>
                  <div>• Business meetings</div>
                  <div>• Anniversary celebrations</div>
                  <div>• Wedding receptions</div>
                  <div>• Corporate events</div>
                  <div>• Family gatherings</div>
                </div>
              </div>
              
              <a
                href="tel:01223276027"
                className="inline-block bg-primary hover:bg-crown-gold-dark text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors duration-200"
              >
                📞 Call to Book: 01223 276027
              </a>
            </div>
          </div>

          {/* Contact for Updates */}
          <div className="bg-crown-gold/10 border-2 border-crown-gold rounded-xl p-6 text-center">
            <h3 className="text-xl font-display font-bold text-crown-slate mb-3">
              Stay Updated
            </h3>
            <p className="text-gray-600 mb-4">
              Follow us on social media or call for the latest events and special offers.
            </p>
            <div className="flex justify-center space-x-4">
              <a href="https://facebook.com" className="text-crown-gold hover:text-crown-gold-dark transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://instagram.com" className="text-crown-gold hover:text-crown-gold-dark transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.987 11.988 11.987 6.62 0 11.987-5.366 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.291C3.897 14.411 3.29 13.043 3.29 11.498c0-1.544.608-2.913 1.837-4.198.875-.801 2.026-1.291 3.323-1.291 1.297 0 2.448.49 3.323 1.291 1.228 1.285 1.837 2.654 1.837 4.198 0 1.545-.609 2.913-1.837 4.199-.875.8-2.026 1.291-3.323 1.291z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </RestaurantLayout>
  );
}
