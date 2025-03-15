import { ActionType, AI_TYPE, type actionMessageStructure } from "./constants"

export { }

chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
        title: 'Lookup Statement "%s"',
        contexts: ["selection"],
        id: "factCheck"
    })
})

// Dropdown action Handler
chrome.contextMenus.onClicked.addListener(async function (info, tab) {
    if (!tab?.id) {
        return
    }
    const actionMessage: actionMessageStructure = {
        actionType: ActionType.VERIFY_TEXT,
        aiType: AI_TYPE.GEMINI,
        selectedText: info.selectionText
    }
    chrome.tabs.sendMessage(tab.id, actionMessage)
})