import FileUpload from '@/components/icons/FileUpload';
import { useUser } from '@/utils/useUser';
import { RotatingLines } from 'react-loader-spinner';
import classNames from 'classnames';
import { useState, ChangeEvent } from 'react';
import FilePreview from '@/components/ui/FileInput/FilePreview';
import classes from './FileInput.module.css';
// @ts-ignore
import { AnimatePresence } from 'framer-motion';
import { supabase } from '@/utils/supabase-client';
import { wait } from '@/utils/helpers';
import { ErrorAlert, useErrorContext } from '../../../context/ErrorContext';

interface FileInfo {
  name: string;
  size: number;
  uploadState: UploadState;
}

export enum UploadState {
  NotUploading,
  Uploading,
  UploadComplete,
  UploadFailed
}

export default function FileInput() {
  const { user, isLoading } = useUser();
  const [files, setFiles] = useState<FileList | null>();
  const [previewElements, setPreviewElements] = useState<FileInfo[]>([]);
  const {
    errorState: { errors },
    dispatch: dispatchError
  } = useErrorContext();

  // Logic for handling image upload
  const fileInputHandler = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    let selectedFiles: FileList = event.target.files!;
    let newPreviewElements = [...previewElements];

    const filesLength = files ? files.length : 0;

    const newFiles = new DataTransfer();
    // This will help to prevent uploading duplicate files
    const existingFileNames: string[] = [];

    // Retain previously selected files
    if (files) {
      for (let i = 0; i < filesLength; ++i) {
        newFiles.items.add(files[i]);
        existingFileNames.push(files[i].name);
      }
    }

    // Add files that were selected just recently
    for (let i = 0; i < selectedFiles.length; ++i) {
      // Skip adding photos if there are already present
      if (!existingFileNames.includes(selectedFiles[i].name)) {
        newFiles.items.add(selectedFiles[i]);
        newPreviewElements.push({
          name: selectedFiles[i].name,
          size: selectedFiles[i].size,
          uploadState: UploadState.NotUploading
        });
      } else alert('You cannot upload the same file(s) twice!');
    }

    setFiles(newFiles.files);
    setPreviewElements(newPreviewElements);
  };

  const removeFile = (index: number) => {
    // Update file objects
    if (files && files[index]) {
      const newFiles = new DataTransfer();
      for (let i = 0; i < files.length; ++i)
        if (i !== index) newFiles.items.add(files[i]);
      setFiles(newFiles.files);
    }

    // Update preview elements
    if (previewElements && previewElements[index]) {
      setPreviewElements((prevElements) => {
        if (prevElements) {
          return prevElements.filter(
            (_, elementIndex) => elementIndex != index
          );
        } else {
          return [];
        }
      });
    }
  };

  const updateFilePreviewAfterUpload = () => {
    setPreviewElements((previewElements) =>
      previewElements
        .filter(
          (previewElement) =>
            previewElement.uploadState === UploadState.UploadFailed
        )
        .map((previewElement) => ({
          ...previewElement,
          uploadState: UploadState.NotUploading
        }))
    );
  };

  const uploadFiles = async () => {
    if (files && files.length > 0 && !isLoading) {
      // Each file upload will be handled in a separate promise
      const fileUploads: Promise<any>[] = [];
      let newPreviewElements: FileInfo[] = [];

      for (let i = 0; i < files.length; ++i) {
        if (previewElements[i].name === files[i].name) {
          newPreviewElements.push({
            ...previewElements[i],
            uploadState: UploadState.Uploading
          });
        }

        fileUploads.push(
          supabase.storage
            .from('documents')
            .upload(`${user!.id}/${files[i].name}`, files[i], {
              upsert: false
            })
        );
      }
      setPreviewElements(newPreviewElements);

      let newFiles = new DataTransfer();
      newPreviewElements = [];

      const results = await Promise.allSettled(fileUploads);
      results.forEach((result, index) => {
        const filename =
          files[index].name.length > 20
            ? `${files[index].name.slice(0, 20)}...`
            : files[index].name;

        let errorMessage = null;

        if (result.status === 'fulfilled') {
          const { error } = result.value;
          if (error) {
            newFiles.items.add(files[index]);
            newPreviewElements.push({
              name: files[index].name,
              size: files[index].size,
              uploadState: UploadState.UploadFailed
            });

            errorMessage =
              error.error === 'Duplicate' ? (
                <>
                  <strong>{filename}</strong> already exists
                </>
              ) : (
                <> Couldn't upload {filename}.</>
              );
          } else {
            newPreviewElements.push({
              name: files[index].name,
              size: files[index].size,
              uploadState: UploadState.UploadComplete
            });
          }
        } else {
          newFiles.items.add(files[index]);
          newPreviewElements.push({
            name: files[index].name,
            size: files[index].size,
            uploadState: UploadState.UploadFailed
          });

          errorMessage = (
            <>
              Couldn't upload <strong>{filename}</strong>.
            </>
          );
        }

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

      setFiles(newFiles.files);
      setPreviewElements(newPreviewElements);

      await wait(3000);
      updateFilePreviewAfterUpload();
    }
  };

  return (
    <div className="flex items-center justify-center flex-col w-full px-4">
      <label
        htmlFor="dropzone-file"
        className={classNames(
          'flex flex-col items-center w-full h-64 max-h-64 shadow border',
          'transition transition-duration-150 border-transparent rounded-lg bg-white',
          'overflow-y-scroll p-4',
          isLoading
            ? 'justify-center'
            : user && (!files || files.length < 1)
            ? 'justify-center hover:border-teal-400 cursor-pointer'
            : 'justify-start'
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
        ) : files && files.length > 0 ? (
          <div
            className={classNames(classes.filePreviewGrid, 'w-full gap-2 grid')}
          >
            <AnimatePresence>
              {previewElements.map((fileInfo, index) => (
                <FilePreview
                  name={fileInfo.name}
                  size={fileInfo.size}
                  uploadState={fileInfo.uploadState}
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
                TXT, PDF, or DOCS (MAX. 50MB)
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              multiple
              onChange={fileInputHandler}
              accept={'.txt, .pdf, .docs'}
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
              accept={'.txt, .pdf, .docs'}
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
