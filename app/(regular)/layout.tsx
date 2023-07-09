import React from 'react';

export default function RegularLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div
        className="absolute ct dl dy xd bdu btb cqr crh dgs"
        aria-hidden="true"
      >
        <div
          className="mb sx ami amm anl bau"
          style={{
            clipPath:
              'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%);'
          }}
        />
      </div>
      <div className="gs tv arf asl auj cfv cut ddc">{children}</div>
    </>
  );
}
