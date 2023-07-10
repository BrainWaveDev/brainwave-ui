import {
  CloudArrowUpIcon,
  LightBulbIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import QuestionMark from '@/components/icons/QuestionMark';

type Feature = {
  name: string;
  description: string;
  icon: any;
};

export type SectionInfo = {
  header: string;
  items: string | string[];
  bullets?: boolean | false;
};

const features: Feature[] = [
  {
    name: 'Document upload and processing',
    description:
      'Seamlessly upload your documents of various formats, from PDFs to Word documents, and let our app intelligently process them for efficient knowledge extraction.',
    icon: CloudArrowUpIcon
  },
  {
    name: 'Intelligent questioning',
    description:
      'Interact with our AI-powered chatbot, fueled by ChatGPT, to ask complex questions about your documents and receive insightful answers in real-time.',
    icon: QuestionMark
  },
  {
    name: 'Analysis and content creation',
    description:
      'Leverage the power of our AI-driven app to perform comprehensive document analysis, extract key insights, generate summaries, create references, and even craft new content.',
    icon: LightBulbIcon
  },
  {
    name: 'Advanced search and filtering',
    description:
      'Easily locate specific information within your documents using our robust search and filtering capabilities, enabling you to navigate and retrieve relevant content effortlessly.',
    icon: MagnifyingGlassIcon
  }
];

// ===== Terms of Service information =====
const ServiceAvailabilityAndQuality: SectionInfo = {
  header: 'Service Availability and Quality',
  items: [
    "We are constantly evolving the Services to make them better for you. The Services are subject to modification and change, including but not limited to the maximum document storage, number of questions that can be asked and other features available to the Customer. No guarantees are made with respect to the Services' quality, stability, uptime, or reliability. Please do not create any dependencies on any attributes of the Services or the generated content. We will not be liable to you or your downstream customers for any harm caused by your dependency on the Service.",
    'The Services and the generated content are provided to Customer on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied, including, without limitation, any warranties or conditions of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A PARTICULAR PURPOSE. You are solely responsible for determining the appropriateness of using or redistributing the generated content and assume any risks associated with use of the Services.',
    'BrainWave reserves the right to suspend or ban your access to the Services at any time, and for any reason. You may not use the Services for competitive research. You may not reverse engineer the Services or the generated content. You may not use automated tools to access, interact with, or generate content through the Services. Only one user may use the Services per registered account. Each user of the Services may only have one account. We reserve the right to investigate complaints or reported violations of our Terms of Service and to take any action we deem appropriate including but not limited to reporting any suspected unlawful activity to law enforcement officials, regulators, or other third parties and disclosing any information necessary or appropriate to such persons or entities relating to user profiles, e-mail addresses, usage history, posted materials, IP addresses, and traffic information.'
  ],
  bullets: false
};
const AgeRequirements: SectionInfo = {
  header: 'Age Requirements',
  items: [
    'By accessing or using the SaaS tool provided by BrainWave, you represent and warrant that you are at least 13 years old.',
    'If you are under the age of 13, you must not access or use the SaaS tool without the consent and supervision of a parent or legal guardian.',
    'The SaaS tool is not intended for use by individuals under the age of 13 without parental or legal guardian consent. If you are a parent or legal guardian and you provide your consent for your child or ward to use the SaaS tool, you agree to be bound by this Agreement on behalf of your child or ward.',
    'Company reserves the right to request verification of your age at any time to ensure compliance with this requirement. If you fail to provide satisfactory evidence of your age or if Company determines that you do not meet the age requirement, your access to the SaaS tool may be suspended or terminated.',
    'If you are a parent or legal guardian and become aware that your child or ward has accessed or used the SaaS tool without your consent, please contact us immediately at brainwaveai.dev@gmail.com. We will take appropriate steps to address the situation and delete any personal information provided by the child or ward, as required by applicable law.'
  ],
  bullets: true
};

const AccountRegistration: SectionInfo = {
  header: 'Account Registration',
  items: [
    'In order to access and use the SaaS tool provided by BrainWave, you must register an account.',
    'By registering an account, you agree to provide accurate, current, and complete information as prompted by the registration form.',
    'You are solely responsible for maintaining the confidentiality of your account credentials, including your username and password, and for all activities that occur under your account.',
    'You agree to notify Company immediately of any unauthorized use of your account or any other breach of security.',
    'Company reserves the right to suspend or terminate your account if any information provided during the registration process is inaccurate, misleading, or incomplete, or if you violate any provision of this Agreement.',
    "You may not use another person's account without their permission or create multiple accounts for the purpose of abusing or circumventing any restrictions or limitations.",
    'By registering an account, you acknowledge and agree that Company may collect, store, and use certain personal information in accordance with its Privacy Policy.',
    "You are responsible for ensuring that the information in your account profile is kept up to date and accurate. You may update your account information by accessing your account settings or by contacting Company's support team.",
    'Company reserves the right to refuse or reject account registration at its sole discretion, without the need to provide any justification or explanation.',
    'Upon termination of your account, whether by you or by Company, you may no longer have access to certain features or content that were available to you through the SaaS tool. Company shall not be liable for any loss or damage arising from the termination of your account.'
  ],
  bullets: true
};

const IntellectualProperty: SectionInfo = {
  header: 'Intellectual Property',
  items: [
    'All intellectual property rights in and to the SaaS tool provided by BrainWave, including but not limited to copyrights, trademarks, patents, trade secrets, and any other proprietary rights, belong to Company or its licensors.',
    'The SaaS tool and its contents, features, and functionality, including but not limited to text, graphics, logos, button icons, images, audio clips, data compilations, and software, are protected by intellectual property laws and treaties.',
    'You acknowledge and agree that the SaaS tool and any related materials contain proprietary information and materials that are owned by Company or its licensors and are protected by applicable intellectual property laws.',
    'Subject to your compliance with this Agreement, Company grants you a limited, non-exclusive, non-transferable, revocable license to access and use the SaaS tool for its intended purpose during the term of this Agreement.',
    'You shall not copy, modify, distribute, sell, lease, reverse engineer, or create derivative works based on the SaaS tool or any part thereof, unless expressly authorized by Company in writing.',
    'All trademarks, service marks, logos, and trade names displayed on the SaaS tool are proprietary to Company or their respective owners. You shall not use any of these marks without the prior written permission of Company or the respective owner.',
    'You shall not remove, alter, or obscure any copyright notice, trademark, or other proprietary rights notices incorporated in or accompanying the SaaS tool.',
    'If you provide any feedback, suggestions, or ideas regarding the SaaS tool to Company, you hereby grant Company a non-exclusive, royalty-free, perpetual, irrevocable, and fully sublicensable right to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display such feedback, suggestions, or ideas worldwide in any media.',
    'Company respects the intellectual property rights of others and expects you to do the same. If you believe that any content available on the SaaS tool infringes your intellectual property rights, please promptly notify Company in writing.',
    'Any unauthorized use of the SaaS tool or its content may violate intellectual property laws, privacy laws, and other regulations. You may be subject to civil and criminal penalties for such unauthorized use.'
  ],
  bullets: true
};

const PaymentAndBilling: SectionInfo = {
  header: 'Payment and Billing',
  items: [
    'If you choose to subscribe to any paid features or services offered by BrainWave, you agree to pay all applicable fees as described on our website or in the payment process.',
    'Company utilizes the third-party payment processing service Stripe to handle payment transactions. By providing your payment information, you authorize Company to share that information with Stripe for the purpose of processing payments.',
    "You acknowledge and agree that all payment transactions are subject to the terms and conditions and privacy policy of Stripe. Please refer to Stripe's End User Terms of Service here for further details on their terms.",
    'You are responsible for providing accurate and up-to-date billing and payment information. Failure to do so may result in the suspension or termination of your access to paid features or services.',
    "All fees are non-refundable unless otherwise stated. If you have any billing-related questions or disputes, please contact Company's support team for assistance."
  ],
  bullets: true
};

const UserContent: SectionInfo = {
  header: 'User Content',
  items: [
    'The SaaS tool provided by BrainWave allows you to securely upload, store, and manage your documents, files, and data ("User Content").',
    'Company takes the security and privacy of your User Content seriously. We employ industry-standard measures to protect the confidentiality and integrity of your documents.',
    'You retain all ownership rights to your User Content. Company will not share, sell, or disclose your User Content to any third parties, except as outlined in our Privacy Policy.',
    'Company will only access, use, or disclose your User Content as necessary to provide and improve the SaaS tool, respond to your support requests, or as required by applicable laws or legal obligations.',
    'You acknowledge and agree that certain authorized personnel, including employees and contractors of Company, may have access to your User Content on a need-to-know basis for the sole purpose of providing and maintaining the SaaS tool.',
    'Please review our Privacy Policy here for more information on how we handle your User Content, including details on data retention, security practices, and your rights as a user.',
    'You represent and warrant that you have the necessary rights, permissions, and licenses to upload and use your User Content on the SaaS tool and that its use does not infringe or violate any third-party rights, including intellectual property rights, privacy rights, or any other applicable laws or regulations.',
    'Company encourages you to use strong and unique passwords to further protect the security of your account and User Content. You are solely responsible for maintaining the confidentiality of your account credentials.'
  ],
  bullets: true
};

const ThirdPartyAPIs: SectionInfo = {
  header: 'Third-Party APIs',
  items: [
    'The SaaS tool provided by BrainWave may utilize third-party APIs ("Application Programming Interfaces") to enhance its functionality or provide additional features.',
    "As part of the SaaS tool's capabilities, it may integrate with the API services provided by OpenAI, a third-party provider of AI language models.",
    "Your use of OpenAI's API services is subject to OpenAI's terms and conditions, including but not limited to their API Terms of Use and Privacy Policy. You agree to comply with all such terms and conditions when using the SaaS tool and interacting with OpenAI's API services.",
    "Company does not control or endorse OpenAI's API services and shall not be liable for any actions, omissions, or damages arising from your use of OpenAI's services. Any issues or disputes regarding OpenAI's API services should be directed to OpenAI as the provider.",
    "You acknowledge and agree that OpenAI's API services are utilized for generating outputs based on your User Content, and the accuracy, reliability, or appropriateness of the generated output is dependent on the capabilities and limitations of OpenAI's technology.",
    "Company does not make any warranties or representations regarding the accuracy, reliability, or suitability of the output generated by OpenAI's API services. Any reliance on such output is at your own discretion and risk.",
    "You understand and acknowledge that the use of OpenAI's API services is subject to OpenAI's terms and policies, and any violation of those terms may result in the suspension or termination of your access to the SaaS tool."
  ],
  bullets: true
};

const UseOfSaaSTool: SectionInfo = {
  header: 'Use of the SaaS Tool',
  items: [
    'You agree to use the SaaS tool provided by BrainWave in compliance with all applicable laws, regulations, and this Agreement.',
    'You shall not use the SaaS tool for any unlawful, harmful, defamatory, infringing, or otherwise objectionable purposes. You also agree not to engage in any activity that could disrupt or interfere with the proper functioning of the SaaS tool or its associated systems.',
    'Company reserves the right to suspend or terminate your access to the SaaS tool if it determines, in its sole discretion, that you have violated this Agreement or engaged in any unauthorized or inappropriate use.'
  ],
  bullets: true
};

const Indemnification: SectionInfo = {
  header: 'Indemnification',
  items:
    "You agree to indemnify, defend, and hold harmless BrainWave and its officers, directors, employees, and agents from and against any and all claims, liabilities, damages, losses, costs, or expenses, including reasonable attorneys' fees, arising out of or in connection with your use of the SaaS tool, your User Content, or any violation of this Agreement.",
  bullets: false
};

const ModificationsOfTheTerms: SectionInfo = {
  header: 'Modifications of the Terms',
  items: [
    'You agree to use the SaaS tool provided by BrainWave in compliance with all applicable laws, regulations, and this Agreement.',
    'You shall not use the SaaS tool for any unlawful, harmful, defamatory, infringing, or otherwise objectionable purposes. You also agree not to engage in any activity that could disrupt or interfere with the proper functioning of the SaaS tool or its associated systems.',
    'Company reserves the right to suspend or terminate your access to the SaaS tool if it determines, in its sole discretion, that you have violated this Agreement or engaged in any unauthorized or inappropriate use.'
  ],
  bullets: true
};

const Termination: SectionInfo = {
  header: 'Termination',
  items: [
    'You may terminate this Agreement by ceasing to use the SaaS tool and deleting your account, if applicable.',
    'BrainWave reserves the right to suspend or terminate your access to the SaaS tool at any time, with or without cause, and without prior notice. In the event of termination, all licenses and rights granted to you under this Agreement will immediately cease.'
  ],
  bullets: true
};

const GoverningLawAndDisputeResolution: SectionInfo = {
  header: 'Governing Law and Dispute Resolution',
  items: [
    'This Agreement shall be governed by and construed in accordance with the laws of Canada, without regard to its conflict of laws principles.',
    'Any dispute, claim, or controversy arising out of or relating to this Agreement or your use of the SaaS tool shall be subject to the exclusive jurisdiction of the courts located in Canada.'
  ],
  bullets: true
};

const DisclaimerOfWarranties: SectionInfo = {
  header: 'Disclaimer of Warranties',
  items: [
    'The SaaS tool provided by BrainWave is provided on an "as is" and "as available" basis. Company makes no warranties, whether express, implied, statutory, or otherwise, regarding the SaaS tool or any content or services provided through it.',
    'Company disclaims all warranties, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, non-infringement, and title.',
    'Company does not warrant that the SaaS tool will be error-free, secure, or uninterrupted, or that any defects or errors will be corrected. You agree that your use of the SaaS tool is at your sole risk.',
    'Any content or advice obtained through the SaaS tool should not be considered as professional, legal, or financial advice. You are solely responsible for evaluating and using the information provided by the SaaS tool.'
  ],
  bullets: true
};

export {
  features,
  ServiceAvailabilityAndQuality,
  AgeRequirements,
  AccountRegistration,
  IntellectualProperty,
  PaymentAndBilling,
  UserContent,
  ThirdPartyAPIs,
  UseOfSaaSTool,
  Indemnification,
  ModificationsOfTheTerms,
  Termination,
  GoverningLawAndDisputeResolution,
  DisclaimerOfWarranties
};
