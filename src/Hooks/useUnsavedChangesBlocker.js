import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function useUnsavedChangesBlocker(isChanged, showToast) {
  const navigate = useNavigate();

  useEffect(() => {
    // Browser refresh or close
    const handleBeforeUnload = (e) => {
      if (isChanged) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Browser back / forward buttons
    const handlePopState = (e) => {
      if (isChanged) {
        e.preventDefault();
        showToast("error", "Please update the product before leaving this page.");
        window.history.pushState(null, "", window.location.pathname);
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isChanged, showToast, navigate]);
}
