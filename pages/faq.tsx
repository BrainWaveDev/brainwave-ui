import classNames from 'classnames';
import React, { memo } from 'react';
import { Disclosure, Transition } from '@headlessui/react';
import { NextSeo } from 'next-seo';
import { getURL } from '@/utils/helpers';

const FAQs = [
  {
    question: 'What is BrainWave?',
    answer:
      "BrainWave is a platform that utilizes cutting-edge AI technology known as retrieval augmented generation (RAG) to generate content based on user's knowledge base."
  },
  {
    question: 'Are the files I upload to BrainWave safe?',
    answer:
      'Yes, BrainWave stores your files in a secure cloud storage that is not shared with anyone and relies on secure services provided by OpenAI to generate responses.'
  },
  {
    question: 'What is BrainBot?',
    answer:
      "BrainBot is a chatbot that utilizes BrainWave's AI technology to answer questions based on your knowledge base."
  },
  {
    question: 'How does BrainBot work?',
    answer:
      'BrainBot creates a semantic search index of your uploaded files and uses that to retrieve information from your documents most relevant to the question. It then utilizes OpenAI ChatGPT model to generate a response based on the retrieved information.'
  },
  {
    question: 'Can I ask questions about multiple documents at once?',
    answer:
      'Yes, you can ask questions about multiple documents at once. BrainBot will retrieve information from the selected documents and generate a response based on the retrieved information.'
  },
  {
    question: 'What document formats does BrainWave support?',
    answer:
      'BrainWave can accept and parse TXT, PDF, DOCX and HTML files. We are working on adding support for more file formats.'
  },
  {
    question: 'How does BrainBot read information from my documents?',
    answer:
      'After uploading your files, BrainWave parses file content by reading the textual content of the file and then breaks it down into chunks of text.' +
      'These chunks are then converted into vectors and uploaded to the cloud storage. ' +
      'Once the file is fully parsed, BrainBot is able to retrieve most relevant chunks to generate a response.'
  },
  {
    question: 'Does BrainWave support data sources other than files?',
    answer:
      'Currently, BrainWave only supports files as data sources. We are working on adding support for more data sources like Google Docs, Notion, YouTube, and Web Pages.'
  }
];

const FAQ = () => {
  return (
    <>
      <NextSeo
        title="FAQ"
        description="Answers to most commonly asked questions about BrainBot, how it works, and how to use it."
        canonical={`${getURL()}faq`}
      />
      <div className="px-10 sm:px-20 pb-20 md:pb-10">
        <div className="max-w-[58.5rem] mx-auto">
          <div className="flex flex-col w-full">
            <div className="mb-4">
              <h1
                className={classNames(
                  'text-4xl md:text-5xl font-bold',
                  'text-left mb-4 md:pr-16 text-neutral7 dark:text-neutral1'
                )}
              >
                FAQ
              </h1>
              <h3 className={'text-2xl mb-12 text-neutral4 md:mb-6 font-light'}>
                Answers to most commonly asked questions.
              </h3>
            </div>
            <div className="mx-auto w-full">
              {FAQs.map((faq, index) => (
                <Item key={index} title={faq.question} content={faq.answer} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(FAQ);

const Item = memo(({ title, content }: { title: string; content: string }) => {
  // ==== Styling ====
  const PlusIcon = classNames(
    'relative shrink-0 w-8 h-8 mr-8 before:absolute',
    'before:top-1/2 before:left-1/2 before:w-4 before:h-0.5',
    'before:-translate-x-1/2 before:-translate-y-1/2 before:bg-neutral6 before:rounded-full',
    'after:absolute after:top-1/2 after:left-1/2 after:w-0.5 after:h-4',
    'after:-translate-x-1/2 after:-translate-y-1/2 after:bg-neutral6',
    'after:rounded-full after:transition-transform',
    'md:mr-6 dark:before:bg-neutral3 dark:after:bg-neutral3'
  );

  return (
    <Disclosure
      as={'div'}
      className={'border-t border-neutral3 dark:border-neutral5'}
    >
      {({ open }) => (
        <>
          <Disclosure.Button
            className={classNames(
              'flex w-full py-6 text-lg transition-colors',
              'tap-highlight-color hover:text-teal-300',
              'lg:hover:text-neutral7 dark:lg:hover:text-neutral1'
            )}
          >
            <div className={classNames(PlusIcon, open && 'after:rotate-90')} />
            <p
              className={
                'text-neutral7 dark:text-white font-semibold text-left'
              }
            >
              {title}
            </p>
          </Disclosure.Button>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Disclosure.Panel
              className={'-mt-4 pl-16 pb-6 text-neutral4 md:pl-14'}
            >
              {content}
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
});
