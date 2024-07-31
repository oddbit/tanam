import {Switcher} from "@/components/Form/Switcher";
import {useAuthentication} from "@/hooks/useAuthentication";
import useColorMode from "@/hooks/useColorMode";
import {useTanamUser} from "@/hooks/useTanamUser";
import {useEffect} from "react";

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
      defaultChecked={colorMode === "dark"}
      onChange={(checked) => saveColorMode(checked ? "dark" : "light")}
      onIcon="i-ri-moon-clear-fill text-white"
      offIcon="i-ri-sun-line"
    />
  );
};

export default DarkModeSwitcher;
