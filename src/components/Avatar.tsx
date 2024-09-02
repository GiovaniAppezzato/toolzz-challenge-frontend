import React from 'react';
import { IoPerson } from "react-icons/io5";

const storagePrefix = `${process.env.NEXT_PUBLIC_API_URL}/storage/files/`;

interface IProps {
  className?: string;
  src?: string;
}

export default function Label({
  className = '',
  src = '',
  ...rest
}: IProps) {
  return (
    <>
      {src ? (
        <img
          src={storagePrefix + src}
          alt="User Avatar"
          className={`w-10 h-10 rounded-full ${className}`}
          {...rest}
        />
      ) : (
        <div
          className={`w-10 h-10 bg-gray-200 rounded-full ${className} flex items-center justify-center dark:!bg-zinc-800`}
          {...rest}
        >
          <IoPerson className="w-4 h-4 m-auto text-gray-600" />
        </div>
      )}
    </>
  );
}