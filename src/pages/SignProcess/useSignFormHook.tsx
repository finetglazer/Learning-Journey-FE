import React from "react";

export function useSignFormHook() {
  const [openSigningForm, setOpenSigningForm] = React.useState(false);
  const handleCancelSigningForm = React.useCallback(() => {
    setOpenSigningForm(false);
  }, []);

  const handleOpenSigningForm = React.useCallback(() => {
    setOpenSigningForm(true);
  }, []);

  return {
    openSigningForm,
    setOpenSigningForm,
    handleCancelSigningForm,
    handleOpenSigningForm,
  };
}
