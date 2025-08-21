import RestaurantLayout from "@/components/restaurant/Layout";
import { getMarketingSmart } from '@/src/lib/data/loader';
import { SchemaInjector } from "@/components/seo/RestaurantSchema";
import { getContactInfo, getHours } from "@/lib/restaurantData";

export default async function AboutPage() {
  const m = await getMarketingSmart();
  const labels = m.buttons || {};
  const labelBookOnline = labels.bookOnline || 'Book Online';
  const contact = getContactInfo();
  const hours = getHours();
  const postcode = contact?.address.postcode || "CB3 0QQ";
  // Derive a concise combined hours summary for quick display
  const kitchenWeek = hours?.display?.kitchen?.weekdays;
  const kitchenWeekend = `${hours?.display?.kitchen?.saturday || ''}${hours?.display?.kitchen?.saturday && hours?.display?.kitchen?.sunday ? ' / ' : ''}${hours?.display?.kitchen?.sunday || ''}`;
  const barWeek = hours?.display?.bar?.mon_thu;
  const barWeekend = `${hours?.display?.bar?.fri_sat || ''}${hours?.display?.bar?.fri_sat && hours?.display?.bar?.sunday ? ' / ' : ''}${hours?.display?.bar?.sunday || ''}`;
  const quickHours = kitchenWeek || barWeek ? `Kitchen ${kitchenWeek}${kitchenWeekend ? ` • W/E ${kitchenWeekend}` : ''} | Bar ${barWeek}${barWeekend ? ` • W/E ${barWeekend}` : ''}` : undefined;
  return (
    <RestaurantLayout>
      <SchemaInjector type="breadcrumb" data={[
        { name: 'Home', url: 'https://oldcrowngirton.co.uk/' },
        { name: 'About', url: 'https://oldcrowngirton.co.uk/about' }
      ]} page="about" />
      <div className="min-h-screen bg-neutral-50">
        {/* Hero Section */}
        <div className="relative bg-brand-700 text-neutral-50 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              About <span className="text-accent-500">Himalayan Spice</span>
            </h1>
            <p className="text-xl text-neutral-100 max-w-2xl mx-auto">
              Historic thatched village pub near Cambridge blending community heritage & authentic Nepalese flavour
            </p>
          </div>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="prose prose-lg max-w-none">
              <p className="text-neutral-600 mb-6">Located on Girton High Street just minutes from Cambridge, The Himalayan Spice blends the charm of a historic thatched English pub with a warmly spiced Nepalese kitchen. After previous periods of change, today we focus on a clear, consistent dual identity: heritage setting + Himalayan flavour.</p>
            <p className="text-neutral-600 mb-6">We welcome Girton locals, families, Girton College students & staff, professionals from the wider "Silicon Fen" and visitors seeking an authentic village pub experience with something unexpectedly delicious.</p>
            <p className="text-neutral-600 mb-6">Our kitchen balances aromatic Nepalese spice profiles with familiar British comfort options and calmer choices for younger or milder palates.</p>

            <h3 className="text-2xl font-display font-bold text-brand-700 mb-4 mt-8">Heritage Timeline</h3>
            <ul className="list-disc pl-6 text-neutral-600 space-y-2 mb-8">
              <li><span className="font-semibold">1930s:</span> Present thatched structure established (continuing village inn legacy).</li>
              <li><span className="font-semibold">Transitions:</span> Various management changes created fragmented online identity.</li>
              <li><span className="font-semibold">Current Chapter:</span> Unified “Pub + Nepalese” positioning serving Girton & wider Cambridge audiences.</li>
            </ul>

            <h3 className="text-2xl font-display font-bold text-brand-700 mb-4">What Makes Us Different</h3>
            <ul className="list-disc pl-6 text-neutral-600 space-y-2 mb-8">
              <li>Distinctive thatched landmark building</li>
              <li>Authentic Nepalese dishes alongside pub favourites</li>
              <li>Inclusive space: locals, families, students, professionals & visitors</li>
              <li>Close Girton College & north Cambridge access</li>
              <li>Garden & flexible areas for informal gatherings</li>
            </ul>

            <h3 className="text-2xl font-display font-bold text-brand-700 mb-4">Community Involvement</h3>
            <p className="text-neutral-600 mb-6">We aim to support village life, collaborate on local initiatives and provide a neutral meeting place. <span className="italic">[placeholder: add specific partnership / sponsorship once confirmed]</span></p>

            <h3 className="text-2xl font-display font-bold text-brand-700 mb-4">For Different Audiences</h3>
            <ul className="list-disc pl-6 text-neutral-600 space-y-2 mb-8">
              <li><strong>Locals:</strong> Reliable, familiar, welcoming.</li>
              <li><strong>Families:</strong> Garden space & mild dish options.</li>
              <li><strong>Students & Staff:</strong> Walkable social venue near college.</li>
              <li><strong>Professionals:</strong> Relaxed out‑of‑city meet point.</li>
              <li><strong>Visitors:</strong> Memorable thatched setting + unexpected cuisine.</li>
            </ul>

            <h3 className="text-2xl font-display font-bold text-brand-700 mb-4">Kitchen Ethos</h3>
            <p className="text-neutral-600 mb-6">Balanced spice, aromatic depth, respectful technique. British staples remain for guests seeking traditional comfort. <span className="italic">[placeholder: add sourcing or supplier note]</span></p>

            <h3 className="text-2xl font-display font-bold text-brand-700 mb-4">Private Hire & Groups</h3>
            <p className="text-neutral-600 mb-6">Enquire about gatherings, society evenings or seasonal celebrations. <span className="italic">[placeholder: capacity / room details]</span></p>

            <h3 className="text-2xl font-display font-bold text-brand-700 mb-4">Visit Us</h3>
            <p className="text-neutral-600 mb-6">Plan a meal, relaxed pint, quiz night or post‑lecture catch‑up. We look forward to welcoming you.</p>

            <div className="bg-accent-50 rounded-xl p-8 text-center">
              <h4 className="text-xl font-display font-bold text-brand-700 mb-4">Ready to Book?</h4>
              <a
                href="https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-accent-500 hover:bg-accent-600 text-neutral-50 font-bold py-4 px-8 rounded-lg text-lg transition-colors duration-200"
              >
                {labelBookOnline}
              </a>
              <div className="mt-4 text-sm text-neutral-600">
                <p><span className="font-semibold">Address:</span> 89 High St, Girton, Cambridge {postcode}</p>
                <p><span className="font-semibold">Opening Hours:</span> <span className="italic">{quickHours || 'See footer for full hours'}</span></p>
                {/* TODO: Replace remaining placeholders elsewhere on page (partnership, sourcing note, capacity) once details confirmed */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </RestaurantLayout>
  );
}
