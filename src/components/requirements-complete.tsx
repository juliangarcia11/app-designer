import { Button } from "./ui/button";

// Component for displaying completion message when all questions are answered
export const RequirementsComplete: React.FC<{ onViewDocument: () => void }> = ({
  onViewDocument,
}) => (
  <div className="text-center p-8">
    <h3 className="text-xl font-semibold mb-4">
      All questions have been answered!
    </h3>
    <p className="mb-6">
      We have gathered all the information needed to complete your design
      document.
    </p>
    <Button onClick={onViewDocument}>View Design Document</Button>
  </div>
);
