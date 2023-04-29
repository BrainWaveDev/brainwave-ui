import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { RotatingLines } from 'react-loader-spinner';
import { UploadState } from '../../../lib/classes';
import CheckMark from '@/components/icons/CheckMark';
import XMarkIcon from '@/components/icons/XMarkIcon';

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className={classNames(
        'flex items-center border transition duration-150 h-12 min-h-12 max-h-12',
        'rounded-lg px-2 py-1 w-full group hover:border-teal-400 active:border-teal-400',
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
              'w-full max-w-full h-full flex flex-row items-center place-content-between'
            }
          >
            <div className={'flex flex-row items-center gap-x-2'}>
              <div className="flex items-center w-8 h-8 text-teal-400 bg-teal-50 rounded-full mr-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5 mx-auto"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="font-normal text-sm text-gray-800 mb-0.5 pr-0 max-w-full whitespace-nowrap">
                  {name.length > 30 ? `${name.slice(0, 30)}...` : name}
                </h2>
                <p className="text-xs font-normal text-gray-500">
                  {formatBytes(size)}
                </p>
              </div>
            </div>
            <button
              className={
                'opacity-0 group-hover:opacity-100 transition border-none duration-150 outline-0 ring-0 focus:ring-0 active:ring-0'
              }
              onClick={() => onFileDelete(index)}
            >
              <XMarkIcon
                className={classNames(
                  'rounded-full hover:bg-gray-50 transition duration-150 w-8 h-8',
                  'p-1 stroke-gray-500 m-auto hover:stroke-teal-400'
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
