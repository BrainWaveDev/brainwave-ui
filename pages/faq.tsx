import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import classNames from 'classnames';
import React, { ReactNode } from 'react';

interface AccordionComponentProps {
    children: ReactNode | string;
    className?: string;
    props?: any;
    forwardedRef?: React.Ref<HTMLButtonElement> | React.Ref<HTMLDivElement>;
}

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionComponentProps>(({ children, className, ...props }, forwardedRef) => (
    <Accordion.Header className="AccordionHeader">
        <Accordion.Trigger
            className="flex justify-between items-center w-full px-4 py-2 text-xl font-medium text-left rounded-lg shadow my-2
             hover:bg-gray-400  "
            {...props}
            ref={forwardedRef}
        >
            {children}
            <ChevronDownIcon className="AccordionChevron" aria-hidden />
        </Accordion.Trigger>
    </Accordion.Header>
));

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionComponentProps>(({ children, className, ...props }, forwardedRef) => (
    <Accordion.Content
        className="mx-4 text-lg font-normal text-left rounded-lg animate-slideUpAndFade"
        {...props}
        ref={forwardedRef}
    >
        <div className="AccordionContentText">{children}</div>
    </Accordion.Content>
));

const FAQs = [
    {
        question: 'What is Brainwave?',
        answer: 'Brainwave is a platform that allows you to connect with other people and share your thoughts and ideas with them. You can also create your own groups and invite people to join them.'
    },
    {
        question: 'How do I create a group?',
        answer: 'To create a group, you need to go to the Groups page and click on the Create Group button. You will then be asked to enter the name of your group and a description for it. After that, you will be able to invite people to join your group.'
    }
]

const FaqPage = () => {
    return (
        <div className="flex justify-center align-middle w-full min-h-[100vh] bg-white text-black">
            <div className="flex flex-col w-full md:w-[53vw] px-3 justify-start align-middle h-full
            ">
                <div className='min-h-[300px] min-w-[300px] flex justify-center align-middle'>
                    <img src="brainwave_logo_name.png" alt="faq" className="object-contain " />
                </div>
                <div className='flex flex-col w-full'>
                    <div className='mb-4'>
                        <h1 className="text-4xl font-bold text-center">FAQ</h1>
                    </div>
                    <div className="flex w-full ">
                        <Accordion.Root type="single" defaultValue="item-1" collapsible className='rounded w-full '>
                            {
                                FAQs.map((faq, index) => {
                                    return item({ itemValue: `item-${index}`, title: faq.question, content: faq.answer })
                                })
                            }
                        </Accordion.Root>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default FaqPage
function item({ itemValue, title, content }: { itemValue: string, title: string, content: string }) {
    return (
        <Accordion.Item value={itemValue} className='overflow-hidden mt-1 '>
            <AccordionTrigger>{title}</AccordionTrigger>
            <AccordionContent>{content}</AccordionContent>
        </Accordion.Item>
    );
}

