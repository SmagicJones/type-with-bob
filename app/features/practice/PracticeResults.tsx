import { ButtonLink } from "~/components/ui/ButtonLink";
import { Card } from "~/components/ui/Card";
import { Bob, getBobMood } from "~/features/mascot";
import { AttemptSummary, KeyBreakdown } from "~/features/stats";
import type { KeyStats } from "~/features/typing-engine";

import { practiceSearch } from "./params";

type PracticeResultsProps = {
  result: {
    wpm: number;
    accuracy: number;
    elapsedMs: number;
    errors: number;
    keyStats: KeyStats;
  };
  sourceId: string;
  lengthId: string;
};

export function PracticeResults({
  result,
  sourceId,
  lengthId,
}: PracticeResultsProps) {
  return (
    <div className="flex flex-col gap-6">
      <div role="status">
        <h2 className="text-2xl font-bold">Practice complete. Nice work!</h2>
      </div>
      <Bob
        mood={getBobMood({
          kind: "result",
          passed: null,
          accuracy: result.accuracy,
        })}
      />
      <AttemptSummary
        wpm={result.wpm}
        accuracy={result.accuracy}
        elapsedMs={result.elapsedMs}
        errors={result.errors}
      />
      <nav aria-label="Next steps" className="flex flex-wrap gap-3">
        <ButtonLink
          to={`/practice${practiceSearch({ sourceId, lengthId, seed: null })}`}
        >
          Practise again
        </ButtonLink>
        <ButtonLink to="/practice" variant="secondary">
          Change settings
        </ButtonLink>
      </nav>
      <Card aria-labelledby="practice-keys-heading">
        <h3 id="practice-keys-heading" className="mb-3 text-xl font-semibold">
          Key by key
        </h3>
        <KeyBreakdown keyStats={result.keyStats} />
      </Card>
    </div>
  );
}
