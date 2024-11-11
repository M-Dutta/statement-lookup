import { GoogleGenerativeAI } from "@google/generative-ai"
import { loadGemeniKey } from "~shared";

interface CandidatesEntity {
    content: Content;
    finishReason: string;
    index: number;
    safetyRatings?: (SafetyRatingsEntity)[] | null;
}
interface Content {
    parts?: (PartsEntity)[] | null;
    role: string;
}
interface PartsEntity {
    text: string;
}
interface SafetyRatingsEntity {
    category: string;
    probability: string;
}
interface UsageMetadata {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
}

export interface GemeniResponse {
    candidates: (CandidatesEntity)[];
    usageMetadata: UsageMetadata;
    modelVersion: string;
}


export const askGemeni = async (query: string) => {
    const gemeniKey = await loadGemeniKey()
    if (!gemeniKey) {
        return Promise.resolve("Gemeni API key not set. " +
            "Please open extension settings and set the API key. " +
            "[See Gemeni API doc](https://ai.google.dev/gemini-api/docs/api-key) on how to get the API key."
        )
    }

    const genAI = new GoogleGenerativeAI(gemeniKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const conditions = ("Can you verify this fact? Please be sure to double check." +
        "Keep the response short and give some sources."
        //"Be as detailed as possible and provide sources."
    )
    const wrappedQuery = `"${query}". ${conditions}`

    try {
        const result = await model.generateContent(wrappedQuery)
        return result.response.text()
    } catch (e: any | Error) {
        console.log(e)
        return e.message
    }
}