import { Box, Button, Container, Grid, TextField, Typography } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import { loadConfigs, loadGemeniKey as loadGemeniApiKey, saveConfigs, type ExtensionConfig } from "./shared"



interface KeySavingComponentProps {
    aiName: string
    keyName: "gemeniKey" | "openAIKey" | "claudeAIKey" // Keys must be present in as ExtensionConfig
    keyExists: boolean
    saverFunc: (keyName: keyof ExtensionConfig, inputRef: React.MutableRefObject<any>) => Promise<void>
    removerFunc: (keyName: keyof ExtensionConfig) => Promise<void>
    inputRef: React.MutableRefObject<any>
}

const KeySavingComponent: React.FC<KeySavingComponentProps> = ({ aiName, keyName, keyExists, inputRef, saverFunc, removerFunc }) => {

    return (
        <Box pt={1}>
            {keyExists ? null :
                <Box pb={2}>
                    <Typography style={{ color: "rgb(211, 47, 47)" }}>
                        Gemeni Key does not exist
                    </Typography>
                </Box>
            }
            <TextField inputRef={inputRef} fullWidth
                label="Set API Key" id="fullWidth"
                helperText="Existing API key is not shown for security reasons."
            />
            <Grid container spacing={2}>
                <Grid item>
                    <Button variant="outlined" onClick={(e) => { e.preventDefault(); saverFunc(keyName as keyof ExtensionConfig, inputRef) }}>
                        <Typography>Save Key</Typography>
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="outlined" onClick={(e) => { e.preventDefault(); removerFunc(keyName as keyof ExtensionConfig) }}>
                        Clear Key
                    </Button>
                </Grid>
            </Grid>
        </Box>
    )
}

const IndexOptions: React.FC<{}> = () => {
    const gemeniInputRef = useRef(null)
    const [keyExists, setKeyExists] = useState(true)
    const [revealDangerousOptions, setrevealDangerousOptions] = useState(false)

    const saveKeyToStorage = async (keyName: keyof ExtensionConfig, inputRef: React.MutableRefObject<any>) => {
        if (!inputRef.current?.value) {
            return
        }
        const tempExtensionConfig: ExtensionConfig = {}
        tempExtensionConfig[keyName] = inputRef.current.value as string

        saveConfigs(tempExtensionConfig).then(() => {
            console.log("Saved config to storage")
            setKeyExists(true)
        })
    }

    const removeKeyFromStorage = async (keyName: keyof ExtensionConfig) => {

        const tempExtensionConfig: ExtensionConfig = {}
        tempExtensionConfig[keyName] = null
        saveConfigs({ gemeniKey: null }).then(() => {
            console.log("Removed key from storage")
            setKeyExists(false)
        })
    }

    const dumpKeys = async () => {
        console.log(await loadConfigs())
    }

    useEffect(() => {
        loadGemeniApiKey().then((res) => {
            if (!res) setKeyExists(false)
        })
    }, []);

    return (
        <Box id={"fact-popup"}>
            <Container style={{ paddingTop: 12 }}>
                <Typography variant="h4">Gemeni Key</Typography>
                <KeySavingComponent aiName={"Gemeni"} keyName={"gemeniKey"} keyExists={keyExists} saverFunc={saveKeyToStorage} removerFunc={removeKeyFromStorage} inputRef={gemeniInputRef} />
            </Container>
            <Container>
                <Box pt={2}>
                    <Button variant="outlined" color={!revealDangerousOptions ? "error" : "primary"}
                        onClick={(e) => { e.preventDefault(); setrevealDangerousOptions(!revealDangerousOptions) }}>
                        {!revealDangerousOptions ? "Reveal" : "Hide"} Dangerious Options
                    </Button>
                </Box>
                {!revealDangerousOptions ? null :
                    <Container sx={{ marginTop: 1, padding: 2, border: "1px solid rgb(139 0 0 / 21%)" }}>
                        <Button variant="outlined" color="error" onClick={() => dumpKeys()}>Dump Config to Console</Button>
                        <Typography variant="body2" color={"darkred"}>
                            Warning: This will also reveal API key!<br />
                            Make sure you're in a secure location and no one is able to see this.
                        </Typography>
                    </Container>
                }
            </Container>
        </Box>
    )
}

export default IndexOptions