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
    <li>
      <Switcher
        style="default"
        defaultChecked={colorMode === "dark"}
        onChange={handleColorModeToggle}
        onIcon="/icons/moon-filled.svg"
        offIcon="/icons/sun-filled.svg"
      />
    </li>
  );
};

export default DarkModeSwitcher;
