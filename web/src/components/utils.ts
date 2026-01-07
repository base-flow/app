function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const FlagSrc = {
  list: {
    emoji: [[':eyes:', '👀'], [':smile:', '😀'], [':man-surfing:', '🏄‍♂️'], [':clown_face:', '🤡'], [':alien:', '👽'], [':ghost:', '👻'], [':red_haired_woman:', '👩‍🦰'], [':bicyclist:', '🚴']],
    bgColor: ['#fef7c3', '#ffead5', '#ffe4e8', '#fbe8ff', '#ece9fe', '#e0eaff', '#e4fbcc', '#d3f8df', '#d5f5f6', '#e0f2fe', '#d1e9ff', '#d1e0ff'],
  },
  encode(source: { icon?: string; emoji?: string; bgColor?: string; native?: string }): string {
    const { icon, emoji = '+1', native = '👍', bgColor = '#ffff00' } = source;
    if (icon) {
      return icon;
    } else {
      return `emoji://${bgColor}@${emoji}@${native}`;
    }
  },
  decode(src: string): { icon?: string; emoji?: string; bgColor?: string; native?: string } {
    if (src.startsWith('emoji://')) {
      const arr = src.replace('emoji://', '').split('@');
      return { emoji: arr[1], bgColor: arr[0], native: arr[2] };
    } else {
      return { icon: src };
    }
  },
  create(): string {
    const emoji = FlagSrc.list.emoji[getRandomInt(0, FlagSrc.list.emoji.length - 1)];
    return FlagSrc.encode({ emoji: emoji[0], bgColor: FlagSrc.list.bgColor[getRandomInt(0, FlagSrc.list.bgColor.length - 1)], native: emoji[1] });
  },
};
