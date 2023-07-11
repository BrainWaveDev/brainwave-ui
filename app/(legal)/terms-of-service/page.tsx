import ListSection from './listSection';
import {
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
} from '../../_lib/constants';

export default function Page() {
  return (
    <div className="relative isolate overflow-hidden px-6 pt-24 sm:pt-32 lg:overflow-visible lg:px-0">
      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-y-16 gap-x-8 lg:mx-0 lg:max-w-none lg:items-start lg:gap-y-10">
        <div className="lg:col-span-1 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-1 lg:gap-x-8 lg:px-8">
          <div className="lg:pr-4">
            <div>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-neutral1 sm:text-4xl">
                Terms of Service
              </h1>
              <p className="mt-6 text-md leading-6 text-gray-400">
                Thank you for using BrainWave’s content generative tool BrainBot
                (the "Services"). These Terms of Service (the "Agreement")
                outline what rights you have with respect to the Services, your
                use of the Services, and other important topics like dispute
                resolution. Please read it carefully. We have a privacy policy
                which outlines how we handle your data. This Agreement is
                entered into by BrainWave and the entity or person agreeing to
                these terms ("Customer") and governs Customer's access to and
                use of the Services.
              </p>
              <p className="mt-6 text-md leading-6 text-gray-400">
                This Agreement is effective when the Customer is presented with
                this Agreement and proceeds to use the Services (the "Effective
                Date") or to receive or distribute generated content. These
                terms may be updated and presented again to the Customer from
                time to time. Continued use of the Services constitutes
                acceptance of the updated terms. If you do not agree to the
                Agreement, please stop using the Services.
              </p>
            </div>
          </div>
        </div>
        <div className="lg:col-span-1 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-1 lg:gap-x-8 lg:px-8">
          <ListSection info={ServiceAvailabilityAndQuality} />
        </div>
        <div className="lg:col-span-1 lg:col-start-1 lg:row-start-3 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-1 lg:gap-x-8 lg:px-8">
          <ListSection info={AgeRequirements} />
        </div>
        <div className="lg:col-span-1 lg:col-start-1 lg:row-start-4 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-1 lg:gap-x-8 lg:px-8">
          <ListSection info={AccountRegistration} />
        </div>
        <div className="lg:col-span-1 lg:col-start-1 lg:row-start-5 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-1 lg:gap-x-8 lg:px-8">
          <ListSection info={IntellectualProperty} />
        </div>
        <div className="lg:col-span-1 lg:col-start-1 lg:row-start-6 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-1 lg:gap-x-8 lg:px-8">
          <ListSection info={PaymentAndBilling} />
        </div>
        <div className="lg:col-span-1 lg:col-start-1 lg:row-start-7 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-1 lg:gap-x-8 lg:px-8">
          <ListSection info={ThirdPartyAPIs} />
        </div>
        <div className="lg:col-span-1 lg:col-start-1 lg:row-start-8 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-1 lg:gap-x-8 lg:px-8">
          <ListSection info={UserContent} />
        </div>
        <div className="lg:col-span-1 lg:col-start-1 lg:row-start-9 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-1 lg:gap-x-8 lg:px-8">
          <ListSection info={UseOfSaaSTool} />
        </div>
        <div className="lg:col-span-1 lg:col-start-1 lg:row-start-10 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-1 lg:gap-x-8 lg:px-8">
          <ListSection info={Indemnification} />
        </div>
        <div className="lg:col-span-1 lg:col-start-1 lg:row-start-11 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-1 lg:gap-x-8 lg:px-8">
          <ListSection info={ModificationsOfTheTerms} />
        </div>
        <div className="lg:col-span-1 lg:col-start-1 lg:row-start-12 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-1 lg:gap-x-8 lg:px-8">
          <ListSection info={Termination} />
        </div>
        <div className="lg:col-span-1 lg:col-start-1 lg:row-start-13 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-1 lg:gap-x-8 lg:px-8">
          <ListSection info={GoverningLawAndDisputeResolution} />
        </div>
        <div className="lg:col-span-1 lg:col-start-1 lg:row-start-14 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-1 lg:gap-x-8 lg:px-8">
          <ListSection info={DisclaimerOfWarranties} />
        </div>
      </div>
    </div>
  );
}
