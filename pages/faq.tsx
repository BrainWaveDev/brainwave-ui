import classNames from 'classnames';
import React, { memo } from 'react';
import { Disclosure, Transition } from '@headlessui/react';

// TODO: Add real FAQs
const FAQs = [
  {
    question: 'What is Brainwave?',
    answer:
      'Brainwave is a platform that allows you to connect with other people and share your thoughts and ideas with them. You can also create your own groups and invite people to join them.'
  },
  {
    question: 'How do I create a group?',
    answer:
      'To create a group, you need to go to the Groups page and click on the Create Group button. You will then be asked to enter the name of your group and a description for it. After that, you will be able to invite people to join your group.'
  }
];

const FAQ = () => {
  return (
    <div className="px-10 sm:px-20 pb-20 md:pb-10">
      <div className="max-w-[58.5rem] mx-auto">
        <div className="flex flex-col w-full">
          <div className="mb-4">
            <h1 className="text-4xl md:text-5xl font-bold text-left mb-4 md:pr-16">
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
            <div className={'text-neutral7 dark:text-white font-semibold'}>
              {title}
            </div>
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
