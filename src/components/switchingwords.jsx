import React, { useState, useEffect } from "react";

const Word = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const [word, setWord] = useState("games");
  const [isGoing, setIsGoing] = useState(false);
  const [count, setCount] = useState(0);
  const [canChange, setCanChange] = useState(false);
  const [globalCount, setGlobalCount] = useState(0);
  const words = ["games", "webApp"]; // Define the array here

  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  const getRandomLetter = () => {
    const alphabet = "abcde!fg*hij@k}lm%no&p{qr#s/t\\u$vw^xyz";
    return alphabet[rand(0, alphabet.length - 1)];
  };

  const init = () => {
    if (isGoing) return;

    setIsGoing(true);
    const initialWord = word;

    const interval = setInterval(() => {
      let finalWord = "";
      for (let x = 0; x < initialWord.length; x++) {
        if (x <= count && canChange) {
          finalWord += initialWord[x];
        } else {
          finalWord += getRandomLetter();
        }
      }

      setWord(finalWord);

      if (canChange) {
        setCount((prevCount) => prevCount + 1);
      }

      if (globalCount >= 20) {
        setCanChange(true);
      }

      if (count >= initialWord.length) {
        clearInterval(interval);
        setCount(0);
        setCanChange(false);
        setGlobalCount(0);
        setIsGoing(false);
        setWordIndex((prevIndex) => (prevIndex + 1) % 2);
      }

      setGlobalCount((prevGlobalCount) => prevGlobalCount + 1);
    }, 50);

    // Clear the interval after 1 second
    setTimeout(() => {
      clearInterval(interval);
      setCount(0);
      setCanChange(false);
      setGlobalCount(0);
      setIsGoing(false);

      // Revert back to the initial word
      setWordIndex((prevIndex) => (prevIndex + 1) % 2);
      setWord(words[wordIndex]);
    }, 1000);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      init();
    }, 3000);

    return () => {
      clearInterval(intervalId);
    };
  }, ); // Re-run the effect when the wordIndex changes

  return (
    <span style={{ color: "#801f1d" }} className="start_sent start_anim_word">
      {
        ""
      }
      {word}
    </span>
  );
};

export default Word;
