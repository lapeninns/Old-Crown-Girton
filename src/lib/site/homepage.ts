import restaurantConfig from '@/config/restaurant.json';

export type HomepageFaqItem = {
  question: string;
  answer: string;
};

const PHONE_DISPLAY = '01223277217';

export const HOMEPAGE_FAQ_ITEMS: HomepageFaqItem[] = [
  {
    question: 'What type of cuisine does The Old Crown Girton serve?',
    answer:
      'The Old Crown Girton serves authentic Nepalese cuisine alongside British pub classics. The site highlights signature Nepalese favourites such as momo dumplings, Himalayan curries, and other traditional dishes served in a historic pub setting.',
  },
  {
    question: 'What are the opening hours at The Old Crown Girton?',
    answer:
      `The kitchen is closed on Monday, then opens Tuesday from ${restaurantConfig.hours.kitchen.tuesday.replace(',', ' and ')}, Wednesday to Friday from ${restaurantConfig.hours.kitchen.wednesday.replace(',', ' and ')}, Saturday from ${restaurantConfig.hours.kitchen.saturday}, and Sunday from ${restaurantConfig.hours.kitchen.sunday}. The bar is open Tuesday to Thursday ${restaurantConfig.hours.bar.tuesday}, Friday and Saturday ${restaurantConfig.hours.bar.friday}, Sunday ${restaurantConfig.hours.bar.sunday}, and closed on Monday.`,
  },
  {
    question: 'Do you take reservations?',
    answer:
      `Yes. You can book a table through our online booking page or call ${PHONE_DISPLAY} during opening hours to arrange your reservation.`,
  },
  {
    question: 'Is The Old Crown Girton dog-friendly?',
    answer:
      'Yes. The Old Crown is presented across the site as a dog-friendly pub, with well-behaved dogs welcome in the pub area plus the garden and terrace.',
  },
  {
    question: 'Is The Old Crown Girton family-friendly?',
    answer:
      'Yes. The homepage describes The Old Crown as family-friendly, and the site content notes that children are welcome until 9pm.',
  },
  {
    question: 'Do you offer takeaway?',
    answer:
      'Yes. The takeaway menu page offers a downloadable menu for Nepalese specialties and British pub favourites, and collection orders can be placed by phone.',
  },
  {
    question: 'Is parking available at The Old Crown Girton?',
    answer:
      'Yes. The site repeatedly highlights free on-site parking behind the pub, making visits easier for guests coming from Girton, Cambridge, and the A14 corridor.',
  },
  {
    question: 'Where is The Old Crown Girton located?',
    answer:
      `The Old Crown Girton is at ${restaurantConfig.address.street}, ${restaurantConfig.address.city}, ${restaurantConfig.address.zip}. The homepage positions it as just minutes from Cambridge and Girton College, making it an easy stop for locals, students, and visitors.`,
  },
  {
    question: 'What makes Nepalese cuisine different from Indian cuisine?',
    answer:
      'Nepalese cuisine shares some spices with Indian cooking, but it also reflects Himalayan and Tibetan influences. At The Old Crown, dishes such as momo and dal bhat help showcase those differences alongside richer curry dishes.',
  },
  {
    question: 'What makes The Old Crown Girton unique?',
    answer:
      'The Old Crown combines a historic village pub atmosphere with authentic Nepalese cooking and British pub classics. The site also positions it as the largest thatched pub in the country, with free parking, family-friendly dining, and dog-friendly spaces.',
  },
];
