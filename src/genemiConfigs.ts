export const TestAnswer = "Placeholder -- Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. "
export const TestAiName = "Gemeni"

export const defaultModel = "gemini-2.0-flash"
export const defaultPrompt = ("Can you lookup and give me some more context about this statement? " +
    "Provide evidence or sources to support your context. Link to reputable news articles if possible. Try to be compact")


export interface ExtensionConfig {
    gemeniKey?: string | null
    gemeniPrompt: string
    gemeniModel: string
}

export const loadConfigs = async () => {
    const options: ExtensionConfig = { gemeniKey: null, gemeniModel: defaultModel, gemeniPrompt: defaultPrompt }
    const config = await chrome.storage.sync.get(options)
    return config as ExtensionConfig
}


export const saveConfigs = async (config: ExtensionConfig) => {
    await chrome.storage.sync.set(config)
    return await chrome.storage.sync.get(config)
}


export const loadGemeniApiKey = async () => {
    const config = await loadConfigs()
    return config.gemeniKey
}

export const loadGemeniModel = async () => {
    const config = await loadConfigs()
    return config.gemeniModel
}

export const loadGemeniPrompt = async () => {
    const config = await loadConfigs()
    return config.gemeniPrompt
}