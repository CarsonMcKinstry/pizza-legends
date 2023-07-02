import { useEffect, useRef, useState } from "react";
import { StoreApi, useStore } from "zustand";

export type RevealingTextProps = {
  text: string;
  speed?: number;
  state: StoreApi<{ isDone: boolean }>;
};

export const RevealingText = ({
  text,
  speed = 70,
  state,
}: RevealingTextProps) => {
  const { isDone } = useStore(state);
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
      state.setState({ isDone: true });
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [chars.length, state]);

  useEffect(() => {
    if (isDone) {
      setChars(Array.from(text));
    }
  }, [isDone, text]);

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
