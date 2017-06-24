// @flow
import React from 'react';

type Props = {
  isRecording: boolean;
  handleRecord: () => void;
};

export default function RecordSound ({isRecording, handleRecord}: Props) {
  function status () {
    return isRecording ? 'start recording' : 'stop recording';
  }
  return (
    <div>
      <h2>{'RecordSound'}</h2>
      <div onClick={handleRecord}> {status()} </div>
    </div>
  );
}
