import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { pageView } from "../utils/analytics";

function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    pageView(location.pathname + location.search);
  }, [location]);

  return null;
}

export default AnalyticsTracker;
