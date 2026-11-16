// Publications, verified against Crossref, the TU Delft repository and Mert's CV (2026).
// Abstracts are quoted from the publisher or repository records.

export type PubType =
  | 'journal'
  | 'chapter'
  | 'report'
  | 'conference'
  | 'review';

export interface Publication {
  id: string;
  type: PubType;
  year: number;
  title: string;
  /** Author list as printed. Mert is matched by surname for emphasis. */
  authors: string[];
  /** Shown instead of the full list when there are many authors. */
  authorsShort?: string;
  venue: string;
  details?: string;
  doi?: string;
  url?: string;
  pdf?: string;
  preprint?: string;
  abstract?: string;
  note?: string;
  featured?: boolean;
  bibtex?: {
    kind: 'article' | 'incollection' | 'inproceedings' | 'techreport' | 'unpublished';
    journal?: string;
    booktitle?: string;
    volume?: string;
    pages?: string;
    publisher?: string;
    institution?: string;
  };
}

export const publications: Publication[] = [
  {
    id: 'sevilla2026lowinertia',
    type: 'journal',
    year: 2026,
    title:
      'Towards low-inertia power systems: an overview of monitoring technology, challenges and emerging solutions',
    authors: [
      'Felix Rafael Segundo Sevilla',
      'Yanli Liu',
      'Emilio Barocio',
      'Petr Korba',
      'Federica Bellizio',
      'Christoph Brosinsky',
      'Rahul Chakraborty',
      'Hector Chavez',
      'Robert Eriksson',
      'Guglielmo Frigo',
      'Mert Karaçelebi',
      'Panagiotis Papadopoulos',
      'Miguel Ramirez-Gonzalez',
      'Jose Luis Rueda',
      'Amir Sajadi',
      'Janne Seppänen',
      'Tong Su',
      'Sara Sulis',
      'Yoshihiko Susuki',
      'Bendong Tan',
      'Vladimir Terzija',
      'Xiaozhe Wang',
      'Haiwei Xie',
      'Junbo Zhao',
      'Muhy Eddin Za’ter',
      'Jochen Cremer',
    ],
    authorsShort: 'F. R. Segundo Sevilla et al., 26 authors including M. Karaçelebi',
    venue: 'International Journal of Electrical Power & Energy Systems',
    details: 'vol. 179, 112021',
    doi: '10.1016/j.ijepes.2026.112021',
    preprint: 'https://doi.org/10.2139/ssrn.6174715',
    note: 'Review written by the IEEE working group on Big Data & Analytics for Transmission Systems.',
    featured: true,
    bibtex: {
      kind: 'article',
      journal: 'International Journal of Electrical Power & Energy Systems',
      volume: '179',
      pages: '112021',
    },
  },
  {
    id: 'karacelebi2025ondf',
    type: 'journal',
    year: 2025,
    title: 'Online Neural Dynamics Forecasting for power system security',
    authors: ['Mert Karaçelebi', 'Jochen L. Cremer'],
    venue: 'International Journal of Electrical Power & Energy Systems',
    details: 'vol. 167, 110566',
    doi: '10.1016/j.ijepes.2025.110566',
    pdf: 'https://resolver.tudelft.nl/uuid:b44c7c4c-d3e0-46f6-bddd-f4b0c2a4c38b',
    preprint: 'https://doi.org/10.2139/ssrn.4903352',
    abstract:
      'The increase in variable renewable energy sources has brought about significant changes in power system dynamics, mainly due to the widespread adoption of power electronics and nonlinear controllers. The resulting complex system dynamics and the unpredictable nature of disturbances pose substantial challenges for real-time dynamic security assessment (DSA). Machine learning (ML) methods offer advantages in terms of computational speed compared to numerical methods and simulators. Offline-trained ML models, however, are limited by their training domain; e.g., they cannot easily consider various grid topologies and data changes. Neural Ordinary Differential Equations (NODEs) leverage the integration of neural networks and ODE solvers to enable continuous-time dynamic trajectory predictions from time series data, resolving the limitation on topological and data changes. This paper introduces the Online Neural Dynamics Forecaster (ONDF) workflow, designed to monitor and assess system security in real-time using multiple NODEs trained solely with local post-fault measurements. Through several case studies, we compare the regression and DSA classification capabilities of ONDF with various ML models. Our findings demonstrate that ONDF provides a novel and scalable approach for system operators to make informed decisions and apply corrective control actions based on predicted dynamics.',
    featured: true,
    bibtex: {
      kind: 'article',
      journal: 'International Journal of Electrical Power & Energy Systems',
      volume: '167',
      pages: '110566',
    },
  },
  {
    id: 'karacelebi2025frequency',
    type: 'journal',
    year: 2025,
    title:
      'Power system frequency monitoring and emergency control with neural ordinary differential equations',
    authors: ['Mert Karaçelebi', 'Jochen L. Cremer'],
    venue: 'Sustainable Energy, Grids and Networks',
    details: 'vol. 43, 101815',
    doi: '10.1016/j.segan.2025.101815',
    pdf: 'https://resolver.tudelft.nl/uuid:041826e0-d79a-4594-9981-e1cc84b1b393',
    preprint: 'https://doi.org/10.2139/ssrn.5059220',
    abstract:
      'Increasing renewable energy supply and distributed generating sources in the power grid lead to lower inertia levels. Lower inertia combined with higher uncertainty in operation can cause drastic frequency fluctuations when a disturbance occurs. System operators must know whether the transmission system is secure against a disturbance. Real-time models attempt to predict the frequency in near-real time however require pretraining on a large variety of possible disturbances. Training models in real-time would not require pre-training as they are directly trained on the occurring disturbance. However, training in real-time is not feasible until now as fast-occurring system dynamics require shorter prediction (and training) times for security and operation which standard machine learning models are not capable of. For the first time, this work proposes a fast training strategy that learns Neural Ordinary Differential Equations (NODE) in near real-time directly on the occurring disturbance, simultaneously addressing the inaccuracy issue of model-based dynamic studies. NODE learns the dynamics or derivatives of an ODE system that standard ODE solvers can solve. NODE provides a continuous function for predicting future dynamics in a decentralized way, hence faster frequency stability assessment for longer time spans. We propose a collocation-based sampling using the collocation gradients. Case studies on the IEEE 39-bus system show the approach is feasible for near real-time operation, accurately predicts future system states, and enables operators to apply predesigned corrective control actions, potentially making the system secure for future disturbances.',
    featured: true,
    bibtex: {
      kind: 'article',
      journal: 'Sustainable Energy, Grids and Networks',
      volume: '43',
      pages: '101815',
    },
  },
  {
    id: 'brosinsky2023mldt',
    type: 'chapter',
    year: 2023,
    title:
      'Machine learning and digital twins: monitoring and control for dynamic security in power systems',
    authors: ['Christoph Brosinsky', 'Mert Karaçelebi', 'Jochen L. Cremer'],
    venue: 'Monitoring and Control of Electrical Power Systems Using Machine Learning Techniques',
    details: 'Chapter 4, Elsevier, pp. 79-106',
    doi: '10.1016/B978-0-32-399904-5.00010-7',
    pdf: 'https://resolver.tudelft.nl/uuid:25a5e177-c1c5-4249-afba-553a313ea6df',
    abstract:
      'The reader of the chapter will be able to connect techniques from machine learning (ML) and digital twins (DTs) to gain insights for monitoring and control of (dynamic) security for electrical power systems. DTs are validated and verified high-fidelity (hf) models providing high simulation accuracy. DTs can be used for simulation of the supervised process of system operation and are therefore able to provide synthetic studied data, where measurement data are scarce. However, for some real-time applications in monitoring and control, such high-fidelity simulation models are not appropriate due to the corresponding computational barrier. There, ML aims to create an application-specific, low-fidelity (lf) approximation of the digital twin. Such trained lf models are used in real-time applications where computational time is scarce and lf information is sufficient. The conceptual intersection of hf and lf models has been little explored and becomes increasingly complex. This chapter aims to provide a conceptual overview of how such hf and lf models can be combined.',
    bibtex: {
      kind: 'incollection',
      booktitle: 'Monitoring and Control of Electrical Power Systems Using Machine Learning Techniques',
      pages: '79--106',
      publisher: 'Elsevier',
    },
  },
  {
    id: 'ieee2026tr140',
    type: 'report',
    year: 2026,
    title: 'Data-driven methods for secure low-inertia grids',
    authors: ['IEEE PES AMPS Working Group on Big Data & Analytics for Transmission Systems'],
    authorsShort: 'IEEE PES working group report. Mert led one of its chapters.',
    venue: 'IEEE PES Technical Report TR-140',
    details: 'IEEE Power & Energy Society',
    note: 'Chapter lead',
    bibtex: { kind: 'techreport', institution: 'IEEE Power & Energy Society' },
  },
  {
    id: 'karacelebi2022cigre',
    type: 'conference',
    year: 2022,
    title: 'Prediction of possible power system blackout risk with machine learning algorithms',
    authors: ['Mert Karaçelebi'],
    venue: 'CIGRE Session',
    details: 'Paris',
  },
  {
    id: 'karacelebi2018upec',
    type: 'conference',
    year: 2018,
    title: 'A new index for voltage quality assessment at distribution systems',
    authors: ['Mert Karaçelebi', 'Murat Göl', 'Özden Erçin'],
    venue: '53rd International Universities Power Engineering Conference (UPEC)',
    details: 'pp. 1-6',
    doi: '10.1109/UPEC.2018.8542073',
    bibtex: {
      kind: 'inproceedings',
      booktitle: '53rd International Universities Power Engineering Conference (UPEC)',
      pages: '1--6',
    },
  },
  {
    id: 'karacelebi2026contingency',
    type: 'review',
    year: 2026,
    title: 'Sequential Contingency Finder for Power System Security Tasks',
    authors: ['Mert Karaçelebi', 'Jochen L. Cremer'],
    venue: 'Electric Power Systems Research',
    details: 'under review',
    preprint: 'https://doi.org/10.2139/ssrn.6829019',
    abstract:
      'The increasing penetration of variable renewable energy sources has significantly altered power system dynamics, compelling operators to analyze a wide range of credible contingencies to ensure security. The high variability of operating conditions continuously reshapes the critical contingency set, making exhaustive screening computationally intractable under a limited computation budget, especially for multiple contingencies. This paper proposes a reinforcement learning framework with an adaptive reward formulation for contingency prioritization as a sequential decision-making problem. The framework learns adaptive selection policies directly from power flow features and is applicable to both dynamic and static security formulations. Evaluations on the IEEE 39-bus system demonstrate the effective identification of critical contingencies across both security formulations, confirming the viability of RL-based screening as a practical tool for system operators to reduce the search space under multi-contingency scenarios.',
    bibtex: { kind: 'unpublished' },
  },
];

export const groups: { type: PubType; label: string }[] = [
  { type: 'journal', label: 'Journal articles' },
  { type: 'review', label: 'Under review' },
  { type: 'chapter', label: 'Book chapter' },
  { type: 'report', label: 'Technical report' },
  { type: 'conference', label: 'Conference papers' },
];

export const doiUrl = (doi: string) => `https://doi.org/${doi}`;

/** Split an author string so the page can set Mert's name in a heavier weight. */
export const isMert = (name: string) => /kara[cç]elebi/i.test(name);

function latex(s: string) {
  return s
    .replace(/&/g, '\\&')
    .replace(/ç/g, '{\\c{c}}')
    .replace(/Ç/g, '{\\c{C}}')
    .replace(/ö/g, '{\\"o}')
    .replace(/Ö/g, '{\\"O}')
    .replace(/ä/g, '{\\"a}')
    .replace(/ü/g, '{\\"u}')
    .replace(/’/g, "'");
}

function bibAuthor(name: string) {
  // Corporate authors are wrapped in braces so BibTeX keeps them intact.
  if (/working group/i.test(name)) return `{${latex(name)}}`;
  const parts = name.trim().split(/\s+/);
  const last = parts.pop() ?? '';
  return `${latex(last)}, ${latex(parts.join(' '))}`;
}

export function toBibtex(p: Publication): string {
  if (!p.bibtex) return '';
  const b = p.bibtex;
  const fields: [string, string | undefined][] = [
    ['title', `{${latex(p.title)}}`],
    ['author', p.authors.map(bibAuthor).join(' and ')],
    ['journal', b.journal && latex(b.journal)],
    ['booktitle', b.booktitle && latex(b.booktitle)],
    ['institution', b.institution && latex(b.institution)],
    ['publisher', b.publisher],
    ['volume', b.volume],
    ['pages', b.pages],
    ['year', String(p.year)],
    ['note', p.type === 'review' ? `Under review, ${p.venue}` : p.type === 'report' ? 'Technical Report TR-140' : undefined],
    ['doi', p.doi],
  ];
  const body = fields
    .filter((f): f is [string, string] => Boolean(f[1]))
    .map(([k, v]) => `  ${k} = {${v}}`)
    .join(',\n');
  return `@${b.kind}{${p.id},\n${body}\n}`;
}
