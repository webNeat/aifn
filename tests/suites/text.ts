import z from 'zod'
import { testFn } from '../utils.js'

// export const correctGrammar = testFn({
//   name: 'correctGrammar',
//   description: 'Fix grammatical errors in text while preserving meaning',
//   input: z.string().describe('Text that may contain grammatical errors'),
//   output: z.string().describe('The same text with all grammatical errors fixed'),
//   examples: [
//     {
//       input: 'We was going to the park yesterday.',
//       output: 'We were going to the park yesterday.',
//     },
//     {
//       input: 'The children is playing with their toys.',
//       output: 'The children are playing with their toys.',
//     },
//     {
//       input: 'Each of the student have their own book.',
//       output: 'Each of the students has their own book.',
//     },
//   ],
//   tests: [
//     {
//       description: 'Basic subject-verb agreement',
//       input: 'He run fast.',
//       output: 'He runs fast.',
//     },
//     {
//       description: 'Simple pronoun correction',
//       input: 'Me and him went to the store.',
//       output: 'He and I went to the store.',
//     },
//     {
//       description: 'Plural subject-verb agreement',
//       input: 'The cats is sleeping on the bed.',
//       output: 'The cats are sleeping on the bed.',
//     },
//     {
//       description: 'Contraction correction',
//       input: 'She dont like ice cream.',
//       output: "She doesn't like ice cream.",
//     },
//     {
//       description: 'Complex tense correction',
//       input: 'If I would have known, I would helped.',
//       output: 'If I had known, I would have helped.',
//     },
//     {
//       description: 'Multiple errors in one sentence',
//       input: 'Neither of the options were good, and none of them work properly.',
//       output: 'Neither of the options was good, and none of them worked properly.',
//     },
//     {
//       description: 'Articles and prepositions',
//       input: 'She went to hospital for get medicine at morning.',
//       output: 'She went to the hospital to get medicine in the morning.',
//     },
//     {
//       description: 'Complex subject-verb with intervening phrases',
//       input: 'The list of items, along with their descriptions and prices, were submitted yesterday.',
//       output: 'The list of items, along with their descriptions and prices, was submitted yesterday.',
//     },
//     {
//       description: 'Multiple clauses with various errors',
//       input: 'Not only the students but also the teacher were late, and when they arrived, none of them was prepared.',
//       output: 'Not only the students but also the teacher was late, and when they arrived, none of them were prepared.',
//     },
//     {
//       description: 'Complex sentence with multiple grammar issues',
//       input: 'If me and him would have went to the party last night, we could of saw the presentation, but instead we was working.',
//       output: 'If he and I had gone to the party last night, we could have seen the presentation, but instead we were working.',
//     },
//   ],
// })

// export const bulletPoints = testFn({
//   name: 'bulletPoints',
//   description: 'Extract key points from a paragraph as bullet points',
//   input: z.string().describe('A paragraph of text containing multiple pieces of information'),
//   output: z.array(z.string().describe('A concise bullet point extracted from the text')),
//   examples: [
//     {
//       input: 'The new iPhone features a better camera, longer battery life, and faster processor. It comes in five colors and starts shipping next week.',
//       output: [
//         'Features improved camera quality',
//         'Has longer battery life',
//         'Includes faster processor',
//         'Available in five colors',
//         'Shipping begins next week',
//       ],
//     },
//     {
//       input:
//         'Our company was founded in 2010. We have offices in three countries. Our team consists of 50 employees. Annual revenue exceeded $1M last year.',
//       output: ['Founded in 2010', 'Has offices in three countries', 'Team of 50 employees', 'Annual revenue over $1M'],
//     },
//   ],
//   tests: [
//     {
//       description: 'Basic feature list',
//       input: 'TypeScript is a programming language. It adds static typing to JavaScript. It compiles to plain JavaScript.',
//       output: ['TypeScript is a programming language', 'Adds static typing to JavaScript', 'Compiles to plain JavaScript'],
//     },
//     {
//       description: 'Simple facts with numbers',
//       input: 'The project started in 2012. It has over 3 million users. Monthly downloads exceed 500,000.',
//       output: ['Project started in 2012', 'Has over 3 million users', 'Monthly downloads exceed 500,000'],
//     },
//     {
//       description: 'Technical specifications',
//       input:
//         'The new processor features 8 cores running at 3.5GHz base clock. It supports up to 128GB of RAM and has integrated graphics. Power consumption is rated at 65W TDP.',
//       output: ['8 cores at 3.5GHz base clock', 'Supports up to 128GB RAM', 'Includes integrated graphics', '65W TDP power consumption'],
//     },
//     {
//       description: 'Mixed business metrics',
//       input:
//         'Our Q4 revenue grew by 25% year-over-year. Customer satisfaction reached 92%. We expanded to 3 new markets and launched 2 product lines. Employee retention improved to 95%.',
//       output: ['Q4 revenue grew 25% YoY', '92% customer satisfaction', 'Expanded to 3 new markets', 'Launched 2 product lines', '95% employee retention'],
//     },
//     {
//       description: 'Process steps with temporal information',
//       input:
//         'First, prepare the environment by installing dependencies. Then configure the database settings in config.json. Finally, run the migration scripts and start the server. Regular backups are scheduled every 6 hours.',
//       output: [
//         'Prepare environment and install dependencies',
//         'Configure database in config.json',
//         'Run migration scripts',
//         'Start the server',
//         'Backups scheduled every 6 hours',
//       ],
//     },
//     {
//       description: 'Complex feature comparison',
//       input:
//         'The premium plan includes unlimited storage with end-to-end encryption, while the basic plan is limited to 100GB. Premium users get priority support with 1-hour response time, compared to 24 hours for basic users. Advanced analytics and custom reporting are exclusive to premium. Both plans include standard backup features.',
//       output: [
//         'Premium: Unlimited storage with encryption',
//         'Basic: 100GB storage limit',
//         'Premium: 1-hour support response time',
//         'Basic: 24-hour support response time',
//         'Premium: Advanced analytics and custom reporting',
//         'Both plans: Standard backup features',
//       ],
//     },
//     {
//       description: 'Event details with multiple aspects',
//       input:
//         'The annual conference will be held from September 15-17, 2024, at the Grand Convention Center. Early bird registration ends July 1st, with prices starting at $299. This year features 50 speakers across 5 tracks, including AI, Cloud Computing, and Security. Workshops are limited to 30 participants each. All sessions will be recorded and available online.',
//       output: [
//         'Dates: September 15-17, 2024',
//         'Location: Grand Convention Center',
//         'Early bird deadline: July 1st',
//         'Starting price: $299',
//         '50 speakers across 5 tracks',
//         'Topics: AI, Cloud, Security',
//         'Workshop capacity: 30 participants',
//         'Sessions available online',
//       ],
//     },
//     {
//       description: 'Research findings with statistics',
//       input:
//         'The study, conducted over 2 years, showed a 45% reduction in error rates. Participant satisfaction increased from 65% to 89%. Cost efficiency improved by 33%, while processing time decreased by 50%. Secondary benefits included a 25% reduction in resource usage and 40% lower maintenance requirements. Long-term projections suggest sustained improvements.',
//       output: [
//         '2-year study duration',
//         '45% reduction in error rates',
//         'Satisfaction increased: 65% to 89%',
//         '33% better cost efficiency',
//         '50% faster processing time',
//         '25% lower resource usage',
//         '40% reduced maintenance needs',
//         'Projected sustained improvements',
//       ],
//     },
//     {
//       description: 'Mixed content with conditional statements',
//       input:
//         'If system load exceeds 80%, automatic scaling will initiate. When storage reaches 90% capacity, older logs are archived. Users receive warnings at 95% quota usage. Premium features unlock after 30 days of continuous usage or reaching 1000 API calls. Support is available 24/7 for critical issues.',
//       output: [
//         'Auto-scaling at 80% system load',
//         'Log archiving at 90% storage',
//         'Warnings at 95% quota usage',
//         'Premium features: 30 days or 1000 API calls',
//         '24/7 critical support available',
//       ],
//     },
//     {
//       description: 'Complex nested information',
//       input:
//         'The platform supports three authentication methods: OAuth2 with major providers (Google, GitHub, LinkedIn), hardware security keys including FIDO2-compliant devices, and traditional username/password with optional 2FA. Each method requires different setup steps and offers varying security levels. Enterprise users can enforce specific methods per department. Security logs are retained for 90 days, with premium accounts extending to 1 year.',
//       output: [
//         'Three authentication methods supported',
//         'OAuth2: Google, GitHub, LinkedIn',
//         'Hardware security keys with FIDO2',
//         'Username/password with optional 2FA',
//         'Different setup per method',
//         'Varying security levels',
//         'Department-specific enforcement',
//         '90-day security logs retention',
//         'Premium: 1-year log retention',
//       ],
//     },
//   ],
// })

export const extractContactInfo = testFn({
  name: 'extractContactInfo',
  description: 'Extract contact information from text',
  input: z.string().describe('Text that may contain contact information like emails, phone numbers, addresses, and names'),
  output: z
    .object({
      emails: z.array(z.string().describe('Email addresses found in the text')),
      phones: z.array(z.string().describe('Phone numbers in various formats (e.g., (555) 123-4567, 555-123-4567)')),
      addresses: z.array(z.string().describe('Physical addresses, can include street, city, state, and zip code')),
      names: z.array(z.string().describe('Full names of people mentioned in the text')),
    })
    .describe('Structured contact information extracted from the text'),
  examples: [
    {
      input: 'For support, contact Sarah Johnson (sarah.j@helpdesk.com) or call our hotline at 1-800-555-0123.',
      output: {
        emails: ['sarah.j@helpdesk.com'],
        phones: ['1-800-555-0123'],
        addresses: [],
        names: ['Sarah Johnson'],
      },
    },
    {
      input: 'Our main office (Manager: David Lee) is located at 789 Oak Road, Suite 456, Chicago, IL 60601. Technical support: tech@support.com.',
      output: {
        emails: ['tech@support.com'],
        phones: [],
        addresses: ['789 Oak Road, Suite 456, Chicago, IL 60601'],
        names: ['David Lee'],
      },
    },
  ],
  tests: [
    {
      description: 'Basic contact information',
      input: 'Contact John Doe at john.doe@example.com or call (555) 123-4567.',
      output: {
        emails: ['john.doe@example.com'],
        phones: ['(555) 123-4567'],
        addresses: [],
        names: ['John Doe'],
      },
    },
    // {
    //   description: 'Contact with address',
    //   input: 'Contact John Doe at john.doe@example.com or call (555) 123-4567. The office is at 123 Main St, Suite 100, Boston, MA 02108.',
    //   output: {
    //     emails: ['john.doe@example.com'],
    //     phones: ['(555) 123-4567'],
    //     addresses: ['123 Main St, Suite 100, Boston, MA 02108'],
    //     names: ['John Doe'],
    //   },
    // },
    // {
    //   description: 'Multiple contacts',
    //   input:
    //     'Please reach out to Alice Smith (alice@company.com) or Bob Wilson (bob@company.com, 555-999-8888) at our NYC office: 456 Park Avenue, New York, NY 10022.',
    //   output: {
    //     emails: ['alice@company.com', 'bob@company.com'],
    //     phones: ['555-999-8888'],
    //     addresses: ['456 Park Avenue, New York, NY 10022'],
    //     names: ['Alice Smith', 'Bob Wilson'],
    //   },
    // },
    // {
    //   description: 'International format',
    //   input:
    //     'Our international offices: Sarah Chen (+86 123 4567 8901) in Beijing China, 100000; Maria Garcia (maria.g@global.co.uk, +34 612 345 678) in Calle Mayor 1, Madrid, Spain 28013.',
    //   output: {
    //     emails: ['maria.g@global.co.uk'],
    //     phones: ['+86 123 4567 8901', '+34 612 345 678'],
    //     addresses: ['Beijing China, 100000', 'Calle Mayor 1, Madrid, Spain 28013'],
    //     names: ['Sarah Chen', 'Maria Garcia'],
    //   },
    // },
    // {
    //   description: 'Mixed formats with titles',
    //   input:
    //     'Contact: Dr. James Wilson, MD (dr.wilson@hospital.org, 1-800-555-0199), Head of Surgery. Assistant: Ms. Jane Smith (j.smith@hospital.org), Tel: 555.123.4567 ext. 890. Address: Medical Center, 789 Health Ave, Floor 5, Chicago IL 60601.',
    //   output: {
    //     emails: ['dr.wilson@hospital.org', 'j.smith@hospital.org'],
    //     phones: ['1-800-555-0199', '555.123.4567'],
    //     addresses: ['Medical Center, 789 Health Ave, Floor 5, Chicago IL 60601'],
    //     names: ['Dr. James Wilson', 'Jane Smith'],
    //   },
    // },
    // {
    //   description: 'Complex business listing',
    //   input: `ACME Corporation
    //     Primary Contact: John Smith, CEO (j.smith@acme.com)
    //     Technical Support: support@acme.com, (800) 555-1234
    //     Sales Team:
    //       - Mary Johnson (m.johnson@acme.com), Direct: 555-111-2233
    //       - Tom Brown (t.brown@acme.com), Cell: 555-444-5566
    //     Headquarters: One Corporate Plaza, Suite 1500
    //                  1000 Business Ave
    //                  New York, NY 10001`,
    //   output: {
    //     emails: ['j.smith@acme.com', 'support@acme.com', 'm.johnson@acme.com', 't.brown@acme.com'],
    //     phones: ['(800) 555-1234', '555-111-2233', '555-444-5566'],
    //     addresses: ['One Corporate Plaza, Suite 1500, 1000 Business Ave, New York, NY 10001'],
    //     names: ['John Smith', 'Mary Johnson', 'Tom Brown'],
    //   },
    // },
    // {
    //   description: 'Multiple locations with departments',
    //   input: `Global Offices Directory:
    //     USA (HQ):
    //       Operations: Mike Davis (m.davis@global.com), +1 (555) 123-4567 ext. 101
    //       100 Enterprise Way, Suite 200, Sometown, CA 94025

    //     UK Branch:
    //       Director: Emma Watson (e.watson@global.co.uk)
    //       Support: uk.support@global.com, Tel: +44 20 7123 4567
    //       The Shard, 32 London Bridge St, London SE1 9SG

    //     Australia Office:
    //       Manager: Jack Thompson
    //       Contact: jack.t@global.com.au, +61 2 8765 4321
    //       200 George St, Sydney NSW 2000`,
    //   output: {
    //     emails: ['m.davis@global.com', 'e.watson@global.co.uk', 'uk.support@global.com', 'jack.t@global.com.au'],
    //     phones: ['+1 (555) 123-4567', '+44 20 7123 4567', '+61 2 8765 4321'],
    //     addresses: [
    //       '100 Enterprise Way, Suite 200, Sometown, CA 94025',
    //       'The Shard, 32 London Bridge St, London SE1 9SG',
    //       '200 George St, Sydney NSW 2000',
    //     ],
    //     names: ['Mike Davis', 'Emma Watson', 'Jack Thompson'],
    //   },
    // },
    // {
    //   description: 'Various phone formats',
    //   input:
    //     'Contact numbers: Main: (555) 123-4567, Toll-free: 1-800-555-0123, International: +44 20 7123 4567, Extension: 555.111.2233 x500, Mobile: 555-999-8888, Fax: 555-777-9999, Emergency: 1.888.555.0000',
    //   output: {
    //     emails: [],
    //     phones: ['(555) 123-4567', '1-800-555-0123', '+44 20 7123 4567', '555.111.2233', '555-999-8888', '555-777-9999', '1.888.555.0000'],
    //     addresses: [],
    //     names: [],
    //   },
    // },
    {
      description: 'Various email formats',
      input:
        'Email directory: primary@example.com, user.name@subdomain.company.co.uk, first-last@domain.org, name+tag@email.com, department.name_123@company.com.au, user@host.subdomain.domain.net',
      output: {
        emails: [
          'primary@example.com',
          'user.name@subdomain.company.co.uk',
          'first-last@domain.org',
          'name+tag@email.com',
          'department.name_123@company.com.au',
          'user@host.subdomain.domain.net',
        ],
        phones: [],
        addresses: [],
        names: [],
      },
    },
    {
      description: 'Complex mixed content',
      input: `Company Directory 2024

        Executive Team:
        - CEO: Dr. Sarah J. Anderson, PhD
          Email: s.anderson@company.global
          Direct: +1 (555) 123-4567 ext. 101
          Office: Executive Tower, 50th Floor

        Regional Offices:
        1. North America
           Director: Michael O'Connor-Smith III
           Contact: m.oconnor-smith@company.us, 1-800-555-0123
           Address: 100 Business Circle, Suite 1500
                   Manhattan, NY 10001, USA

        2. European Union
           Directors:
           - Hans-Peter Müller (h.mueller@company.eu)
           - María García-López (m.garcia@company.eu)
           Phone: +49 30 12345678, +34 91 1234567
           Location: Hauptstraße 1, 10115 Berlin, Germany
                    Calle Mayor 123, 28001 Madrid, Spain

        Technical Support:
        * 24/7 Hotline: 1-888-TECH-HELP (1-888-832-4435)
        * Email: support@company.global, emergency@company.global
        * Chat: Available on website`,
      output: {
        emails: [
          's.anderson@company.global',
          'm.oconnor-smith@company.us',
          'h.mueller@company.eu',
          'm.garcia@company.eu',
          'support@company.global',
          'emergency@company.global',
        ],
        phones: ['+1 (555) 123-4567', '1-800-555-0123', '+49 30 12345678', '+34 91 1234567', '1-888-832-4435'],
        addresses: [
          'Executive Tower, 50th Floor',
          '100 Business Circle, Suite 1500, Manhattan, NY 10001, USA',
          'Hauptstraße 1, 10115 Berlin, Germany',
          'Calle Mayor 123, 28001 Madrid, Spain',
        ],
        names: ['Dr. Sarah J. Anderson', "Michael O'Connor-Smith III", 'Hans-Peter Müller', 'María García-López'],
      },
    },
  ],
})

// export const extractDates = testFn({
//   name: 'extractDates',
//   description: 'Extract and normalize dates from text',
//   input: z.string().describe('Text containing dates in various formats, both absolute and relative'),
//   output: z
//     .array(
//       z
//         .object({
//           original: z.string().describe('The date exactly as it appears in the text'),
//           iso: z.string().describe('The date converted to ISO 8601 format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss)'),
//           type: z.enum(['absolute', 'relative']).describe('Whether the date is absolute (e.g., "2024-01-15") or relative (e.g., "next Friday")'),
//         })
//         .describe('A date found in the text with its normalized form'),
//     )
//     .describe('Array of all dates found in the text'),
//   examples: [
//     {
//       input: 'The conference is scheduled for May 15th, 2024. Registration deadline is in 3 weeks.',
//       output: [
//         {
//           original: 'May 15th, 2024',
//           iso: '2024-05-15',
//           type: 'absolute',
//         },
//         {
//           original: 'in 3 weeks',
//           iso: '2024-02-02',
//           type: 'relative',
//         },
//       ],
//     },
//     {
//       input: 'Submit your report by EOD 12/31/23. The next review will be next Monday at 2pm.',
//       output: [
//         {
//           original: '12/31/23',
//           iso: '2023-12-31',
//           type: 'absolute',
//         },
//         {
//           original: 'next Monday at 2pm',
//           iso: '2024-01-15T14:00:00',
//           type: 'relative',
//         },
//       ],
//     },
//   ],
//   tests: [
//     {
//       input: 'The meeting is on January 15th, 2024 and the deadline is next Friday. The project started on 2023-12-01.',
//       output: [
//         {
//           original: 'January 15th, 2024',
//           iso: '2024-01-15',
//           type: 'absolute',
//         },
//         {
//           original: 'next Friday',
//           iso: '2024-01-19', // Assuming today is 2024-01-12
//           type: 'relative',
//         },
//         {
//           original: '2023-12-01',
//           iso: '2023-12-01',
//           type: 'absolute',
//         },
//       ],
//     },
//     {
//       description: 'Handle various date formats',
//       input: 'Event dates: 03/15/24, tomorrow at 3pm, and in 2 weeks',
//       output: [
//         {
//           original: '03/15/24',
//           iso: '2024-03-15',
//           type: 'absolute',
//         },
//         {
//           original: 'tomorrow at 3pm',
//           iso: '2024-01-13T15:00:00',
//           type: 'relative',
//         },
//         {
//           original: 'in 2 weeks',
//           iso: '2024-01-26',
//           type: 'relative',
//         },
//       ],
//     },
//   ],
// })

// export const extractMetrics = testFn({
//   name: 'extractMetrics',
//   description: 'Extract numerical metrics and measurements from text',
//   input: z.string().describe('Text containing numerical measurements and metrics'),
//   output: z
//     .array(
//       z
//         .object({
//           value: z.number().describe('The numerical value of the measurement'),
//           unit: z.string().describe('The unit of measurement (e.g., GB, ms, requests/second)'),
//           metric: z.string().describe('What is being measured (e.g., RAM, response time, request rate)'),
//           context: z.string().describe('Additional context about where/how this metric is used'),
//         })
//         .describe('A metric or measurement found in the text'),
//     )
//     .describe('Array of all metrics and measurements found in the text'),
//   examples: [
//     {
//       input: 'Our new SSD drive provides 2TB storage and reaches speeds of 7000MB/s read and 5000MB/s write.',
//       output: [
//         {
//           value: 2,
//           unit: 'TB',
//           metric: 'storage capacity',
//           context: 'SSD drive capacity',
//         },
//         {
//           value: 7000,
//           unit: 'MB/s',
//           metric: 'read speed',
//           context: 'SSD performance',
//         },
//         {
//           value: 5000,
//           unit: 'MB/s',
//           metric: 'write speed',
//           context: 'SSD performance',
//         },
//       ],
//     },
//     {
//       input: 'The electric car has a range of 300 miles, charges from 20% to 80% in 18 minutes, and has a top speed of 155 mph.',
//       output: [
//         {
//           value: 300,
//           unit: 'miles',
//           metric: 'range',
//           context: 'electric car capability',
//         },
//         {
//           value: 18,
//           unit: 'minutes',
//           metric: 'charging time',
//           context: 'charging speed (20% to 80%)',
//         },
//         {
//           value: 155,
//           unit: 'mph',
//           metric: 'top speed',
//           context: 'maximum vehicle speed',
//         },
//       ],
//     },
//   ],
//   tests: [
//     {
//       input: 'The server has 16GB of RAM and processes 1000 requests per second. Average response time is 250ms.',
//       output: [
//         {
//           value: 16,
//           unit: 'GB',
//           metric: 'RAM',
//           context: 'server memory capacity',
//         },
//         {
//           value: 1000,
//           unit: 'requests/second',
//           metric: 'request rate',
//           context: 'server performance',
//         },
//         {
//           value: 250,
//           unit: 'ms',
//           metric: 'response time',
//           context: 'server latency',
//         },
//       ],
//     },
//     {
//       description: 'Handle various units and conversions',
//       input: 'The file is 2.5MB in size and was downloaded at 150KB/s. Server is running at 75% CPU usage with temperature at 35°C.',
//       output: [
//         {
//           value: 2.5,
//           unit: 'MB',
//           metric: 'file size',
//           context: 'storage',
//         },
//         {
//           value: 150,
//           unit: 'KB/s',
//           metric: 'download speed',
//           context: 'network performance',
//         },
//         {
//           value: 75,
//           unit: '%',
//           metric: 'CPU usage',
//           context: 'server load',
//         },
//         {
//           value: 35,
//           unit: '°C',
//           metric: 'temperature',
//           context: 'server environment',
//         },
//       ],
//     },
//   ],
// })
