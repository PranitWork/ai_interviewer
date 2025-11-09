"use client";


import FeedbackReportCard from "@/app/components/FeedbackReportCard/FeedbackReportCard";


export default function ReportsSection() {

  return (
    <div className="space-y-10">
      {/* ===== HEADER ===== */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Interview Reports</h2>
        <p className="text-voxy-muted text-sm">
          Review your past AI interview reports and performance summaries.
        </p>
      </div>

        <FeedbackReportCard/>

    </div>
  );
}
