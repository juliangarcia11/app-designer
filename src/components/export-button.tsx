import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { invoke } from "@tauri-apps/api/core";
import { open, save } from "@tauri-apps/plugin-dialog";
import { DesignDocument } from "@/lib/types";
import { ExportOptionsDialog } from "./export-options";
import { toast } from "sonner";

interface ExportButtonProps {
  document: DesignDocument;
}

export const ExportButton: FC<ExportButtonProps> = ({ document }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const handleExportClick = () => {
    setShowOptions(true);
  };

  const handleExport = async (exportType: "single" | "multiple") => {
    if (exportType === "single") {
      await exportSingleDocument();
    } else {
      await exportMultipleDocuments();
    }
  };

  const exportSingleDocument = async () => {
    const path = await save({
      filters: [
        { name: "Markdown", extensions: ["md"] },
        { name: "Text Files", extensions: ["txt"] },
        { name: "All Files", extensions: ["*"] },
      ],
    });

    if (!path) return; // User cancelled

    setIsExporting(true);
    const content = combineDocumentContent(document);
    const options = {
      format: "md",
      path: path as string,
      content,
    };

    try {
      await invoke("export_document", { options });
      toast.success("Document exported successfully");
    } catch (error) {
      toast.error(`Failed to export document: ${error}`);
    } finally {
      setIsExporting(false);
    }
  };

  const exportMultipleDocuments = async () => {
    const directoryPath = await open({
      directory: true,
      multiple: false,
    });

    if (!directoryPath) return; // User cancelled

    setIsExporting(true);

    try {
      // Create documents array from sections
      const documents = document.sections.map((section) => ({
        title: section.title,
        content: section.content,
      }));

      await invoke("export_multiple_documents", {
        options: {
          format: "md",
          directory_path: directoryPath,
          documents,
        },
      });

      toast.success("Documents exported successfully");
    } catch (error) {
      toast.error(`Failed to export documents: ${error}`);
    } finally {
      setIsExporting(false);
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
    <>
      <Button
        onClick={handleExportClick}
        disabled={isExporting}
        className="w-full md:w-auto"
      >
        {isExporting ? "Exporting..." : "Export Design Document"}
      </Button>

      <ExportOptionsDialog
        open={showOptions}
        onClose={() => setShowOptions(false)}
        onExport={handleExport}
      />
    </>
  );
};
