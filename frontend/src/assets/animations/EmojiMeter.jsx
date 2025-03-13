import React, { useEffect } from 'react';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';

const EmojiMeter = ({ mood, size = 100 }) => {
  const STATE_MACHINE_NAME = 'State Machine 1';
  const LEVEL_INPUT_NAME = 'Level';

  const { rive, RiveComponent } = useRive({
    src: 'https://public.rive.app/hosted/8560-16394-emoji-satisfaction-meter.riv',
    stateMachines: [STATE_MACHINE_NAME],
    artboard: 'New Artboard',
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
    autoplay: true
  });

  // Map our mood states to the Rive animation states (1-5)
  const moodToState = {
    'depressed': 1,
    'sad': 2,
    'neutral': 3,
    'happy': 4,
    'overjoyed': 5
  };

  useEffect(() => {
    if (rive && mood) {
      try {
        const inputs = rive.stateMachineInputs(STATE_MACHINE_NAME);
        const levelInput = inputs?.find(input => input.name === LEVEL_INPUT_NAME);
        if (levelInput) {
          levelInput.value = moodToState[mood] || 3;
        }
      } catch (error) {
        console.error('Error setting Rive animation state:', error);
      }
    }
  }, [rive, mood, moodToState]);

  if (!RiveComponent) {
    return <div style={{ width: size, height: size }} />;
  }

  return (
    <div style={{ width: size, height: size }}>
      <RiveComponent />
    </div>
  );
};

export default EmojiMeter; 