import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DesignDocument, DesignSection } from "@/lib/types";
import { marked } from "marked";

interface DesignDocumentViewProps {
  document: DesignDocument;
}

export function DesignDocumentView({ document }: DesignDocumentViewProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      case "in_progress":
        return <Badge variant="secondary">In Progress</Badge>;
      case "review":
        return <Badge variant="warning">Review</Badge>;
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getSectionStatusBadge = (status: DesignSection["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "in_progress":
        return <Badge variant="secondary">In Progress</Badge>;
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      case "needs_clarification":
        return <Badge variant="warning">Needs Clarification</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-7xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{document.title}</CardTitle>
          {getStatusBadge(document.status)}
        </div>
        <CardDescription>
          Version: {document.version} | Last Updated:{" "}
          {new Date(document.lastUpdated).toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {document.sections.map((section) => (
            <div key={section.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">{section.title}</h3>
                {getSectionStatusBadge(section.status)}
              </div>
              {section.content ? (
                <div className="prose max-w-none mt-2">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: marked(section.content),
                    }}
                  />
                </div>
              ) : (
                <p className="text-muted-foreground italic">
                  Content will be generated when required information is
                  gathered.
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
