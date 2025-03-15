export const AI_TYPE = {
    GEMINI: "gemini"
}

export const ActionType = {
    VERIFY_TEXT: "VERIFY_TEXT"
}

export interface actionMessageStructure {
    actionType: string
    aiType: typeof AI_TYPE.GEMINI,
    selectedText: string | undefined
}