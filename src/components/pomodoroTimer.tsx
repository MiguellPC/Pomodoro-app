import React, { useCallback, useEffect, useState } from 'react';
import { useInterval } from '../hooks/useInterval';
import { Button } from './button';
import { Timer } from './timer';
import { Options } from './options';
import { secondsToTime } from '../utils/secondsToTime';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const audioStart = require('../sounds/bell-start.mp3');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const audioFinish = require('../sounds/bell-finish.mp3');

const audioStartWorking = new Audio(audioStart);
const audioFinishWorking = new Audio(audioFinish);

interface Props {
  pomodoroTime: number;
  shortRestTime: number;
  longRestTime: number;
  cycles: number;
}

export function PomodoroTimer(props: Props): JSX.Element {
  const [mainTime, setMainTime] = useState(props.pomodoroTime);
  const [timeCounting, setTimeCounting] = useState(false);
  const [working, setWorking] = useState(false);
  const [resting, setResting] = useState(false);
  const [shortRest, setShortRest] = useState(props.shortRestTime);
  const [longRest, setLongRest] = useState(props.longRestTime);
  const [userCycles, setUserCycles] = useState(props.cycles);
  const [cyclesQtdManager, setCyclesQtdManager] = useState(
    new Array(userCycles - 1).fill(true),
  );
  const [completedCycles, setCompletedCycles] = useState(0);
  const [fullWorkingTime, setFullWorkingTime] = useState(0);
  const [numberOfPomodoros, setNumberOfPomodoros] = useState(0);

  const [userTime, setUserTime] = useState(props.pomodoroTime);

  useInterval(
    () => {
      setMainTime((prev) => prev - 1);
      if (working) setFullWorkingTime((prev) => prev + 1);
    },
    timeCounting ? 1000 : null,
  );

  const configureWork = useCallback(() => {
    setTimeCounting(true);
    setWorking(true);
    setResting(false);
    setMainTime(userTime !== mainTime ? userTime : mainTime);
    audioStartWorking.play();
  }, [
    setTimeCounting,
    setWorking,
    setResting,
    setMainTime,
    mainTime,
    userTime,
  ]);

  const configureRest = useCallback(
    (long: boolean) => {
      setTimeCounting(true);
      setWorking(false);
      setResting(true);

      if (long) {
        setMainTime(longRest);
      } else {
        setMainTime(shortRest);
      }

      audioFinishWorking.play();
    },
    [setTimeCounting, setWorking, setResting, setMainTime, longRest, shortRest],
  );

  useEffect(() => {
    if (working) {
      document.body.classList.remove('bg-resting', 'bg-initial');
      document.body.classList.add('working', 'bg-working');
    }
    if (resting) {
      document.body.classList.remove('working', 'bg-working', 'bg-initial');
      document.body.classList.add('bg-resting');
    }

    if (mainTime > 0) return;

    if (working && cyclesQtdManager.length > 0) {
      configureRest(false);
      cyclesQtdManager.pop();
    } else if (working && cyclesQtdManager.length <= 0) {
      configureRest(true);
      setCyclesQtdManager(new Array(userCycles - 1).fill(true));
      setCompletedCycles((prev) => prev + 1);
    }

    if (working) setNumberOfPomodoros((prev) => prev + 1);
    if (resting) configureWork();
  }, [
    working,
    resting,
    mainTime,
    configureRest,
    setCyclesQtdManager,
    configureWork,
    cyclesQtdManager,
    numberOfPomodoros,
    completedCycles,
    props.cycles,
    userCycles,
    userTime,
  ]);

  return (
    <div className="pomodoro">
      <Options
        mainTime={mainTime}
        shortRestTime={shortRest}
        longRestTime={longRest}
        cycles={userCycles}
        setMainTime={setMainTime}
        setUserTime={setUserTime}
        setCycles={setCyclesQtdManager}
        setUserCycles={setUserCycles}
        setShortRestTime={setShortRest}
        setLongRestTime={setLongRest}
      />

      <h2>Você está: {working ? 'Trabalhando' : 'Descansando'}</h2>
      <Timer mainTime={mainTime} />

      <div className="controls">
        <Button
          text="Trabalhar"
          onClick={() => {
            configureWork();
          }}
        ></Button>
        <Button
          text="Descansar"
          onClick={() => {
            configureRest(false);
          }}
        ></Button>
        <Button
          className={!working && !resting ? 'hidden' : ''}
          text={timeCounting ? 'Pause' : 'Play'}
          onClick={() => {
            setTimeCounting(!timeCounting);
          }}
        ></Button>
      </div>

      <div className="details">
        <p>
          Ciclos concluídos: <span>{completedCycles}</span>
        </p>
        <p>
          Horas trabalhadas: <span>{secondsToTime(fullWorkingTime)}</span>
        </p>
        <p>
          Pomodoros concluídos: <span>{numberOfPomodoros}</span>
        </p>
      </div>
    </div>
  );
}
