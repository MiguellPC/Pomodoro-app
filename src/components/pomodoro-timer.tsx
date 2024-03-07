import React, { useState } from 'react';
import { useInterval } from '../hooks/useInterval';

interface Props {
  defaultPomodoroTime: number;
}

export function PomodoroTimer(props: Props): JSX.Element {
  const [mainTime, setMainTime] = useState(props.defaultPomodoroTime);

  useInterval(() => {
    setMainTime((prev) => prev - 1);
  }, 1000);

  return <div>{mainTime}</div>;
}
