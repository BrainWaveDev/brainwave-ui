import TriangleIcon from '@/components/icons/TraingleIcon';
import { useErrorContext } from '../../../context/ErrorContext';
import XMarkIcon from '@/components/icons/XMarkIcon';
import classNames from 'classnames';
// @ts-ignore
import { AnimatePresence, motion } from 'framer-motion';

const Error = ({
  message,
  onRemove
}: {
  message: string | JSX.Element;
  onRemove: () => void;
}) => {
  return (
    <motion.div
      className="flex w-full max-w-md bg-white rounded-lg shadow-md group relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.2 } }}
      exit={{
        x: '100%',
        opacity: 0,
        transition: {
          duration: 0.35
        }
      }}
    >
      <div className="flex items-center justify-center w-12 bg-red-500 rounded-l-lg">
        <TriangleIcon className={'w-6 h-6 stroke-white'} strokeWidth={1.5} />
      </div>

      <div className="px-4 py-2 -mx-3">
        <div className="mx-3">
          <span className="font-semibold text-red-500 dark:text-red-400">
            Error
          </span>
          <p className="text-sm text-gray-600 dark:text-gray-200">{message}</p>
        </div>
      </div>
      <div>
        <button
          className={classNames(
            'opacity-0 group-hover:opacity-100 transition border-none duration-150 outline-0 ring-0 focus:ring-0 active:ring-0',
            'absolute -top-1.5 -right-1.5'
          )}
          aria-label="Clear error message"
          onClick={onRemove}
        >
          <XMarkIcon
            strokeWidth={1}
            className={
              'stroke-white rounded-full w-6 h-6 p-0.5 shadow transition duration-150 bg-zinc-300 hover:bg-zinc-400'
            }
          />
        </button>
      </div>
    </motion.div>
  );
};

export default function ErrorList() {
  const {
    errorState: { errors },
    dispatch
  } = useErrorContext();

  return (
    <div
      className={
        'fixed top-[7.5vh] right-10 flex flex-col gap-y-3 justify-start'
      }
    >
      <AnimatePresence>
        {errors.map((error) => (
          <Error
            message={error.message}
            key={error.id}
            onRemove={() => {
              dispatch({
                type: 'removeError',
                id: error.id
              });
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
