import {Switcher} from "@tanam/ui-components";
import {useEffect} from "react";
import {useAuthentication} from "../../../../../hooks/useAuthentication";
import useColorMode from "../../../../../hooks/useColorMode";
import {useTanamUser} from "../../../../../hooks/useTanamUser";

const DarkModeSwitcher = () => {
  const [colorMode, setColorMode] = useColorMode();
  const {authUser} = useAuthentication();
  const {tanamUser, saveColorMode} = useTanamUser(authUser?.uid);

  useEffect(() => {
    if (typeof setColorMode === "function" && !!tanamUser?.colorMode) {
      setColorMode(tanamUser.colorMode);
    }
  }, [tanamUser]);

  return (
    <Switcher
      style="default"
      initialValue={colorMode === "dark"}
      onChange={async (checked) => await saveColorMode(checked ? "dark" : "light")}
      onIcon="i-ri-moon-clear-fill text-white"
      offIcon="i-ri-sun-line"
    />
  );
};

export default DarkModeSwitcher;
