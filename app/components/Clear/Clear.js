// @flow
import React from 'react';

type Props = {
  isAuthed: boolean;
  authedId: string;
  onClick: () => void;
}

export default function Clear ({isAuthed, authedId, onClick}: Props) {
  return (
    <div>
      <h2> {'Clear'} </h2>
      <div>{`am I authed? ${isAuthed}, ${authedId}`}</div>
      <div onClick={onClick}>{'clear data'}</div>
    </div>
  );
}
