import {
  CloudArrowUpIcon,
  LightBulbIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import QuestionMark from '@/components/icons/QuestionMark';
import classNames from 'classnames';
import BoldedSpan from '../_components/span';
import CustomLink from '../_components/link';

type Feature = {
  name: string;
  description: string;
  icon: any;
};

export type SectionInfo = {
  id?: string;
  header: string;
  items: string | JSX.Element | (string | JSX.Element)[];
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
    <>
      You acknowledge and agree that all payment transactions are subject to the
      terms and conditions and privacy policy of Stripe. Please refer to
      Stripe's End User Terms of Service{' '}
      <CustomLink href={'https://stripe.com/en-ca/legal/end-users'}>
        here
      </CustomLink>{' '}
      for further details on their terms.
    </>,
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
    <>
      Your use of OpenAI's API services is subject to OpenAI's terms and
      conditions, including but not limited to their{' '}
      <CustomLink href={'https://openai.com/policies/terms-of-use'}>
        API Terms of Use
      </CustomLink>{' '}
      and{' '}
      <CustomLink href={'https://openai.com/policies/privacy-policy'}>
        Privacy Policy
      </CustomLink>
      . You agree to comply with all such terms and conditions when using the
      SaaS tool and interacting with OpenAI's API services.
    </>,
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

// ===== Privacy Policy Information =====
const SummaryOfKeyPoints: SectionInfo = {
  header: 'Summary of Key Points',
  items: [
    <BoldedSpan>
      This summary provides key points from our privacy notice, but you can find
      out more details about any of these topics by clicking the link following
      each key point.
    </BoldedSpan>,
    <>
      <BoldedSpan>What personal information do we process?</BoldedSpan> When you
      visit, use, or navigate our Services, we may process personal information
      depending on how you interact with us and the Services, the choices you
      make, and the products and features you use. Learn more about{' '}
      <CustomLink href={'#personalinfo'}>
        personal information you disclose to us
      </CustomLink>
      .
    </>,
    <>
      Do we process any sensitive personal information? We do not process
      sensitive personal information.
    </>,
    <>
      <BoldedSpan>Do we receive any information from third parties?</BoldedSpan>{' '}
      We do not receive any information from third parties.
    </>,
    <>
      <BoldedSpan>How do we process your information?</BoldedSpan> We process
      your information to provide, improve, and administer our Services,
      communicate with you, for security and fraud prevention, and to comply
      with law. We may also process your information for other purposes with
      your consent. We process your information only when we have a valid legal
      reason to do so. Learn more about{' '}
      <CustomLink href={'#infouse'}>how we process your information</CustomLink>
      .
    </>,
    <>
      <BoldedSpan>
        In what situations and with which parties do we share personal
        information?
      </BoldedSpan>{' '}
      We may share information in specific situations and with specific third
      parties. Learn more about when and with whom we share your personal
      information.
    </>,
    <>
      <BoldedSpan>How do we keep your information safe?</BoldedSpan> We have
      organizational and technical processes and procedures in place to protect
      your personal information. However, no electronic transmission over the
      internet or information storage technology can be guaranteed to be 100%
      secure, so we cannot promise or guarantee that hackers, cybercriminals, or
      other unauthorized third parties will not be able to defeat our security
      and improperly collect, access, steal, or modify your information. Learn
      more about how we keep your information safe.
    </>,
    <>
      <BoldedSpan>What are your rights?</BoldedSpan> Depending on where you are
      located geographically, the applicable privacy law may mean you have
      certain rights regarding your personal information. Learn more about your
      privacy rights.
    </>,
    <>
      <BoldedSpan>How do you exercise your rights?</BoldedSpan> The easiest way
      to exercise your rights is by submitting a data subject access request, or
      by contacting us. We will consider and act upon any request in accordance
      with applicable data protection laws.
    </>
  ]
};

const CollectedInformation: SectionInfo = {
  header: 'WHAT INFORMATION DO WE COLLECT?',
  items: [
    <span className={'italic'}>
      <BoldedSpan>In Short:</BoldedSpan> We collect personal information that
      you provide to us.
    </span>,
    'We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.',
    <div id={'personalinfo'}>
      <BoldedSpan>Personal Information Provided by You.</BoldedSpan> The
      personal information that we collect depends on the context of your
      interactions with us and the Services, the choices you make, and the
      products and features you use. The personal information we collect may
      include the following:
      <ul
        className={classNames(
          'pl-4 list-disc children:text-md children:mb-2',
          'children:leading-6 children:text-gray-400 pt-3'
        )}
      >
        <li>email addresses</li>
        <li>usernames</li>
        <li>passwords</li>
        <li>contact or authentication data</li>
      </ul>
    </div>,
    <>
      <BoldedSpan>Sensitive Information.</BoldedSpan> We do not process
      sensitive information.
    </>,
    <>
      <BoldedSpan>Payment Data.</BoldedSpan> We may collect data necessary to
      process your payment if you make purchases, such as your payment
      instrument number, and the security code associated with your payment
      instrument. All payment data is stored by Stripe. You may find their
      privacy notice link(s){' '}
      <CustomLink href="https://stripe.com/privacy">here</CustomLink>.
    </>,
    <>
      <BoldedSpan>Social Media Login Data.</BoldedSpan> We may provide you with
      the option to register with us using your existing social media account
      details, like your Facebook, Twitter, or other social media account. If
      you choose to register in this way, we will collect the information
      described in the section called "
      <CustomLink href={'#sociallogins'}>
        HOW DO WE HANDLE YOUR SOCIAL LOGINS?
      </CustomLink>
      " below.
    </>,
    <>
      All personal information that you provide to us must be true, complete,
      and accurate, and you must notify us of any changes to such personal
      information.
    </>
  ]
};

const InfoUse: SectionInfo = {
  id: 'infouse',
  header: 'HOW DO WE PROCESS YOUR INFORMATION?',
  items: [
    <span className={'italic'}>
      <BoldedSpan>In Short:</BoldedSpan> We process your information to provide,
      improve, and administer our Services, communicate with you, for security
      and fraud prevention, and to comply with law. We may also process your
      information for other purposes with your consent.
    </span>,
    <div id={'personalinfo'}>
      <BoldedSpan>
        We process your personal information for a variety of reasons, depending
        on how you interact with our Services, including:
      </BoldedSpan>
      <ul
        className={classNames(
          'pl-4 list-disc children:text-md children:mb-2',
          'children:leading-6 children:text-gray-400 pt-3'
        )}
      >
        <li>
          <BoldedSpan>
            To facilitate account creation and authentication and otherwise
            manage user accounts.
          </BoldedSpan>{' '}
          We may process your information so you can create and log in to your
          account, as well as keep your account in working order.
        </li>
        <li>
          <BoldedSpan>
            To save or protect an individual's vital interest.
          </BoldedSpan>{' '}
          We may process your information when necessary to save or protect an
          individual’s vital interest, such as to prevent harm.
        </li>
      </ul>
    </div>
  ]
};

const LegalBasis: SectionInfo = {
  id: 'legalbasis',
  header: 'WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR INFORMATION?',
  items: [
    <span className={'italic'}>
      <BoldedSpan>In Short:</BoldedSpan> We only process your personal
      information when we believe it is necessary and we have a valid legal
      reason (i.e., legal basis) to do so under applicable law, like with your
      consent, to comply with laws, to provide you with services to enter into
      or fulfill our contractual obligations, to protect your rights, or to
      fulfill our legitimate business interests.
    </span>,
    <BoldedSpan className={'text-gray-300 italic underline font-bold'}>
      If you are located in the EU or UK, this section applies to you.
    </BoldedSpan>,
    <>
      <span>
        The General Data Protection Regulation (GDPR) and UK GDPR require us to
        explain the valid legal bases we rely on in order to process your
        personal information. As such, we may rely on the following legal bases
        to process your personal information:
      </span>
      <ul
        className={classNames(
          'pl-4 list-disc children:text-md children:mb-2',
          'children:leading-6 children:text-gray-400 pt-3 pb-4'
        )}
      >
        <li>
          <BoldedSpan>Consent.</BoldedSpan> We may process your information if
          you have given us permission (i.e., consent) to use your personal
          information for a specific purpose. You can withdraw your consent at
          any time. Learn more about{' '}
          <CustomLink href={'#withdrawconsent'}>your consent.</CustomLink>
        </li>
        <li>
          <BoldedSpan>Legal Obligations.</BoldedSpan> We may process your
          information where we believe it is necessary for compliance with our
          legal obligations, such as to cooperate with a law enforcement body or
          regulatory agency, exercise or defend our legal rights, or disclose
          your information as evidence in litigation in which we are involved.
        </li>
        <li>
          <BoldedSpan>Vital interests.</BoldedSpan> We may process your
          information where we believe it is necessary to protect your vital
          interests or the vital interests of a third party, such as situations
          involving potential threats to the safety of any person.
        </li>
      </ul>
    </>,
    <BoldedSpan className={'text-gray-300 italic underline font-bold pt-2'}>
      If you are located in Canada, this section applies to you.
    </BoldedSpan>,
    <span>
      We may process your information if you have given us specific permission
      (i.e., express consent) to use your personal information for a specific
      purpose, or in situations where your permission can be inferred (i.e.,
      implied consent). You can{' '}
      <CustomLink href={'#withdrawconsent'}>withdraw your consent</CustomLink>{' '}
      at any time.
    </span>,
    <>
      <>
        In some exceptional cases, we may be legally permitted under applicable
        law to process your information without your consent, including, for
        example:
      </>
      <ul
        className={classNames(
          'pl-4 list-disc children:text-md children:mb-2',
          'children:leading-6 children:text-gray-400 pt-3'
        )}
      >
        <li>
          If collection is clearly in the interests of an individual and consent
          cannot be obtained in a timely way
        </li>
        <li>For investigations and fraud detection and prevention</li>
        <li>For business transactions provided certain conditions are met</li>
        <li>
          If it is contained in a witness statement and the collection is
          necessary to assess, process, or settle an insurance claim
        </li>
        <li>
          For identifying injured, ill, or deceased persons and communicating
          with next of kin
        </li>
        <li>
          If we have reasonable grounds to believe an individual has been, is,
          or may be victim of financial abuse
        </li>
        <li>
          If it is reasonable to expect collection and use with consent would
          compromise the availability or the accuracy of the information and the
          collection is reasonable for purposes related to investigating a
          breach of an agreement or a contravention of the laws of Canada or a
          province
        </li>
        <li>
          If disclosure is required to comply with a subpoena, warrant, court
          order, or rules of the court relating to the production of records
        </li>
        <li>
          If it was produced by an individual in the course of their employment,
          business, or profession and the collection is consistent with the
          purposes for which the information was produced
        </li>
        <li>
          If the collection is solely for journalistic, artistic, or literary
          purposes
        </li>
        <li>
          If the information is publicly available and is specified by the
          regulations
        </li>
      </ul>
    </>
  ]
};

const WhoShare: SectionInfo = {
  id: 'whoshare',
  header: 'WHO DO WE SHARE YOUR INFORMATION WITH?',
  items: [
    <span className={'italic pb-2'}>
      <BoldedSpan>In Short:</BoldedSpan> We may share information in specific
      situations described in this section and/or with the following third
      parties.
    </span>,
    <>
      <>
        We may need to share your personal information in the following
        situations:
      </>
      <ul
        className={classNames(
          'pl-4 list-disc children:text-md children:mb-2',
          'children:leading-6 children:text-gray-400 pt-3'
        )}
      >
        <li>
          <BoldedSpan>Business Transfers.</BoldedSpan> We may share or transfer
          your information in connection with, or during negotiations of, any
          merger, sale of company assets, financing, or acquisition of all or a
          portion of our business to another company.
        </li>
        <li>
          <BoldedSpan>Affiliates.</BoldedSpan> We may share your information
          with our affiliates, in which case we will require those affiliates to
          honor this privacy notice. Affiliates include our parent company and
          any subsidiaries, joint venture partners, or other companies that we
          control or that are under common control with us.
        </li>
        <li>
          <BoldedSpan>Partners.</BoldedSpan> We may share your information with
          our business partners to offer you certain products, services, or
          promotions.
        </li>
      </ul>
    </>
  ]
};

const Cookies: SectionInfo = {
  id: 'cookies',
  header: 'DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?',
  items: [
    <span className={'italic pb-2'}>
      <BoldedSpan>In Short:</BoldedSpan> We may use cookies and other tracking
      technologies to collect and store your information.
    </span>,
    <>
      We may use cookies and similar tracking technologies (like web beacons and
      pixels) to access or store information. Specific information about how we
      use such technologies and how you can refuse certain cookies is set out in
      our Cookie Notice.
    </>
  ]
};

const SocialLogins: SectionInfo = {
  id: 'sociallogins',
  header: 'HOW DO WE HANDLE YOUR SOCIAL LOGINS?',
  items: [
    <span className={'italic pb-2'}>
      <BoldedSpan>In Short:</BoldedSpan> If you choose to register or log in to
      our Services using a social media account, we may have access to certain
      information about you.
    </span>,
    <>
      We may use cookies and similar tracking technologies (like web beacons and
      pixels) to access or store information. Specific information about how we
      use such technologies and how you can refuse certain cookies is set out in
      our Cookie Notice.
    </>,
    <>
      We may use cookies and similar tracking technologies (like web beacons and
      pixels) to access or store information. Specific information about how we
      use such technologies and how you can refuse certain cookies is set out in
      our Cookie Notice.
    </>
  ]
};

const InfoRetain: SectionInfo = {
  id: 'inforetain',
  header: 'HOW LONG DO WE KEEP YOUR INFORMATION?',
  items: [
    <span className={'italic pb-2'}>
      <BoldedSpan>In Short:</BoldedSpan> We keep your information for as long as
      necessary to fulfill the purposes outlined in this privacy notice unless
      otherwise required by law.
    </span>,
    <>
      We will only keep your personal information for as long as it is necessary
      for the purposes set out in this privacy notice, unless a longer retention
      period is required or permitted by law (such as tax, accounting, or other
      legal requirements). No purpose in this notice will require us keeping
      your personal information for longer than the period of time in which
      users have an account with us.
    </>,
    <>
      When we have no ongoing legitimate business need to process your personal
      information, we will either delete or anonymize such information, or, if
      this is not possible (for example, because your personal information has
      been stored in backup archives), then we will securely store your personal
      information and isolate it from any further processing until deletion is
      possible.
    </>
  ]
};

const InfoSafe: SectionInfo = {
  id: 'infosafe',
  header: 'HOW DO WE KEEP YOUR INFORMATION SAFE?',
  items: [
    <span className={'italic pb-2'}>
      <BoldedSpan>In Short:</BoldedSpan> We aim to protect your personal
      information through a system of organizational and technical security
      measures.
    </span>,
    <>
      We have implemented appropriate and reasonable technical and
      organizational security measures designed to protect the security of any
      personal information we process. However, despite our safeguards and
      efforts to secure your information, no electronic transmission over the
      Internet or information storage technology can be guaranteed to be 100%
      secure, so we cannot promise or guarantee that hackers, cybercriminals, or
      other unauthorized third parties will not be able to defeat our security
      and improperly collect, access, steal, or modify your information.
      Although we will do our best to protect your personal information,
      transmission of personal information to and from our Services is at your
      own risk. You should only access the Services within a secure environment.
    </>
  ]
};

const PrivacyRights: SectionInfo = {
  id: 'privacyrights',
  header: 'WHAT ARE YOUR PRIVACY RIGHTS?',
  items: [
    <span className={'italic pb-2'}>
      <BoldedSpan>In Short:</BoldedSpan> In some regions, such as the European
      Economic Area (EEA), United Kingdom (UK), and Canada, you have rights that
      allow you greater access to and control over your personal information.
      You may review, change, or terminate your account at any time.
    </span>,
    <>
      In some regions (like the EEA, UK, and Canada ), you have certain rights
      under applicable data protection laws. These may include the right (i) to
      request access and obtain a copy of your personal information, (ii) to
      request rectification or erasure; (iii) to restrict the processing of your
      personal information; and (iv) if applicable, to data portability. In
      certain circumstances, you may also have the right to object to the
      processing of your personal information. You can make such a request by
      contacting us by using the contact details provided in the section{' '}
      <CustomLink href="#contact">
        HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
      </CustomLink>{' '}
      below.
    </>,
    <>
      We will consider and act upon any request in accordance with applicable
      data protection laws.
    </>,
    <>
      If you are located in the EEA or UK and you believe we are unlawfully
      processing your personal information, you also have the right to complain
      to your{' '}
      <CustomLink
        href={
          'https://ico.org.uk/make-a-complaint/data-protection-complaints/data-protection-complaints/'
        }
      >
        {' '}
        Member State data protection authority
      </CustomLink>{' '}
      or{' '}
      <CustomLink
        href={
          'https://ico.org.uk/make-a-complaint/data-protection-complaints/data-protection-complaints/'
        }
      >
        UK data protection{' '}
      </CustomLink>
      authority.
    </>,
    <>
      If you are located in Switzerland, you may contact the{' '}
      <CustomLink href={'https://www.edoeb.admin.ch/edoeb/en/home.html'}>
        Federal Data Protection and Information Commissioner
      </CustomLink>{' '}
      .
    </>,
    <>
      <BoldedSpan className={'text-gray-300 underline font-bold'}>
        {' '}
        Withdrawing your consent:
      </BoldedSpan>{' '}
      If we are relying on your consent to process your personal information,
      which may be express and/or implied consent depending on the applicable
      law, you have the right to withdraw your consent at any time. You can
      withdraw your consent at any time by contacting us by using the contact
      details provided in the section "
      <CustomLink href={'#contact'}>
        CAN YOU CONTACT US ABOUT THIS NOTICE?
      </CustomLink>
      " below.
    </>,
    <>
      However, please note that this will not affect the lawfulness of the
      processing before its withdrawal nor, when applicable law allows, will it
      affect the processing of your personal information conducted in reliance
      on lawful processing grounds other than consent.
    </>,
    <>
      Opting out of marketing and promotional communications: You can
      unsubscribe from our marketing and promotional communications at any time
      by clicking on the unsubscribe link in the emails that we send, or by
      contacting us using the details provided in the section "
      <CustomLink href={'#contact'}>
        HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
      </CustomLink>
      " below. You will then be removed from the marketing lists. However, we
      may still communicate with you — for example, to send you service-related
      messages that are necessary for the administration and use of your
      account, to respond to service requests, or for other non-marketing
      purposes.
    </>,
    <BoldedSpan>Account Information</BoldedSpan>,
    <>
      If you would at any time like to review or change the information in your
      account or terminate your account, you can:
      <ul
        className={classNames(
          'pl-4 list-disc children:text-md children:mb-2',
          'children:leading-6 children:text-gray-400 pt-3'
        )}
      >
        <li>Log in to your account settings and update your user account.</li>
      </ul>{' '}
    </>,
    <>
      Upon your request to terminate your account, we will deactivate or delete
      your account and information from our active databases. However, we may
      retain some information in our files to prevent fraud, troubleshoot
      problems, assist with any investigations, enforce our legal terms and/or
      comply with applicable legal requirements.
    </>,
    <>
      <BoldedSpan className={'text-gray-300 underline font-bold'}>
        Cookies and similar technologies:
      </BoldedSpan>{' '}
      Most Web browsers are set to accept cookies by default. If you prefer, you
      can usually choose to set your browser to remove cookies and to reject
      cookies. If you choose to remove cookies or reject cookies, this could
      affect certain features or services of our Services.
    </>,
    <>
      If you have questions or comments about your privacy rights, you may email
      us at{' '}
      <CustomLink href={'mailto:brainwaveai.dev@gmail.com'}>
        brainwaveai.dev@gmail.com
      </CustomLink>
      .
    </>
  ]
};

const Control: SectionInfo = {
  id: 'control',
  header: 'CONTROLS FOR DO-NOT-TRACK FEATURES?',
  items: [
    <>
      Most web browsers and some mobile operating systems and mobile
      applications include a Do-Not-Track ("DNT") feature or setting you can
      activate to signal your privacy preference not to have data about your
      online browsing activities monitored and collected. At this stage no
      uniform technology standard for recognizing and implementing DNT signals
      has been finalized. As such, we do not currently respond to DNT browser
      signals or any other mechanism that automatically communicates your choice
      not to be tracked online. If a standard for online tracking is adopted
      that we must follow in the future, we will inform you about that practice
      in a revised version of this privacy notice.
    </>
  ]
};

const CAResidents: SectionInfo = {
  id: 'caresidents',
  header: 'DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?',
  items: [
    <span className={'italic pb-4'}>
      <BoldedSpan>In Short:</BoldedSpan> Yes, if you are a resident of
      California, you are granted specific rights regarding access to your
      personal information.
    </span>,
    <>
      California Civil Code Section 1798.83, also known as the "Shine The Light"
      law, permits our users who are California residents to request and obtain
      from us, once a year and free of charge, information about categories of
      personal information (if any) we disclosed to third parties for direct
      marketing purposes and the names and addresses of all third parties with
      which we shared personal information in the immediately preceding calendar
      year. If you are a California resident and would like to make such a
      request, please submit your request in writing to us using the contact
      information provided below.
    </>,
    <>
      If you are under 18 years of age, reside in California, and have a
      registered account with Services, you have the right to request removal of
      unwanted data that you publicly post on the Services. To request removal
      of such data, please contact us using the contact information provided
      below and include the email address associated with your account and a
      statement that you reside in California. We will make sure the data is not
      publicly displayed on the Services, but please be aware that the data may
      not be completely or comprehensively removed from all our systems (e.g.,
      backups, etc.).
    </>,
    <div className={'h-2'} />,
    <BoldedSpan className={'text-gray-300 font-bold text-lg'}>
      CCPA Privacy Notice
    </BoldedSpan>,

    <>
      The California Code of Regulations defines a "resident" as:,
      <ul
        className={classNames(
          'pl-4 children:text-md children:mb-2',
          'children:leading-6 children:text-gray-400 pt-3'
        )}
      >
        <li>
          (1) every individual who is in the State of California for other than
          a temporary or transitory purpose and
        </li>
        <li>
          (2) every individual who is domiciled in the State of California who
          is outside the State of California for a temporary or transitory
          purpose
        </li>
      </ul>
    </>,
    <>All other individuals are defined as "non-residents."</>,
    <>
      If this definition of "resident" applies to you, we must adhere to certain
      rights and obligations regarding your personal information.
    </>,
    <BoldedSpan>How do we use and share your personal information?</BoldedSpan>,
    <>
      More information about our data collection and sharing practices can be
      found in this privacy notice.
    </>,
    <>
      You may contact us by email at brainwaveai.dev@gmail.com, or by referring
      to the contact details at the bottom of this document.
    </>,
    <>
      If you are using an authorized agent to exercise your right to opt out we
      may deny a request if the authorized agent does not submit proof that they
      have been validly authorized to act on your behalf.
    </>,
    <BoldedSpan>Will your information be shared with anyone else?</BoldedSpan>,
    <>
      We may disclose your personal information with our service providers
      pursuant to a written contract between us and each service provider. Each
      service provider is a for-profit entity that processes the information on
      our behalf, following the same strict privacy protection obligations
      mandated by the CCPA.
    </>,
    <>
      We may use your personal information for our own business purposes, such
      as for undertaking internal research for technological development and
      demonstration. This is not considered to be "selling" of your personal
      information.
    </>,
    <>
      We have not disclosed, sold, or shared any personal information to third
      parties for a business or commercial purpose in the preceding twelve (12)
      months. We will not sell or share personal information in the future
      belonging to website visitors, users, and other consumers.
    </>,
    <BoldedSpan>Your rights with respect to your personal data</BoldedSpan>,
    <span className={'underline'}>
      Right to request deletion of the data — Request to delete
    </span>,
    <>
      You can ask for the deletion of your personal information. If you ask us
      to delete your personal information, we will respect your request and
      delete your personal information, subject to certain exceptions provided
      by law, such as (but not limited to) the exercise by another consumer of
      his or her right to free speech, our compliance requirements resulting
      from a legal obligation, or any processing that may be required to protect
      against illegal activities.
    </>,
    <span className={'underline'}>Right to be informed — Request to know</span>,
    <>
      Depending on the circumstances, you have a right to know:
      <ul
        className={classNames(
          'pl-4 list-disc children:text-md children:mb-2',
          'children:leading-6 children:text-gray-400 pt-3'
        )}
      >
        <li>whether we collect and use your personal information;</li>
        <li>the categories of personal information that we collect;</li>
        <li>
          the purposes for which the collected personal information is used;
        </li>
        <li>whether we sell or share personal information to third parties;</li>
        <li>
          the categories of personal information that we sold, shared, or
          disclosed for a business purpose;
        </li>
        <li>
          the categories of third parties to whom the personal information was
          sold, shared, or disclosed for a business purpose;
        </li>
        <li>
          the business or commercial purpose for collecting, selling, or sharing
          personal information; and
        </li>
        <li>
          the specific pieces of personal information we collected about you.
        </li>
      </ul>
    </>,
    <>
      In accordance with applicable law, we are not obligated to provide or
      delete consumer information that is de-identified in response to a
      consumer request or to re-identify individual data to verify a consumer
      request.
    </>,
    <span className={'underline'}>
      Right to Non-Discrimination for the Exercise of a Consumer’s Privacy
      Rights
    </span>,
    <>
      We will not discriminate against you if you exercise your privacy rights.
    </>,
    <span className={'underline'}>
      Right to Limit Use and Disclosure of Sensitive Personal Information
    </span>,
    <>We do not process consumer's sensitive personal information.</>,
    <span className={'underline'}>Verification process</span>,
    <>
      Upon receiving your request, we will need to verify your identity to
      determine you are the same person about whom we have the information in
      our system. These verification efforts require us to ask you to provide
      information so that we can match it with information you have previously
      provided us. For instance, depending on the type of request you submit, we
      may ask you to provide certain information so that we can match the
      information you provide with the information we already have on file, or
      we may contact you through a communication method (e.g., phone or email)
      that you have previously provided to us. We may also use other
      verification methods as the circumstances dictate.
    </>,
    <>
      We will only use personal information provided in your request to verify
      your identity or authority to make the request. To the extent possible, we
      will avoid requesting additional information from you for the purposes of
      verification. However, if we cannot verify your identity from the
      information already maintained by us, we may request that you provide
      additional information for the purposes of verifying your identity and for
      security or fraud-prevention purposes. We will delete such additionally
      provided information as soon as we finish verifying you.
    </>,
    <>
      <span className={'underline'}>Other privacy rights:</span>
      <ul
        className={classNames(
          'pl-4 list-disc children:text-md children:mb-2',
          'children:leading-6 children:text-gray-400 pt-3'
        )}
      >
        <li>You may object to the processing of your personal information.</li>
        <li>
          You may request correction of your personal data if it is incorrect or
          no longer relevant, or ask to restrict the processing of the
          information.
        </li>
        <li>
          You can designate an authorized agent to make a request under the CCPA
          on your behalf. We may deny a request from an authorized agent that
          does not submit proof that they have been validly authorized to act on
          your behalf in accordance with the CCPA.
        </li>
        <li>
          You may request to opt out from future selling or sharing of your
          personal information to third parties. Upon receiving an opt-out
          request, we will act upon the request as soon as feasibly possible,
          but no later than fifteen (15) days from the date of the request
          submission.
        </li>
      </ul>
    </>,
    <>
      To exercise these rights, you can contact us by email at{' '}
      <CustomLink href={'mailto:brainwaveai.dev@gmail.com'}>
        brainwaveai.dev@gmail.com
      </CustomLink>
      , or by referring to the contact details at the bottom of this document.
      If you have a complaint about how we handle your data, we would like to
      hear from you.
    </>
  ]
};

const PolicyUpdates: SectionInfo = {
  id: 'policyupdates',
  header: 'DO WE MAKE UPDATES TO THIS NOTICE?',
  items: [
    <span className={'italic pb-4'}>
      <BoldedSpan>In Short:</BoldedSpan> Yes, we will update this notice as
      necessary to stay compliant with relevant laws.
    </span>,
    <>
      We may update this privacy notice from time to time. The updated version
      will be indicated by an updated "Revised" date and the updated version
      will be effective as soon as it is accessible. If we make material changes
      to this privacy notice, we may notify you either by prominently posting a
      notice of such changes or by directly sending you a notification. We
      encourage you to review this privacy notice frequently to be informed of
      how we are protecting your information.
    </>
  ]
};

const Contact: SectionInfo = {
  id: 'contact',
  header: 'HOW CAN YOU CONTACT US ABOUT THIS NOTICE?',
  items: [
    <>
      If you have questions or comments about this notice, you may email us at{' '}
      <CustomLink href={'mailto:brainwaveai.dev@gmail.com'}>
        brainwaveai.dev@gmail.com
      </CustomLink>
      .
    </>
  ]
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
  DisclaimerOfWarranties,
  SummaryOfKeyPoints,
  CollectedInformation,
  InfoUse,
  LegalBasis,
  WhoShare,
  Cookies,
  SocialLogins,
  InfoRetain,
  InfoSafe,
  PrivacyRights,
  Control,
  CAResidents,
  PolicyUpdates,
  Contact
};
