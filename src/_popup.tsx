
import { Box, Button, Container, Divider, makeStyles, Typography } from "@mui/material";
import { useRef, useState } from "react"
import Answer, { type AnswerProps } from "~answer"
import SearchBox from "./searchBox"
import { TestAiName, TestAnswer } from "~genemiConfigs";


function Popup() {

  const [answers, setAnswers] = useState<AnswerProps[]>([])
  const answerCacheMap = useRef(new Map())

  const getFromCache = (query: string) => {
    let answerProps: AnswerProps[] | undefined = answerCacheMap.current.get(query.trim().toLowerCase())
    return answerProps
  }

  const addToCache = (query: string, answerProps: AnswerProps[]) => {
    answerCacheMap.current.set(query.trim().toLowerCase(), answerProps)
    if (answerCacheMap.current.size > 100) {
      for (const [key, value] of answerCacheMap.current) {
        answerCacheMap.current.delete(key);
        break;
      }
    }
  }


  const handleSearch = (e: React.MouseEvent<SVGSVGElement, MouseEvent>, searchQuery: string) => {
    searchQuery = searchQuery.trim()
    if (!searchQuery) return
    console.debug(searchQuery)

    let answerProps = getFromCache(searchQuery)
    if (answerProps) {
      console.debug(`Found record for Query: ${searchQuery}`)
      setAnswers(answerProps)
      return
    }
    answerProps = [{ aiName: TestAiName, answer: TestAnswer }]
    setAnswers(answerProps)
    addToCache(searchQuery, answerProps)
  }

  return (
    <Box id="fact-checker">
      <Container id="title" style={{ justifyItems: "center" }}>
        <Typography variant="h6">Fact Checker</Typography>
      </Container>
      <Divider />

      <Container style={{ paddingTop: "8px" }}>
        <SearchBox searchHandler={handleSearch} />
      </Container>

      <Container style={{ paddingTop: "8px" }}>
        {answers.map((prop) => {
          return (<Answer aiName={prop.aiName} answer={prop.answer} />)
        })}
        {
          answers.length === 0 ? null :
            <Button variant="outlined" color="primary"
              sx={{
                float: 'inline-end',
                marginTop: '4px',
                marginBottom: '4px',
                marginRight: '6px'
              }}
              onClick={(e) => { e.preventDefault(); setAnswers([]) }}>Clear</Button>
        }
      </Container>
    </Box>
  )
}

export default Popup
