import FileUpload from '@/components/icons/FileUpload';
import { useUser } from '@/utils/useUser';
import { RotatingLines } from 'react-loader-spinner';
import classNames from 'classnames';
import React, { useState, useCallback } from 'react';
import FilePreview from '@/components/ui/FileInput/FilePreview';
import classes from './FileInput.module.css';
import { FileInfo, UploadState } from '../../../lib/classes';
// @ts-ignore
import { AnimatePresence, isDragActive, motion } from 'framer-motion';
import { supabase } from '@/utils/supabase-client';
import { wait } from '@/utils/helpers';
import { ErrorAlert, useErrorContext } from '../../../context/ErrorContext';
import AlertModal, {
  ModalState,
  ModalType,
  setModalOpen
} from '@/components/ui/AlertModal';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { useAppDispatch } from 'context/redux/store';
import { optimisticDocumentActions } from 'context/redux/documentSlice';
import { useDropzone } from 'react-dropzone';
import { DocumentPlusIcon } from '@heroicons/react/24/outline';

// Valid file type
const validFileTypes = [
  'text/plain',
  'text/html',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

export default function FileInput() {
  // ==============================
  // Redux State
  // ==============================
  const dispatch = useAppDispatch();

  // ==============================
  // User's Information
  // ==============================
  const { user, isLoading } = useUser();

  // ==============================
  // Local State
  // ==============================
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [modalState, setModalState] = useState<ModalState | null>(null);
  const { errorDispatch } = useErrorContext();

  // ==============================
  // Modal Buttons
  // ==============================
  const ModalActionButtons = (
    <>
      <AlertDialog.Action
        asChild
        onClick={() => setModalState(setModalOpen(false))}
      >
        <button className="text-mauve11 bg-mauve4 hover:bg-mauve5 focus:shadow-mauve7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]">
          OK
        </button>
      </AlertDialog.Action>
    </>
  );

  // ==============================
  // File Handlers
  // ==============================
  const fileInputHandler = useCallback(
    (selectedFiles: File[] | FileList | null) => {
      if (selectedFiles === null) return;

      // Retain previously selected files
      const newFiles: FileInfo[] = [...files];
      // This will help to prevent uploading duplicate files
      const existingFileNames: string[] = files.map((file) => file.name);

      let invalidFileType = false;

      // Add files that were selected just recently
      for (let i = 0; i < selectedFiles.length; ++i) {
        // Remove files of incompatible type
        if (!validFileTypes.includes(selectedFiles[i].type)) {
          if (!invalidFileType) invalidFileType = true;
          continue;
        }

        // Skip adding photos if there are already present
        if (!existingFileNames.includes(selectedFiles[i].name)) {
          newFiles.push(new FileInfo(selectedFiles[i]));
        } else {
          setModalState({
            open: true,
            title: 'Duplicate Files',
            description: 'You cannot upload the same file(s) twice!',
            type: ModalType.Alert
          });
        }
      }

      if (invalidFileType) {
        setModalState({
          open: true,
          title: 'Invalid File Type',
          description:
            'You can only upload TXT, PDF, DOC, DOCX and HTML files.',
          type: ModalType.Alert
        });
      }

      setFiles(newFiles);
    },
    [validFileTypes, files]
  );

  const removeFile = (fileIndex: number) => {
    // Update file objects
    setFiles((prevFiles) => prevFiles.filter((_, index) => index != fileIndex));
  };

  const updateFilePreviewAfterUpload = async () => {
    await wait(3000);
    setFiles((prevFiles) =>
      prevFiles
        .filter((file) => file.uploadState === UploadState.UploadFailed)
        .map((file) => {
          file.uploadState = UploadState.NotUploading;
          return file;
        })
    );
  };

  const uploadFiles = async () => {
    // TODO: Handle file upload in Redux Thunk
    if (files && files.length > 0 && !isLoading) {
      // Each file upload will be handled in a separate promise
      const fileUploads: Promise<any>[] = [];

      setFiles((files) =>
        files.map((file) => {
          file.uploadState = UploadState.Uploading;
          return file;
        })
      );

      files.forEach((file) => {
        fileUploads.push(
          supabase.storage
            .from('documents')
            .upload(`${user!.id}/${file.name}`, file.file, {
              upsert: false
            })
        );
      });

      const updatedFiles: FileInfo[] = [];

      const results = await Promise.allSettled(fileUploads);
      results.forEach((result, index) => {
        const file = files[index];
        const filename = file.name;
        let errorMessage = null;

        if (result.status === 'fulfilled') {
          const { error } = result.value;
          if (error) {
            file.uploadState = UploadState.UploadFailed;
            errorMessage =
              error.error === 'Duplicate' ? (
                <>
                  <strong>{filename}</strong> already exists
                </>
              ) : (
                <> Couldn't upload {filename}.</>
              );
          } else {
            file.uploadState = UploadState.UploadComplete;
          }
        } else {
          file.uploadState = UploadState.UploadFailed;
          errorMessage = (
            <>
              Couldn't upload <span className={'truncate'}>{filename}</span>.
            </>
          );
        }

        updatedFiles.push(file);

        if (errorMessage) {
          const newError = new ErrorAlert(errorMessage);
          errorDispatch({ type: 'addError', error: newError });
          // Automatically clear error alert
          setTimeout(() => {
            errorDispatch({
              type: 'removeError',
              id: newError.id
            });
          }, 3000);
        }
      });

      setFiles(updatedFiles);
      await updateFilePreviewAfterUpload();
      await dispatch(optimisticDocumentActions.fetchAllDocuments());
    }
  };

  // ==============================
  // Dropzone Component
  // ==============================
  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    onDrop: fileInputHandler,
    noClick: true
  });

  return (
    <>
      {modalState && (
        <AlertModal
          modalState={modalState}
          setModalState={setModalState}
          actionButtons={ModalActionButtons}
        />
      )}
      <div className="flex items-center justify-center flex-col w-full">
        <div className={classNames(classes.fileUploadContainer)}>
          {isLoading ? (
            <RotatingLines
              strokeColor="#9ca3af"
              strokeWidth="2"
              animationDuration="1"
              width="3.25rem"
              visible={true}
            />
          ) : (
            <div
              className={classNames(
                'flex flex-col items-center w-full h-full border-2 border-dashed relative',
                'transition transition-duration-150 border-transparent rounded-lg',
                isLoading
                  ? 'justify-center overflow-y-hidden'
                  : user && (!files || files.length < 1)
                  ? `justify-center hover:border-gray-400 dark:hover:border-neutral4 cursor-pointer overflow-y-hidden`
                  : 'justify-start overflow-y-scroll'
              )}
            >
              <div
                className={classNames(
                  'flex flex-col items-center w-full h-full focus:ring-0 active:ring-0 p-2',
                  !isDragActive && files.length > 0
                    ? 'justify-start'
                    : 'justify-center'
                )}
                {...getRootProps()}
                onClick={() => {
                  if (files.length === 0) open();
                }}
              >
                {!isDragActive && files.length > 0 && (
                  <motion.div className={classNames(classes.filePreviewGrid)}>
                    <AnimatePresence>
                      {files.map((file, index) => (
                        <FilePreview
                          name={file.name}
                          size={file.size}
                          uploadState={file.uploadState}
                          key={index}
                          index={index}
                          onFileDelete={removeFile}
                        />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
                {(files.length === 0 || isDragActive) && (
                  <div>
                    <div
                      className={classNames(
                        'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
                        'flex flex-col items-center justify-center'
                      )}
                    >
                      <div
                        className={classNames(
                          'bg-gray-200 dark:bg-zinc-700 mb-4',
                          'rounded-full w-14 h-14 flex items-center place-content-center'
                        )}
                      >
                        <FileUpload
                          className={classNames(
                            'w-8 h-8',
                            isDragActive
                              ? 'fill-teal-400'
                              : 'fill-gray-500 dark:fill-gray-200'
                          )}
                          strokeWidth={1}
                        />
                      </div>
                      {isDragActive ? (
                        <p className="mb-2 text-base text-gray-500">
                          Drop the files{' '}
                          <span className="font-semibold text-teal-400">
                            here
                          </span>
                        </p>
                      ) : (
                        <>
                          <p className="mb-0.5 text-sm sm:text-base text-gray-500 dark:text-gray-200 whitespace-nowrap">
                            <strong>Click</strong> to upload or{' '}
                            <strong>drag and drop</strong>
                          </p>
                          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-200 text-center whitespace-break-spaces">
                            TXT, PDF, DOC or DOCX{' '}
                            <span className={'block md:inline'}>
                              (MAX. 50MB)
                            </span>
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                )}
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  multiple
                  accept={
                    'text/plain, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                  }
                  {...getInputProps()}
                />
              </div>
            </div>
          )}
        </div>
        <AnimatePresence>
          {files && files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, display: 'none' }}
              animate={{ opacity: 1, display: 'flex' }}
              exit={{ opacity: 0, display: 'none' }}
              transition={{ duration: 0.25 }}
              className={
                'w-full mt-4 h-8 flex-row items-end place-content-end gap-x-2'
              }
              key={'file-upload-buttons'}
            >
              <button
                className={classNames(
                  'font-semibold text-gray-600 rounded-lg text-sm lg:text-base px-3 py-1.5 inline-flex shadow',
                  'items-center justify-center bg-white hover:bg-teal-50/50',
                  'transition duration-150 flex flex-row items-center gap-x-1.5 border border-gray-100',
                  'dark:bg-neutral5 dark:hover:bg-zinc-700 dark:border-zinc-700 dark:text-gray-200'
                )}
                onClick={() => open()}
              >
                <DocumentPlusIcon className={'w-5 h-5'} strokeWidth={1.5} />
                <span className={'hidden sm:inline-block'}>Add files</span>
              </button>
              <button
                className={classNames(
                  'font-semibold text-white rounded-lg text-sm lg:text-base px-3 py-1.5 inline-flex shadow',
                  'bg-teal-400 hover:bg-teal-500/[0.9] border-teal-400',
                  'items-center justify-center cursor-pointer outline-none',
                  'transition duration-150 flex flex-row items-center gap-x-1.5 border'
                )}
                aria-label="Upload files"
                onClick={uploadFiles}
              >
                <FileUpload className={'w-5 h-5 fill-white'} />
                <span className={'hidden sm:inline-block'}>Upload</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
