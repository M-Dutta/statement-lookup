export const AI_TYPE = {
    GEMENI: "gemeni"
}

export const ActionType = {
    VERIFY_TEXT: "VERIFY_TEXT"
}

export interface actionMessageStructure {
    actionType: string
    aiType: typeof AI_TYPE.GEMENI,
    selectedText: string | undefined
}