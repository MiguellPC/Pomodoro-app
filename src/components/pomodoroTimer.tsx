import React, { useState } from 'react';
import { useInterval } from '../hooks/useInterval';
import { Button } from './button';
import { Timer } from './timer';

interface Props {
  defaultPomodoroTime: number;
}

export function PomodoroTimer(props: Props): JSX.Element {
  const [mainTime, setMainTime] = useState(props.defaultPomodoroTime);

  useInterval(() => {
    setMainTime((prev) => prev - 1);
  }, 1000);

  return (
    <div className="pomodoro">
      <h2>You are: working</h2>
      <Timer mainTime={mainTime} />
      <Button
        text="teste"
        onClick={() => {
          console.log(1);
        }}
      ></Button>
    </div>
  );
}
