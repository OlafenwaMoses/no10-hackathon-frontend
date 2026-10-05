import { useState } from "react";
import { toast } from "sonner";
import { MicrosoftExcelLogoIcon } from "@phosphor-icons/react";
import Button from "../UI/Button";
import Loader from "../UI/Loader";
import useShortlist from "../../hooks/useShortlist";
import buildTrackerSheets from "../../lib/shortlist/buildTrackerSheets";
import writeWorkbook from "../../lib/import/writeWorkbook";

function ShortlistExportButton() {
  const { items } = useShortlist();
  const [isExporting, setIsExporting] = useState(false);

  const exportWorkbook = async () => {
    if (!items || isExporting) return;
    setIsExporting(true);
    try {
      const today = new Date().toISOString().slice(0, 10);
      await writeWorkbook(`${today} GTT Master Tracker.xlsx`, buildTrackerSheets(items));
    } catch (error) {
      toast.error("Couldn't export the tracker", {
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button size="sm" disabled={!items?.length || isExporting} onClick={() => void exportWorkbook()}>
      {isExporting ? <Loader size={14} color="currentColor" /> : <MicrosoftExcelLogoIcon size={14} weight="bold" />}
      Export to Excel
    </Button>
  );
}

export default ShortlistExportButton;
