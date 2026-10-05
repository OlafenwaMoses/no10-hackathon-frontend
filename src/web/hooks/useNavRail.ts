import useNavCollapsed from "./useNavCollapsed";
import useStore from "./useStore";

function useNavRail() {
  const { collapsed, forced } = useNavCollapsed();
  const toggleCollapsed = useStore((state) => state.toggleNavCollapsed);

  return {
    collapsed,
    forced,
    toggleCollapsed,
    railProps: {
      "data-collapsed": collapsed || undefined,
    },
  };
}

export default useNavRail;
