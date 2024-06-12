import useColorMode from "@/hooks/useColorMode";
import {Switcher} from "@/components/Form/Switcher";

const DarkModeSwitcher = () => {
  const [colorMode, setColorMode] = useColorMode();

  const handleColorModeToggle = (checked: boolean) => {
    if (typeof setColorMode === "function") {
      setColorMode(checked ? "dark" : "light");
    }
  };

  return (
    <Switcher
      style="default"
      defaultChecked={colorMode === "dark"}
      onChange={handleColorModeToggle}
      onIcon="i-ri-moon-clear-fill text-white"
      offIcon="i-ri-sun-line"
    />
  );
};

export default DarkModeSwitcher;
