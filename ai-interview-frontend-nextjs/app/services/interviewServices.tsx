// Purpose: Thin service wrapper around Redux thunks / API calls
// =============================
"use client";


import { asyncStartInterview, asyncEvaluateInterview } from "@/app/Store/actions/interviewActions";
import { generateFeedback } from "@/app/Store/actions/feedbackAction";


export async function svcStartInterview(dispatch: any, role: string, details: string) {
return await dispatch(asyncStartInterview({ role, details }));
}


export async function svcEvaluateQuestion(
dispatch: any,
interviewId: string,
question: string,
answer: string
) {
return await dispatch(asyncEvaluateInterview(interviewId, question, answer));
}


export async function svcGenerateReport(dispatch: any, interviewId: string) {
return await dispatch(generateFeedback({ interviewId }));
}