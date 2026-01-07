import { Picker } from "emoji-mart";
import React, { useEffect, useRef } from "react";

export default function EmojiPicker(props: any) {
  const ref = useRef(null);
  const instance = useRef<Picker>(null);

  if (instance.current) {
    instance.current.update(props);
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  useEffect(() => {
    instance.current = new Picker({ ...props, ref });

    return () => {
      instance.current = null;
    };
  }, []);

  return React.createElement("div", { ref });
}
