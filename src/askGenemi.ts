import { GoogleGenerativeAI } from "@google/generative-ai"
import { loadConfigs, loadGemeniApiKey } from "./genemiConfigs";

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
    const configs = await loadConfigs()

    if (!configs.gemeniKey) {
        return Promise.resolve("Gemeni API key not set. " +
            "Please open extension options and set the API key. " +
            "[See Gemeni API doc](https://ai.google.dev/gemini-api/docs/api-key) on how to get the API key."
        )
    }

    if (!configs.gemeniModel) {
        return Promise.resolve("Gemeni Model alias not set" +
            "Please open extension options and set gemeni model alias; eg -- gemini-2.0-flash" +
            "See [Gemeni Model(s)](https://ai.google.dev/gemini-api/docs/models/gemini) for all the options"
        )
    }

    if (!configs.gemeniPrompt) {
        return Promise.resolve("Gemeni Prompt alias not set" +
            "This plugin needs a prompt to send over to gemeni along with the statement." +
            "Please open extension options and set a prompt. If you are unsure of what to prompt," +
            `you can just copy paste this (default prompt) --\n{defaultPrompt}`
        )
    }

    const genAI = new GoogleGenerativeAI(configs.gemeniKey);
    const model = genAI.getGenerativeModel({ model: configs.gemeniModel });
    const conditions = configs.gemeniPrompt
    const wrappedQuery = `"${query}". ${conditions}`

    try {
        const result = await model.generateContent(wrappedQuery)
        return result.response.text()
    } catch (e: any | Error) {
        console.log(e)
        return e.message
    }
}