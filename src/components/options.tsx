import React, { useRef } from 'react';
import { secondsToMinutes } from '../utils/secondsToMinutes';

interface Props {
  mainTime: number;
  shortRestTime: number;
  longRestTime: number;
  cycles: number;
  setMainTime: (mainTime: number) => void;
  setShortRestTime: (shortRestTime: number) => void;
  setLongRestTime: (longRestTime: number) => void;
  setCycles: (cycles: boolean[]) => void;
  setUserCycles: (userCycles: number) => void;
  setUserTime: (userTime: number) => void;
}

export function Options(props: Props): JSX.Element {
  const pomodoroTimeRef = useRef<HTMLInputElement>(null);
  const shortRestTimeRef = useRef<HTMLInputElement>(null);
  const longRestTimeRef = useRef<HTMLInputElement>(null);
  const userCyclesRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  const checkInputTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = new RegExp(/^[0-5][0-9]:[0-5][0-9]$/g);
    if (e.target.classList.contains('error')) {
      e.target.classList.remove('error');
    }
    if (
      document.querySelectorAll('.error').length === 0 &&
      submitRef.current?.hasAttribute('disabled')
    ) {
      submitRef.current.removeAttribute('disabled');
    }
    if (!regex.test(value)) {
      e.target.classList.add('error');
      submitRef.current?.setAttribute('disabled', 'true');
    }
  };

  const getValue = (e: React.RefObject<HTMLInputElement>) => {
    return e.current?.value;
  };

  const getMinutesAndSeconds = (time: string) => {
    const [minutes, seconds] = time.split(':').map(Number);
    return { minutes, seconds };
  };

  const minutesToSeconds = (time: string) => {
    const { minutes, seconds } = getMinutesAndSeconds(time);
    return minutes * 60 + seconds;
  };

  const changePomodoroTime = () => {
    const pomodoroTime = getValue(pomodoroTimeRef);
    if (pomodoroTime) {
      props.setUserTime(minutesToSeconds(pomodoroTime));
      props.setMainTime(minutesToSeconds(pomodoroTime));
      console.log(minutesToSeconds(pomodoroTime), props.mainTime);
    }
  };

  const changeShortRestTime = () => {
    const shortRestTime = getValue(shortRestTimeRef);
    if (shortRestTime) {
      const [minutes, seconds] = shortRestTime.split(':').map(Number);
      props.setShortRestTime(minutes * 60 + seconds);
    }
  };

  const changeLongRestTime = () => {
    const longRestTime = getValue(longRestTimeRef);
    if (longRestTime) {
      const [minutes, seconds] = longRestTime.split(':').map(Number);
      props.setLongRestTime(minutes * 60 + seconds);
    }
  };

  const changeCycles = () => {
    const cycles = Number(getValue(userCyclesRef));
    if (cycles) {
      props.setUserCycles(cycles);
      props.setCycles(new Array(cycles - 1).fill(true));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    changePomodoroTime();
    changeShortRestTime();
    changeLongRestTime();
    changeCycles();
  };

  return (
    <div className="options">
      <div
        onClick={() => {
          document
            .querySelector('.options-container')
            ?.classList.toggle('active');
        }}
      >
        <img src="/cog.svg"></img>
      </div>
      <form className="options-container">
        <h2>Configurações</h2>
        <div className="config-item">
          <p>Pomodoro</p>
          <input
            type="text"
            ref={pomodoroTimeRef}
            defaultValue={secondsToMinutes(props.mainTime)}
            onChange={checkInputTime}
          ></input>
        </div>
        <div className="config-item">
          <p>Descanso curto</p>
          <input
            type="text"
            ref={shortRestTimeRef}
            defaultValue={secondsToMinutes(props.shortRestTime)}
            onChange={checkInputTime}
          ></input>
        </div>
        <div className="config-item">
          <p>Descanso longo</p>
          <input
            type="text"
            ref={longRestTimeRef}
            defaultValue={secondsToMinutes(props.longRestTime)}
            onChange={checkInputTime}
          ></input>
        </div>
        <div className="config-item">
          <p>Ciclos</p>
          <input
            type="number"
            ref={userCyclesRef}
            defaultValue={props.cycles}
            min={1}
          ></input>
        </div>
        <button type="submit" onClick={handleSubmit} ref={submitRef}>
          Salvar
        </button>
      </form>
    </div>
  );
}
