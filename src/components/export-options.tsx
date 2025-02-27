import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ExportOptionsProps {
  open: boolean;
  onClose: () => void;
  onExport: (exportType: "single" | "multiple") => void;
}

export const ExportOptionsDialog: React.FC<ExportOptionsProps> = ({
  open,
  onClose,
  onExport,
}) => {
  const [exportType, setExportType] = useState<"single" | "multiple">("single");

  const handleExport = () => {
    onExport(exportType);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Options</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Export Format</h4>
            <RadioGroup
              value={exportType}
              onValueChange={(value) =>
                setExportType(value as "single" | "multiple")
              }
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="single" id="single" />
                <Label htmlFor="single">Export as a single file</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="multiple" id="multiple" />
                <Label htmlFor="multiple">
                  Export as multiple files (one per section)
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleExport}>Export</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
