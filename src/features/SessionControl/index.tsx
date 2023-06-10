import { Component, createEffect, createSignal } from "solid-js";

type Props = {
  addText: (text: string) => void;
}

export const SessionControl: Component<Props> = (props: Props) => {
  const [activePort, setActivePort] = createSignal<SerialPort | null>(null);
  const [availablePorts, setAvailablePorts] = createSignal<SerialPort[]>([]);

  const [activeWriter, setActiveWriter] = createSignal<WritableStreamDefaultWriter | null>(null)

  const connect = async () => {
    const textDecoder = new TextDecoder();

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
          props.addText(textDecoder.decode(value));
        }
      } catch (error) {
        throw new Error("Read error!");
      } finally {
        reader.releaseLock();
      }
    }
  }

  createEffect(async () => setAvailablePorts(await navigator.serial.getPorts()));

  createEffect(() => {

  });

  return (
    <>
      <h2>Web serial port controls</h2>
      <button onClick={connect}>Connect</button>

      <h2>Active port</h2>
      <p>{activePort() ? "Connected" : "Not connected"}</p>
      <p>{JSON.stringify(activePort()?.getInfo())}</p>

      <h2>Available ports</h2>
      <ul>
        {availablePorts().map((port, index) =>
          <li>
            {index + 1}: {JSON.stringify(port.getInfo())}
          </li>)}
      </ul>
    </>
  )
}