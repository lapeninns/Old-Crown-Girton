import RestaurantLayout from "@/components/restaurant/Layout";
import Hero from "@/components/restaurant/Hero";
import AboutSection from "@/components/restaurant/AboutSection";
import MenuHighlights from "@/components/restaurant/MenuHighlights";
import TestimonialsSection from "@/components/restaurant/TestimonialsSection";
import TakeawayBanner from "@/components/restaurant/TakeawayBanner";
import LocationSection from "@/components/restaurant/LocationSection";
import { generateRestaurantSchema } from "@/libs/schema";

export default function Page() {
  const restaurantSchema = generateRestaurantSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(restaurantSchema),
        }}
      />
      <RestaurantLayout>
        <Hero />
        <AboutSection />
        <MenuHighlights />
        <TestimonialsSection />
        <TakeawayBanner />
        <LocationSection />
      </RestaurantLayout>
    </>
  );
}
