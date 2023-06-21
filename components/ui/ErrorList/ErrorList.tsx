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
      className={classNames(
        'flex w-full max-w-md bg-white dark:bg-neutral5',
        'rounded-lg shadow border border-gray-100 dark:border-zinc-700 group relative'
      )}
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
        <TriangleIcon
          className={'w-6 h-6 stroke-white dark:stroke-gray-200'}
          strokeWidth={1.5}
        />
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
              'stroke-white rounded-full w-6 h-6 p-0.5 shadow transition duration-150 bg-zinc-700 hover:bg-zinc-500'
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
    errorDispatch: dispatch
  } = useErrorContext();

  return (
    <div
      className={
        'fixed top-[7.5vh] right-10 flex flex-col gap-y-3 justify-start z-30'
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
