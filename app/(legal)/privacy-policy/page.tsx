import ListSection from '../../_components/listSection';
import BoldedSpan from '../../_components/span';
import CustomLink from '../../_components/link';
import {
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
  Contact,
  SummaryOfKeyPoints
} from '../../_lib/constants';
import classNames from 'classnames';
import { Metadata } from 'next';
import { getURL } from '@/utils/helpers';

export const metadata: Metadata = {
  title: 'Terms of Service',
  alternates: {
    canonical: `${getURL()}privacy-policy`
  }
};

export default function PrivacyPolicy() {
  return (
    <div className="relative isolate overflow-hidden px-6 pt-24 sm:pt-32 lg:overflow-visible lg:px-0">
      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-y-16 gap-x-8 lg:mx-0 lg:max-w-none lg:items-start lg:gap-y-10">
        <div className="lg:col-span-1 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-1 lg:gap-x-8 lg:px-8">
          <div className="lg:pr-4">
            <div>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-300 sm:text-4xl">
                Privacy Policy
              </h1>
              <p className="mt-6 text-md leading-6 text-gray-400">
                This privacy notice for BrainWave ("<BoldedSpan>we</BoldedSpan>
                ," "<BoldedSpan>us</BoldedSpan>," or "
                <BoldedSpan>our</BoldedSpan>"), describes how and why we might
                collect, store, use, and/or share ("
                <BoldedSpan>process</BoldedSpan>") your information when you use
                our services ("
                <BoldedSpan>Services</BoldedSpan>"), such as when you:
              </p>
              <ul
                className={classNames(
                  'pl-4 list-disc children:text-md children:mb-2',
                  'children:leading-6 children:text-gray-400 pt-6'
                )}
              >
                <li>
                  Visit our website at{' '}
                  <CustomLink
                    href={'https://jellyfish-app-knx4y.ondigitalocean.app/'}
                  >
                    https://jellyfish-app-knx4y.ondigitalocean.app/
                  </CustomLink>
                  , or any website of ours that links to this privacy notice
                </li>
                <li>
                  Engage with us in other related ways, including any sales,
                  marketing, or events
                </li>
              </ul>
              <p className="mt-6 text-md leading-6 text-gray-400">
                <BoldedSpan>Questions or concerns?</BoldedSpan> Reading this
                privacy notice will help you understand your privacy rights and
                choices. If you do not agree with our policies and practices,
                please do not use our Services. If you still have any questions
                or concerns, please contact us at{' '}
                <CustomLink href={'mailto:brainwaveai.dev@gmail.com'}>
                  brainwaveai.dev@gmail.com
                </CustomLink>
                .
              </p>
            </div>
          </div>
        </div>
        <div className="lg:col-span-1 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-1 lg:gap-x-8 lg:px-8">
          <ListSection info={SummaryOfKeyPoints} />
        </div>
        <div className="lg:col-span-1 lg:col-start-1 lg:row-start-3 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-1 lg:gap-x-8 lg:px-8">
          <ListSection info={SocialLogins} />
        </div>
        <div className="lg:col-span-1 lg:col-start-1 lg:row-start-4 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-1 lg:gap-x-8 lg:px-8">
          <ListSection info={CollectedInformation} />
        </div>
        <div className="lg:col-span-1 lg:col-start-1 lg:row-start-5 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-1 lg:gap-x-8 lg:px-8">
          <ListSection info={InfoUse} />
        </div>
        <div className="lg:col-span-1 lg:col-start-1 lg:row-start-6 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-1 lg:gap-x-8 lg:px-8">
          <ListSection info={LegalBasis} />
        </div>
        <div className="lg:col-span-1 lg:col-start-1 lg:row-start-7 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-1 lg:gap-x-8 lg:px-8">
          <ListSection info={WhoShare} />
        </div>
        <div className="lg:col-span-1 lg:col-start-1 lg:row-start-8 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-1 lg:gap-x-8 lg:px-8">
          <ListSection info={Cookies} />
        </div>
        <div className="lg:col-span-1 lg:col-start-1 lg:row-start-9 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-1 lg:gap-x-8 lg:px-8">
          <ListSection info={SocialLogins} />
        </div>
        <div className="lg:col-span-1 lg:col-start-1 lg:row-start-10 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-1 lg:gap-x-8 lg:px-8">
          <ListSection info={InfoRetain} />
        </div>
        <div className="lg:col-span-1 lg:col-start-1 lg:row-start-11 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-1 lg:gap-x-8 lg:px-8">
          <ListSection info={InfoSafe} />
        </div>
        <div className="lg:col-span-1 lg:col-start-1 lg:row-start-12 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-1 lg:gap-x-8 lg:px-8">
          <ListSection info={PrivacyRights} />
        </div>
        <div className="lg:col-span-1 lg:col-start-1 lg:row-start-13 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-1 lg:gap-x-8 lg:px-8">
          <ListSection info={Control} />
        </div>
        <div className="lg:col-span-1 lg:col-start-1 lg:row-start-14 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-1 lg:gap-x-8 lg:px-8">
          <ListSection info={CAResidents} />
        </div>
        <div className="lg:col-span-1 lg:col-start-1 lg:row-start-15 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-1 lg:gap-x-8 lg:px-8">
          <ListSection info={PolicyUpdates} />
        </div>
        <div className="lg:col-span-1 lg:col-start-1 lg:row-start-16 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-1 lg:gap-x-8 lg:px-8">
          <ListSection info={Contact} />
        </div>
      </div>
    </div>
  );
}
