import React from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface PhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  onMove: () => void;
}

export function PhotoModal({ isOpen, onClose, imageUrl, onMove }: PhotoModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/90" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-2 md:p-4">
        <Dialog.Panel className="relative w-full max-h-[90vh]">
          <div className="absolute -top-10 right-0 flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMove();
              }}
              className="text-white hover:text-blue-300 p-2 touch-manipulation flex items-center"
            >
              <ArrowRightIcon className="h-6 w-6 mr-1" />
              Move
            </button>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 p-2 touch-manipulation"
            >
              <XMarkIcon className="h-8 w-8" />
            </button>
          </div>
          
          <img
            src={imageUrl}
            alt="Full size"
            className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
          />
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}