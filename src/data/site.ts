// Every editable fact about the company lives here.
// Empty strings are treated as "not set" and the related UI is not rendered.

export const site = {
  name: 'Lydion Energy',
  tagline: 'Software and studies for power system dynamics.',
  description:
    'Lydion Energy builds power system software, runs RMS and EMT stability studies, and advises on AI in energy systems. Founded by Mert Karaçelebi, power systems researcher at TU Delft.',
  location: 'Rotterdam, the Netherlands',
  locationShort: 'Rotterdam, NL',

  email: 'mert.karacelebi@gmail.com',
  // Kept out of the page on purpose. Fill in only if Mert wants a phone number public.
  phone: '',

  links: {
    linkedin: 'https://www.linkedin.com/in/mert-kara%C3%A7elebi-37827854/',
    scholar: '', // TODO(Mert): Google Scholar profile URL
    orcid: 'https://orcid.org/0000-0002-5810-5791',
    repository:
      'https://repository.tudelft.nl/person/Person_c0ba081e-c84f-48b8-a02b-550b59de7d58',
    nodeProject: 'https://nod-lyart.vercel.app',
  },

  // Dutch businesses must show these on their website once registered.
  company: {
    kvk: '', // TODO(Mert): Chamber of Commerce number
    btw: '', // TODO(Mert): VAT number
  },

  founder: {
    name: 'Mert Karaçelebi',
    nameAscii: 'Mert Karacelebi',
    role: 'Founder',
    title: 'PhD candidate, TU Delft',
  },

  photoCredit: 'Marieke de Lorijn',
} as const;

export const nav = [
  { href: '/#services', label: 'Services' },
  { href: '/#expertise', label: 'Expertise' },
  { href: '/research/', label: 'Research' },
  { href: '/#about', label: 'About' },
  { href: '/#contact', label: 'Contact' },
] as const;
