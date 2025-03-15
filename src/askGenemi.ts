import { GoogleGenerativeAI } from "@google/generative-ai"
import { loadConfigs, loadGeminiApiKey } from "./genemiConfigs";

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

export interface GeminiResponse {
    candidates: (CandidatesEntity)[];
    usageMetadata: UsageMetadata;
    modelVersion: string;
}



export const askGemini = async (query: string) => {
    const configs = await loadConfigs()

    if (!configs.geminiKey) {
        return Promise.resolve("Gemini API key not set. " +
            "Please open extension options and set the API key. " +
            "[See Gemini API doc](https://ai.google.dev/gemini-api/docs/api-key) on how to get the API key."
        )
    }

    if (!configs.geminiModel) {
        return Promise.resolve("Gemini Model alias not set" +
            "Please open extension options and set gemini model alias; eg -- gemini-2.0-flash" +
            "See [Gemini Model(s)](https://ai.google.dev/gemini-api/docs/models/gemini) for all the options"
        )
    }

    if (!configs.geminiPrompt) {
        return Promise.resolve("Gemini Prompt alias not set" +
            "This plugin needs a prompt to send over to gemini along with the statement." +
            "Please open extension options and set a prompt. If you are unsure of what to prompt," +
            `you can just copy paste this (default prompt) --\n{defaultPrompt}`
        )
    }

    const genAI = new GoogleGenerativeAI(configs.geminiKey);
    const model = genAI.getGenerativeModel({ model: configs.geminiModel });
    const conditions = configs.geminiPrompt
    const wrappedQuery = `"${query}". ${conditions}`

    try {
        const result = await model.generateContent(wrappedQuery)
        return result.response.text()
    } catch (e: any | Error) {
        console.log(e)
        return e.message
    }
}