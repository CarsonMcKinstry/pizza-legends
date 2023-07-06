import { useEffect, useRef, useState } from "react";

import { StoreApi, useStore } from "zustand";

type RevealingTextProps = {
  text: string;
  speed?: number;
  onComplete: () => void;
  store: StoreApi<RevealingTextState>;
};

export type RevealingTextState = {
  done: boolean;
};

export const RevealingText = ({
  text,
  speed = 60,
  onComplete,
  store,
}: RevealingTextProps) => {
  const { done } = useStore(store);
  const textLength = useRef(text.length);
  const timeoutRef = useRef<number | null>(0);
  const delaysRef = useRef<{ char: string; delay: number }[]>(
    text.split("").map((char) => {
      return {
        char,
        delay: /\s/.test(char) ? 0 : speed,
      };
    })
  );
  const [chars, setChars] = useState<string[]>([]);

  useEffect(() => {
    if (chars.length < textLength.current) {
      const { char, delay } = delaysRef.current[chars.length];
      timeoutRef.current = setTimeout(() => {
        setChars((c) => [...c, char]);
      }, delay);
    } else {
      clearTimeout(timeoutRef.current!);
      onComplete();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [chars.length, onComplete]);

  useEffect(() => {
    if (done) {
      setChars(Array.from(text));
    }
  }, [done, text]);

  return (
    <>
      {chars.map((char, i) => (
        <span key={`${char}-${i}`} className="revealed">
          {char}
        </span>
      ))}
    </>
  );
};
