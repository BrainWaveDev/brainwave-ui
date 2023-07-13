import Link from 'next/link';
import classNames from 'classnames';
import React, { AnchorHTMLAttributes, memo } from 'react';

const CustomLink = (
  props: {
    href: string;
    className?: string;
  } & AnchorHTMLAttributes<HTMLAnchorElement> & {
      children?: React.ReactNode;
    }
) => {
  const LinkStyling = classNames(
    'text-gray-300 font-semibold hover:text-green-400',
    'active:text-green-400 transition-all duration-300'
  );
  const { href, className, children } = props;
  return (
    <Link href={href} className={className ?? LinkStyling}>
      {children}
    </Link>
  );
};

export default memo(CustomLink);
