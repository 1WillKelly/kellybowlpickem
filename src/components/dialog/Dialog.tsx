import { Fragment } from "react";
import { Dialog as HeadlessDialog, Transition } from "@headlessui/react";
import Button from "components/Button";

interface DialogProps {
  title: React.ReactNode;
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  primaryButtonText: React.ReactNode;
  cancelButton?: boolean;
}

const Dialog: React.FC<React.PropsWithChildren<DialogProps>> = (props) => {
  return (
    <Transition.Root show={props.open} as={Fragment}>
      <HeadlessDialog
        as="div"
        className="relative z-10"
        onClose={props.onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <HeadlessDialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <HeadlessDialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      {props.title}
                    </HeadlessDialog.Title>
                    <div className="mt-2">{props.children}</div>
                  </div>
                </div>
                <div className="sm:px-6f sm:grid-cols- mt-5 grid gap-3 sm:mt-6 sm:grid-flow-row-dense">
                  <Button
                    primary
                    onClick={props.onSubmit}
                    className="sm:col-start-2"
                  >
                    {props.primaryButtonText}
                  </Button>
                  {(props.cancelButton ?? true) && (
                    <Button primary={false} secondary onClick={props.onClose}>
                      Cancel
                    </Button>
                  )}
                </div>
              </HeadlessDialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </HeadlessDialog>
    </Transition.Root>
  );
};

export default Dialog;
