import { memo } from 'react';
import classNames from 'classnames';
import { SectionInfo } from '../../_lib/constants';

const ListSection = ({ info }: { info: SectionInfo }) => {
  const { header, items } = info;
  return (
    <div className="lg:pr-4">
      <h2 className="mt-4 text-2xl font-bold tracking-tight text-neutral1">
        {header}
      </h2>
      {Array.isArray(items) ? (
        info.bullets ? (
          <ul
            className={classNames(
              'pl-4 list-disc children:text-md children:mb-2',
              'children:leading-6 children:text-gray-400 pt-3'
            )}
          >
            {items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <>
            {items.map((item, index) => (
              <p
                key={index}
                className={`${
                  index === 0 ? 'mt-3' : 'mt-6'
                } text-md leading-6 text-gray-400`}
              >
                {item}
              </p>
            ))}
          </>
        )
      ) : (
        <p className="mt-3 text-md leading-6 text-gray-400">{items}</p>
      )}
    </div>
  );
};

export default memo(ListSection);
