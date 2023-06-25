import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { RotatingLines } from 'react-loader-spinner';
import { UploadState } from '../../../lib/classes';
import CheckMark from '@/components/icons/CheckMark';
import XMarkIcon from '@/components/icons/XMarkIcon';
import { DocumentTextIcon } from '@heroicons/react/24/solid';

interface Props {
  name: string;
  size: number;
  uploadState: UploadState;
  index: number;
  onFileDelete: (index: number) => void;
}

// Source: https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export default function FilePreview({
  name,
  size,
  uploadState,
  index,
  onFileDelete
}: Props) {
  return (
    <motion.div
      key={name}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className={classNames(
        'relative flex items-center border h-[3.25rem]',
        'min-h-[3.25rem] max-h-[3.25rem] shadow-sm justify-left',
        'bg-white dark:bg-zinc-700 border-gray-200 dark:border-zinc-600',
        'rounded-lg px-0 py-1 group border-white hover:border-teal-200',
        'active:border-teal-200 w-[95%] sm:w-full xs:max-w-sm place-self-center',
        uploadState !== UploadState.NotUploading
          ? 'place-content-center'
          : 'place-content-between'
      )}
    >
      <AnimatePresence>
        {uploadState === UploadState.Uploading && (
          <motion.div
            className={'py-1'}
            initial={{ opacity: 0, display: 'none' }}
            animate={{ opacity: 1, display: 'block' }}
            exit={{ opacity: 0, display: 'none' }}
            transition={{ duration: 0.1 }}
            key={'UploadingIcon'}
          >
            <RotatingLines
              strokeColor="#9ca3af"
              strokeWidth="2"
              animationDuration="1"
              width="2rem"
              visible={true}
            />
          </motion.div>
        )}
        {uploadState === UploadState.UploadComplete && (
          <motion.div
            initial={{ opacity: 0, display: 'none' }}
            animate={{ opacity: 1, display: 'block' }}
            exit={{ opacity: 0, display: 'none' }}
            transition={{ duration: 0.1 }}
            key={'SuccessIcon'}
          >
            <CheckMark
              className={'h-8 w-8 my-1 stroke-green-400'}
              strokeWidth={1}
            />
          </motion.div>
        )}
        {uploadState === UploadState.UploadFailed && (
          <motion.div
            initial={{ opacity: 0, display: 'none' }}
            animate={{ opacity: 1, display: 'block' }}
            exit={{ opacity: 0, display: 'none' }}
            key={'FailedIcon'}
          >
            <XMarkIcon
              className={classNames('h-8 w-8 my-1 stroke-red-500')}
              strokeWidth={1}
            />
          </motion.div>
        )}
        {uploadState === UploadState.NotUploading && (
          <motion.div
            initial={{ opacity: 0, display: 'none' }}
            animate={{ opacity: 1, display: 'flex' }}
            exit={{ opacity: 0, display: 'none' }}
            transition={{ duration: 0.1 }}
            key={'FileInfo'}
            className={
              'min-w-full max-w-full h-full flex flex-row items-center place-content-between'
            }
          >
            <div className={'flex flex-row items-center w-[80%] mx-2'}>
              <div className="flex items-center w-8 h-8 text-teal-400 dark:text-teal-500 rounded-full max-w-[15%]">
                <DocumentTextIcon strokeWidth="1.5" className="w-5 h-5" />
              </div>
              <div className={'w-[85%] max-w-[85%]'}>
                <h2
                  className={classNames(
                    'font-normal text-sm mb-0.5 ',
                    'text-gray-800 dark:text-gray-100',
                    'max-w-full overflow-hidden overflow-ellipsis whitespace-nowrap'
                  )}
                >
                  {name}
                </h2>
                <p className="text-xs font-normal text-gray-500 dark:text-gray-400 max-w-full mr-0">
                  {formatBytes(size)}
                </p>
              </div>
            </div>
            <button
              className={classNames(
                'opacity-100 sm:opacity-0 sm:group-hover:opacity-100 touch:!opacity-100 transition border-none',
                'duration-150 outline-0 ring-0 focus:ring-0 active:ring-0',
                'absolute z-10 -right-2.5 -top-2.5 rounded-full',
                'bg-gray-200 dark:bg-zinc-500 sm:static dark:bg-transparent sm:bg-transparent',
                'sm:mr-1.5'
              )}
              onClick={() => onFileDelete(index)}
            >
              <XMarkIcon
                className={classNames(
                  'rounded-full hover:bg-gray-50 active:bg-gray-50',
                  'dark:hover:bg-zinc-600 dark:active:bg-zinc-600',
                  'transition duration-150 w-6 h-6',
                  'p-1 stroke-gray-400 dark:stroke-gray-200 my-auto m-0 hover:stroke-teal-400 hover:dark:stroke-teal-400'
                )}
                strokeWidth={1}
              />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
