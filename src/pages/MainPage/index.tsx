import { Component, createEffect, createSignal } from 'solid-js';
import styles from './MainPage.module.css';
import { Terminal } from '../../features/Terminal';
import { SessionControl } from '../../features/SessionControl';

const MainPage: Component = () => {
  const [text, setText] = createSignal('');

  const addText = (text: string) => {
    setText(existsText => existsText + text);
  }

  return (
    <div style={styles}>
      <h1>Tensou-kun Jr. Web Terminal</h1>

      <SessionControl addText={addText} />

      <Terminal text={text()} />
    </div>
  );
};

export default MainPage;
