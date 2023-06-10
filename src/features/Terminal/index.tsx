
import { Component, createSignal } from 'solid-js';

type Props = {
  text: string;
}

export const Terminal: Component<Props> = (props: Props) => {
  return (
    <>
      <h2>Terminal</h2>
      <textarea>
        {props.text}
      </textarea>
    </>
  );
};