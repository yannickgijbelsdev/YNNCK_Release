import { Card } from "@/components/Bits";
import { toCard } from "@/lib/api";

export const ExperienceCards = ({ q, exclude, prefix }) => {
  if (q.isLoading)
    return <div className="cards3 c4" data-testid="experiences-loading">{[0, 1, 2, 3].map((i) => <div key={i} className="c3 k exp-skel" />)}</div>;
  if (q.isError)
    return (
      <div className="exp-msg" data-testid="experiences-error">
        Couldn’t load the experiences right now. <button onClick={() => q.refetch()} data-testid="experiences-retry">Try again</button>
      </div>
    );
  const cards = q.data.map(toCard).filter((c) => c.id !== exclude);
  if (!cards.length) return <div className="exp-msg" data-testid="experiences-empty">New experiences are coming soon.</div>;
  return (
    <div className={`cards3${cards.length === 4 ? " c4" : ""}`}>
      {cards.map((c) => <Card key={c.id} c={c} testid={`${prefix}-${c.id}`} />)}
    </div>
  );
};
