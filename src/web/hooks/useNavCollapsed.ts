import { FORCE_COLLAPSE_QUERY } from "../components/Nav/navChrome";
import useMediaQuery from "./useMediaQuery";
import useStore from "./useStore";

function useNavCollapsed() {
  const stored = useStore((state) => state.navCollapsed);
  const forced = useMediaQuery(FORCE_COLLAPSE_QUERY);
  return { collapsed: stored || forced, forced };
}

export default useNavCollapsed;
