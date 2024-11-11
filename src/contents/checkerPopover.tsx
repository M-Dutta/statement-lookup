
import { Box, Container, IconButton } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import CloseIcon from '@mui/icons-material/Close';
import { askGemeni } from "../askGenemi";
import Markdown from 'markdown-to-jsx';
import { ActionType, AI_TYPE, type actionMessageStructure } from "../constants";



const QuickFactCheck: React.FC = () => {

    const [open, setOpen] = useState(false)
    const [answer, setAnswer] = useState("")
    const textRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 })


    const handleMouseUp = () => {
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            setPosition({ x: rect.left, y: rect.top })
        }
    };

    const reset = () => {
        setOpen(false)
        setAnswer("")
    }
    const verificationActionListener = async (message: actionMessageStructure, sender: chrome.runtime.MessageSender, sendResponse: (response?: void) => void) => {
        if (message.actionType != ActionType.VERIFY_TEXT) {
            return
        }
        handleMouseUp()
        if (message.selectedText.length < 9 || message.selectedText.trim().split(" ").filter(s => s.trim()).length < 3) {
            setAnswer("Selected Text is too short. It cannot genetate a proper answer.")
            setOpen(true)
            return
        }

        switch (message.aiType) {
            case AI_TYPE.GEMENI:
                askGemeni(message.selectedText).then(ans => setAnswer(ans))
                break
            default:
                setAnswer(`#### AI type: ${message.aiType} is not supported yet.`)
        }
        setOpen(true)
    };

    useEffect(() => {
        document.addEventListener('selectionchange', null);
        chrome.runtime.onMessage.addListener(verificationActionListener)
        return () => {
            if (textRef.current) document.removeEventListener("selectionchange", null);
        }
    }, [open, position, handleMouseUp]);

    if (!open) return null

    /* 
    Plasmo clashes with sx b/c it's wraps contents. 
    so use "style" instead 
    */
    return (
        <Box id={"verify-extension"}
            style={{
                left: position.x + globalThis.scrollX,
                top: position.y + 20 + globalThis.scrollY,
                position: "absolute",
                border: "1px solid rgb(163 201 255)",
                background: "rgb(229, 237, 255)",
                borderRadius: "8px 8px",
                width: 400,
                // visibility This is important as some sites may inject css that can hide this
                visibility: 'visible'
            }}>
            <Container style={{ paddingTop: 4 }}>
                <IconButton aria-label="delete" color="primary"
                    style={{
                        float: 'inline-end',
                        width: 32,
                        background: 'transparent',
                        border: 'none'
                    }}
                    onClick={(e) => { e.preventDefault(); reset() }}>
                    <CloseIcon />
                </IconButton>
            </Container>
            <Container style={{
                fontFamily: 'roboto, sans-serif',
                fontSize: 16,
                overflowWrap: "break-word",
                paddingLeft: 12, paddingRight: 12
            }}>
                <Markdown>{answer || "Loading....."}</Markdown>
            </Container>
        </Box>
    );
}

export default QuickFactCheck