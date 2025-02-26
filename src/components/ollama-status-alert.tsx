import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { checkOllamaStatus } from "@/lib/ollama-status";

export function OllamaStatusAlert() {
  const [isOllamaRunning, setIsOllamaRunning] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkStatus = async () => {
    setIsChecking(true);
    const status = await checkOllamaStatus();
    setIsOllamaRunning(status);
    setIsChecking(false);
  };

  useEffect(() => {
    checkStatus();
    // Check status every 15 seconds
    const interval = setInterval(checkStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleInstallOllama = () => {
    open("https://ollama.ai/download");
  };

  if (isOllamaRunning === true) {
    return null;
  }

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Ollama not detected</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <p>
          This application requires Ollama to be running locally. Please make
          sure Ollama is installed and running.
        </p>
        <div className="flex gap-2 mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={checkStatus}
            disabled={isChecking}
          >
            {isChecking ? "Checking..." : "Check Again"}
          </Button>
          <Button variant="default" size="sm" onClick={handleInstallOllama}>
            Download Ollama
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
