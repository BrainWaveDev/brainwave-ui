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

export { features };
