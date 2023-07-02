import { useEffect, useRef, useState } from "react";

export type RevealingTextProps = {
  text: string;
  speed?: number;
  isDone: boolean;
  onComplete: () => void;
};

export const RevealingText = ({
  text,
  speed = 60,
  isDone,
  onComplete,
}: RevealingTextProps) => {
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
