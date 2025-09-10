import { SignedForm } from "models/SignatureInfo";
import { useState } from "react";

export default function useSignProcessViewHook() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentFile, setCurrentFile] = useState<SignedForm>({});

  const handleOpen = (file: SignedForm) => {
    setCurrentFile(file);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setCurrentFile({});
  };

  return {
    isOpen,
    currentFile,
    handleOpen,
    handleClose,
  };
}
