import React, { memo } from 'react';
import { features } from '../_lib/constants';

const Features = memo(() => (
  <div className="pt-32 pb-16 md:pt-48 lg:pt-56">
    <div className="pt-4 mx-auto max-w-7xl px-6 lg:px-8" id={'features'}>
      <div className="mx-auto max-w-4xl lg:text-center">
        <h2 className="text-base sm:text-lg font-semibold sm:leading-7 text-green-400">
          Get answers to your questions. Instantly.
        </h2>
        <p className="mt-3 text-3xl font-bold tracking-tight text-neutral1 sm:text-5xl">
          Power AI with your own knowledge base
        </p>
        <p className="mt-6 text-lg sm:leading-8 text-gray-400">
          Rapidly build a knowledge base from your documents and let{' '}
          <span className={'font-bold text-main-gradient'}>BrainBot</span>{' '}
          manage it for you.
        </p>
      </div>
      <div className="mx-auto mt-14 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
          {features.map((feature) => (
            <div key={feature.name} className="relative pt-14 xs:pt-0 xs:pl-16">
              <dt className="text-base font-semibold leading-7 text-neutral1">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-green-500">
                  <feature.icon
                    className="h-6 w-6 text-white"
                    aria-hidden="true"
                  />
                </div>
                {feature.name}
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-400">
                {feature.description}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  </div>
));

export default Features;
