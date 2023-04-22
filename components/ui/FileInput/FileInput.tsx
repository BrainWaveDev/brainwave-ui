import FileUpload from '@/components/icons/FileUpload';
import { useUser } from '@/utils/useUser';
import { RotatingLines } from 'react-loader-spinner';
import classNames from 'classnames';
import { ChangeEvent, useState } from 'react';
import FilePreview from '@/components/ui/FileInput/FilePreview';
import classes from './FileInput.module.css';
import { FileInfo, UploadState } from '../../../lib/classes';
// @ts-ignore
import { AnimatePresence } from 'framer-motion';
import { supabase } from '@/utils/supabase-client';
import { wait } from '@/utils/helpers';
import { ErrorAlert, useErrorContext } from '../../../context/ErrorContext';

interface FileInputProps {
  afterUpload?: () => Promise<void>;
}

export default function FileInput(
  { afterUpload }: FileInputProps,
) {
  const { user, isLoading } = useUser();
  const [files, setFiles] = useState<FileInfo[]>([]);
  // const [previewElements, setPreviewElements] = useState<FileInfo[]>([]);
  const { dispatch: dispatchError } = useErrorContext();

  // Logic for handling image upload
  const fileInputHandler = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    let selectedFiles: FileList = event.target.files!;

    // Retain previously selected files
    const newFiles: FileInfo[] = [...files];
    // This will help to prevent uploading duplicate files
    const existingFileNames: string[] = files.map((file) => file.name);

    // Add files that were selected just recently
    for (let i = 0; i < selectedFiles.length; ++i) {
      // Skip adding photos if there are already present
      if (!existingFileNames.includes(selectedFiles[i].name))
        newFiles.push(new FileInfo(selectedFiles[i]));
      else alert('You cannot upload the same file(s) twice!');
    }

    setFiles(newFiles);
  };

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
        const filename =
          files[index].name.length > 20
            ? `${files[index].name.slice(0, 20)}...`
            : files[index].name;

        let errorMessage = null;
        const file = files[index];
        console.log(result);

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
              Couldn't upload <strong>{filename}</strong>.
            </>
          );
        }

        updatedFiles.push(file);

        if (errorMessage) {
          const newError = new ErrorAlert(errorMessage);
          dispatchError({ type: 'addError', error: newError });
          // Automatically clear error alert
          setTimeout(() => {
            dispatchError({
              type: 'removeError',
              id: newError.id
            });
          }, 3000);
        }
      });

      setFiles(updatedFiles);
      await updateFilePreviewAfterUpload();

      // after upload callback
      afterUpload && await afterUpload();
    }
  };

  return (
    <div className="flex items-center justify-center flex-col w-full px-4">
      <label
        htmlFor="dropzone-file"
        className={classNames(
          'flex flex-col items-center w-full h-64 max-h-64 shadow border',
          'transition transition-duration-150 border-transparent rounded-lg bg-white',
          'p-4',
          isLoading
            ? 'justify-center overflow-y-hidden'
            : user && (!files || files.length < 1)
            ? 'justify-center hover:border-teal-400 cursor-pointer overflow-y-hidden'
            : 'justify-start overflow-y-scroll'
        )}
      >
        {isLoading ? (
          <RotatingLines
            strokeColor="#9ca3af"
            strokeWidth="2"
            animationDuration="1"
            width="3.25rem"
            visible={true}
          />
        ) : files.length > 0 ? (
          <div
            className={classNames(classes.filePreviewGrid, 'w-full gap-2 grid')}
          >
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
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <div className={'bg-gray-100 mb-4 rounded-[50%]'}>
                <FileUpload
                  className={'w-12 h-12 stroke-gray-700 p-2'}
                  strokeWidth={1}
                />
              </div>
              <p className="mb-2 text-sm text-gray-700 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-700 dark:text-gray-900">
                TXT, PDF, or DOCX (MAX. 50MB)
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              multiple
              onChange={fileInputHandler}
              accept={
                'text/plain, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document'
              }
            />
          </>
        )}
      </label>
      <div
        className={
          'w-full mt-2 h-8 flex flex-row items-end place-content-end gap-x-2'
        }
      >
        {files && files.length > 0 && (
          <>
            <label
              htmlFor={'add-file-button'}
              className={classNames(
                'font-base text-gray-600 rounded-lg text-sm px-3 py-1.5 inline-flex shadow',
                ' items-center justify-center bg-white hover:bg-teal-50/[0.5] cursor-pointer outline-none',
                'transition duration-150'
              )}
            >
              {' '}
              Add files
            </label>
            <input
              id="add-file-button"
              type="file"
              multiple
              onChange={fileInputHandler}
              accept={
                'text/plain, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document'
              }
              hidden
            />
            <button
              className={classNames(
                'font-semibold text-white rounded-lg text-sm px-3 py-1.5 inline-flex shadow',
                'items-center justify-center bg-teal-400 hover:bg-teal-500/[0.9] cursor-pointer outline-none',
                'transition duration-150'
              )}
              aria-label="Upload files"
              onClick={uploadFiles}
            >
              Upload
            </button>
          </>
        )}
      </div>
    </div>
  );
}
