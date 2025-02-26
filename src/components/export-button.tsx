import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { DesignDocument } from "@/lib/types";

interface ExportButtonProps {
  document: DesignDocument;
}

export const ExportButton: FC<ExportButtonProps> = ({ document }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    const path = await open({
      directory: false,
      multiple: false,
      filters: [
        { name: "Text Files", extensions: ["txt"] },
        { name: "All Files", extensions: ["*"] },
      ],
    });

    if (path) {
      setIsExporting(true);
      const content = combineDocumentContent(document);
      const options = {
        format: "txt",
        path: path as string,
        content,
      };

      try {
        await invoke("export_document", { options });
        alert("Document exported successfully");
      } catch (error) {
        alert("Failed to export document");
      } finally {
        setIsExporting(false);
      }
    }
  };

  const combineDocumentContent = (document: DesignDocument): string => {
    // Convert the document content into markdown format
    let markdownContent = `# ${document.title}\n\n`;
    document.sections.forEach((section) => {
      markdownContent += `## ${section.title}\n\n${section.content}\n\n`;
    });
    return markdownContent;
  };

  return (
    <Button onClick={handleExport} disabled={isExporting}>
      {isExporting ? "Exporting..." : "Export Design Document"}
    </Button>
  );
};
