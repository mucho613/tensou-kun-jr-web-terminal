import { Component, createEffect, createSignal } from 'solid-js';
import styles from './TerminalPage.module.css';

const TerminalPage: Component = () => {
  const [text, setText] = createSignal('');

  const [activePort, setActivePort] = createSignal<SerialPort | null>(null);
  const [ports, setPorts] = createSignal<SerialPort[]>([]);

  const [activeWriter, setActiveWriter] = createSignal<WritableStreamDefaultWriter | null>(null)

  const textDecoder = new TextDecoder();

  const connect = async () => {
    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: 70000 });

    setActivePort(port);

    setActiveWriter(port.writable?.getWriter());

    while (port.readable) {
      console.log("Outer loop cycle");
      const reader = port.readable.getReader();
      try {
        while (true) {
          const { value, done } = await reader.read();
          console.log(value);
          if (done) {
            break;
          }
          setText((prev) => prev + textDecoder.decode(value));
        }
      } catch (error) {
        throw new Error("Read error!");
      } finally {
        reader.releaseLock();
      }
    }
  }

  const receive = () => {
    const writer = activeWriter();

    if (!writer) {
      return;
    }

    writer.write(new TextEncoder().encode("02"));
  }

  return (
    <div style={styles}>
      <h1>Tensou-kun Jr. Web Terminal</h1>

      <h2>Web serial port controls</h2>
      <button onClick={connect}>Connect</button>
      <button onClick={receive}>Receive</button>

      <h2>Active port</h2>
      <p>{activePort() ? "Connected" : "Not connected"}</p>
      <p>{JSON.stringify(activePort()?.getInfo())}</p>

      <h2>Available ports</h2>
      <ul>
        {ports().map((port) => <li>{JSON.stringify(port)}</li>)}
      </ul>

      <h2>Terminal</h2>
      <textarea>
        {text()}
      </textarea>
    </div>
  );
};

export default TerminalPage;
