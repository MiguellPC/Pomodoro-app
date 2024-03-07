import React, { useState } from 'react';
import { useInterval } from '../hooks/useInterval';
import { Button } from './button';
import { Timer } from './timer';

interface Props {
  pomodoroTime: number;
  shortRestTime: number;
  longRestTime: number;
  cycles: number;
}

export function PomodoroTimer(props: Props): JSX.Element {
  const [mainTime, setMainTime] = useState(props.pomodoroTime);

  useInterval(() => {
    setMainTime((prev) => prev - 1);
  }, 1000);

  return (
    <div className="pomodoro">
      <h2>You are: working</h2>
      <Timer mainTime={mainTime} />

      <div className="controls">
        <Button
          text="teste"
          onClick={() => {
            console.log(1);
          }}
        ></Button>
        <Button
          text="teste"
          onClick={() => {
            console.log(2);
          }}
        ></Button>
        <Button
          text="teste"
          onClick={() => {
            console.log(3);
          }}
        ></Button>
      </div>

      <div className="details">
        <p>Testando</p>
        <p>Testando</p>
        <p>Testando</p>
        <p>Testando</p>
      </div>
    </div>
  );
}
