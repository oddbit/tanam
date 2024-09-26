import {useState} from "react";
import {Badge} from "../Badge";
import {Button} from "./../Button";
import {Input} from "./Input";

interface MultipleTextProps {
  title?: string;
  placeholder?: string;
  disabled?: boolean;
  value?: string[];
  onChange?: (value: string[]) => void;
}

export function MultipleText(props: MultipleTextProps) {
  const {title, placeholder = "Add something here", disabled, value = [], onChange} = props;

  const [entry, setEntry] = useState("");
  const [entries, setEntries] = useState(value);

  function handleAddItem() {
    if (entry.trim()) {
      const updatedArray = [...entries, entry.trim()];

      setEntries(updatedArray);
      onChange && onChange(updatedArray);
      setEntry("");
    }
  }

  function handleRemoveItem(index: number) {
    const updatedArray = entries.filter((_, i) => i !== index);

    setEntries(updatedArray);
    onChange && onChange(updatedArray);
  }

  return (
    <div className="relative w-full">
      {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}

      <div className="flex gap-2 mb-4">
        <Input
          key="multipleTextInput"
          type="text"
          placeholder={placeholder}
          disabled={disabled}
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
        />

        <Button title="Add" onClick={handleAddItem} style="rounded" />
      </div>

      <div className="relative w-full grid gap-2 lg:flex lg:flex-row lg:gap-2">
        {entries.length > 0 &&
          entries.map((value, index) => <Badge key={index} title={value} onRemove={() => handleRemoveItem(index)} />)}
      </div>
    </div>
  );
}
