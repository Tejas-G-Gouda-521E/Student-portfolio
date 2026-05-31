import { useEffect } from "react";
import { initPremiumHover } from "../utils/premiumHover";

export default function PremiumHoverInit() {
  useEffect(() => {
    const disconnect = initPremiumHover(document.getElementById("root") ?? document.body);
    return disconnect;
  }, []);

  return null;
}
