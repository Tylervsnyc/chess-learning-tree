'use client';

import { TutorialFlow } from '@/components/tutorial/TutorialFlow';

export default function TestTutorialPage() {
  return (
    <div className="h-full overflow-auto">
      <TutorialFlow
        lessonId="test"
        onComplete={(correct, wrong) => {
          alert(`Tutorial complete! Correct: ${correct}, Wrong: ${wrong}`);
        }}
      />
    </div>
  );
}
