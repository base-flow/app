import emojiData from "@emoji-mart/data";
import { Button, Popover } from "antd";
import type { FC } from "react";
import { useMemo, useState } from "react";
import { useEvent } from "@/utils/hooks";
import Flag from "../Flag";
import { FlagSrc } from "../utils";
import EmojiPicker from "./EmojiPicker";
import "./index.scss";

interface Props {
  value?: string;
  onChange?: (value: string) => void;
  fontSize?: string;
}

const FlagSelector: FC<Props> = ({ value = "emoji://#fef7c3@:smile:@😄", onChange, fontSize = "15px" }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState({ ...FlagSrc.decode(value), value });
  const [current, setCurrent] = useState(selected);

  useMemo(() => {
    const source = { ...FlagSrc.decode(value), value };
    setSelected(source);
    setCurrent(source);
  }, [value]);

  const flagList = useMemo(() => {
    const { emoji, native } = selected;
    return FlagSrc.list.bgColor.map((bgColor) => FlagSrc.encode({ emoji, native, bgColor }));
  }, [selected]);

  const onEmojiSelect = useEvent(({ shortcodes, native }: { shortcodes: string; native: string }) =>
    setSelected({
      bgColor: selected.bgColor,
      emoji: shortcodes,
      native,
      value: FlagSrc.encode({ bgColor: selected.bgColor, emoji: shortcodes, native }),
    }),
  );

  const onFlagSelect = useEvent((value: string) =>
    setSelected({
      ...FlagSrc.decode(value),
      value,
    }),
  );

  const onSubmit = useEvent(() => {
    setOpen(false);
    onChange?.(selected.value);
  });

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      trigger="click"
      content={
        <div className="comp-FlagSelector__dlg">
          <EmojiPicker
            previewPosition="none"
            data={emojiData}
            onEmojiSelect={onEmojiSelect}
            dynamicWidth={true}
            skinTonePosition="none"
            width="500"
          />
          <div className="colorful grid-cols-6">
            {flagList.map((item) => (
              <Flag key={item} src={item} className={item === selected.value ? "on" : ""} onClick={onFlagSelect} />
            ))}
          </div>
          <div className="ft">
            <Button onClick={() => setOpen(false)}>取消</Button>
            <Button type="primary" onClick={onSubmit}>
              确认
            </Button>
          </div>
        </div>
      }
    >
      <div className="comp-FlagSelector__btn comp-Flag" style={{ backgroundColor: current.bgColor, fontSize }}>
        <span className="emoji-mart-emoji" data-emoji-set="native">
          <span className="icon">{current.native}</span>
        </span>
      </div>
    </Popover>
  );
};

export default FlagSelector;
