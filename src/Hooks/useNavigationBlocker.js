import { useEffect } from "react";
import { useBlocker } from "react-router-dom";

export default function useNavigationBlocker(shouldBlock, onBlock) {
  const blocker = useBlocker(shouldBlock);

  useEffect(() => {
    if (blocker.state === "blocked") {
      onBlock?.();      // show your toast message
      blocker.reset();  // cancel navigation
    }
  }, [blocker, onBlock]);
}
