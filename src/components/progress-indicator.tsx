import { Progress } from "./ui/progress";

// Component for the progress indicator
export const ProgressIndicator: React.FC<{
  completed: number;
  total: number;
  percentage: number;
}> = ({ completed, total, percentage }) => (
  <div className="mb-6">
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm font-medium">
        Requirements gathering progress
      </span>
      <span className="text-sm">
        {completed} / {total} questions
      </span>
    </div>
    <Progress value={percentage} className="h-2" />
  </div>
);
