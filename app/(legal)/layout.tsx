import React from 'react';
import { Metadata } from 'next';
import { getURL } from '@/utils/helpers';

const url = getURL();

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true
  }
};

export default function LegalLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="gs tv arf asl auj cfv cut ddc">{children}</div>
    </>
  );
}
