'use client';
import RestaurantHoursCard from './RestaurantHoursCard';
import InteractiveMap from './InteractiveMap';
import { getContactInfo } from '@/lib/restaurantData';
import EmojiIcon from '@/components/common/EmojiIcon';
import {
  accentTextClassName,
  contentPanelRecipe,
  mapFrameRecipe,
  panelTitleRecipe,
  sectionDescriptionRecipe,
  sectionInnerClassName,
  sectionShellClassName,
  sectionTitleRecipe,
} from '@/src/design-system';

export default function LocationSection() {
  const contact = getContactInfo();

  return (
    <section className={`bg-brand-50 ${sectionShellClassName}`}>
      <div className={sectionInnerClassName}>
        <div className="text-center mb-12">
          <h2 id="location-heading" className={sectionTitleRecipe('mb-4 text-foreground-strong')}>
            Find <span className={accentTextClassName}>Us</span>
          </h2>
          <p className={sectionDescriptionRecipe('text-foreground')}>
            Located in the heart of Girton village, we&apos;re easily accessible 
            and just a short drive from Cambridge city center.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            {/* Address */}
            <div className={contentPanelRecipe()}>
              <h3 className={panelTitleRecipe('mb-4 flex items-center gap-2 text-foreground-strong')}>
                <EmojiIcon emoji="📍" className={accentTextClassName} />
                Address
              </h3>
              <p className="text-foreground">
                Old Crown<br />
                {contact?.address.street || 'High Street'}<br />
                {contact?.address.area}, {contact?.address.city}<br />
                {contact?.address.postcode}
              </p>
            </div>

            {/* Contact Details */}
            <div className={contentPanelRecipe()}>
              <h3 className={panelTitleRecipe('mb-4 flex items-center gap-2 text-foreground-strong')}>
                <EmojiIcon emoji="📞" className={accentTextClassName} />
                Contact
              </h3>
              <div className="space-y-2 text-foreground">
                <p>
                  <strong>Phone:</strong> 
                  <a href="tel:01223 277217" className="text-accent hover:underline ml-2" aria-label="Call Old Crown Girton at 01223 277217">
                    {contact?.phone.display || '01223 277217'}
                  </a>
                </p>
                <p>
                  <strong>Email:</strong> 
                  <a href="mailto:oldcrown@lapeninns.com" className="text-accent hover:underline ml-2">
                    {contact?.email.primary || 'oldcrown@lapeninns.com'}
                  </a>
                </p>
              </div>
            </div>

            {/* Opening Hours - New Restaurant Hours Card */}
            <div className="mt-8">
              <RestaurantHoursCard />
            </div>
          </div>

          {/* Map */}
          <div>
            <InteractiveMap 
              className={mapFrameRecipe('h-[600px]')}
              title="Old Crown Girton Location"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
