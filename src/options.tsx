import { Alert, Box, Button, CircularProgress, Container, Grid, Snackbar, TextField, Typography } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import { loadConfigs, loadGemeniApiKey, saveConfigs, type ExtensionConfig } from "./genemiConfigs"



interface KeySavingComponentProps {
    optionDisplayName: string // Display name for the option
    optionValue: string
    optionKey: keyof ExtensionConfig
    required: boolean
    secretText: boolean
    saverFunc: (keyName: keyof ExtensionConfig, inputRef: React.MutableRefObject<any>, errorMessage?: string) => Promise<void>
    //removerFunc: (keyName: keyof ExtensionConfig) => Promise<void>

}

const OptionBlockComponent: React.FC<KeySavingComponentProps> = ({ optionDisplayName, optionValue, optionKey, required, secretText, saverFunc }) => {
    const [errorText, setErrorText] = useState(null)
    const inputRef = useRef(null);
    const extraProps: Record<string, any> = { type: "password", multiline: true }
    if (secretText) {
        delete extraProps.multiline
    }
    return (
        <Box>

            <Typography variant="h5" >{optionDisplayName} </Typography>
            {optionValue ? null :
                <Box pb={2}>
                    <Typography style={{ color: "rgb(211, 47, 47)" }}>
                        Value for {optionDisplayName} not set!
                    </Typography>
                </Box>
            }
            <Box pt={1} />

            <TextField inputRef={inputRef} defaultValue={optionValue} required={required} error={!!errorText} {...extraProps}
                fullWidth
                label={`set ${optionDisplayName} value`} id="fullWidth"
                helperText={errorText}
            />
            <Button sx={{ marginTop: 1 }} variant="outlined" onClick={(e) => {
                e.preventDefault();
                if (!inputRef.current?.value && required) {
                    setErrorText(`${optionDisplayName} cannot be empty!`)
                    return
                }
                setErrorText(null)
                saverFunc(optionKey, inputRef, null)
            }}>
                <Typography>Save</Typography>
            </Button>

        </Box>
    )
}


const IndexOptions: React.FC<{}> = () => {
    const [currentConfigs, setCurrentConfig] = useState<ExtensionConfig>(null)


    useEffect(() => {
        loadConfigs().then((configs) => setCurrentConfig(configs))
    }, []);

    const saveConfigKey = async (keyName: keyof ExtensionConfig, inputRef: React.MutableRefObject<any>, errorMessage?: string) => {
        const tempExtensionConfig: ExtensionConfig = await loadConfigs()
        tempExtensionConfig[keyName] = inputRef.current.value as string
        saveConfigs(tempExtensionConfig).then(() => {
            console.log("Saved config to storage")
        })
    }

    const removeKeyFromStorage = async (keyName: keyof ExtensionConfig) => {
        const tempExtensionConfig: ExtensionConfig = await loadConfigs()
        tempExtensionConfig[keyName] = null
        saveConfigs(tempExtensionConfig).then(() => {
            console.log("Removed key from storage")
        })
    }

    if (currentConfigs === null) {
        return <CircularProgress />
    }



    return (
        <Box>
            <Container >
                <Typography variant="h3" textAlign="center">Extension Options</Typography>
                <Grid container direction="column" spacing={2}>
                    <Grid item xl>
                        <OptionBlockComponent
                            optionDisplayName="Gemeni Key"
                            optionValue={currentConfigs.gemeniKey}
                            optionKey="gemeniKey"
                            required={true}
                            saverFunc={saveConfigKey} secretText={true}>
                        </OptionBlockComponent>
                    </Grid>
                    <Grid item xl>
                        <OptionBlockComponent
                            optionDisplayName="Gemeni Model"
                            optionValue={currentConfigs.gemeniModel}
                            optionKey="gemeniModel"
                            required={true}
                            saverFunc={saveConfigKey} secretText={false}>
                        </OptionBlockComponent>
                    </Grid>
                    <Grid item xl>
                        <OptionBlockComponent
                            optionDisplayName="Gemeni Prompt"
                            optionValue={currentConfigs.gemeniPrompt}
                            optionKey="gemeniPrompt"
                            required={false}
                            saverFunc={saveConfigKey} secretText={false}>
                        </OptionBlockComponent>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}

export default IndexOptions
