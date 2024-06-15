import { useState, useEffect } from 'react';
import { Typography, Box, Card, CardHeader, CardContent } from '@mui/material';
import './App.css';

const allowedHosts = ['leetcode.com'];
const problemNameRegex = /problems\/([^\/]+)\//;

type QuestionInfo = {
  categoryTitle: string;
  difficulty: string;
  dislikes: number;
  likes: number;
  questionId: string;
  title: string;
  titleSlug: string;
};

function App() {
  const [allow, setAllow] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [questionInfo, setQuestionInfo] = useState<QuestionInfo>(
    {} as QuestionInfo
  );

  const queryQuestionInfo = `
   query questionTitle($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
        questionId
        questionFrontendId
        title
        titleSlug
        difficulty
        likes
        dislikes
        categoryTitle
      }
    }
  `;

  const fetchQuestionInfo = async (titleSlug: string) => {
    chrome.runtime.sendMessage(
      {
        action: 'fetchQuestionInfo',
        titleSlug,
        queryQuestionInfo,
      },
      (response) => {
        if (response.success) {
          setQuestionInfo(response.data.data.question);
        } else {
          console.error('Fetch error:', response.error);
        }
      }
    );
  };

  useEffect(() => {
    chrome?.tabs?.query({ active: true, currentWindow: true }, function (tabs) {
      const url = tabs[0].url;
      const host = url && new URL(url)?.host;
      if (host && allowedHosts.includes(host)) {
        const match = url && url.match(problemNameRegex);
        const possibleProblemName = match ? match[1] : null;
        possibleProblemName && fetchQuestionInfo(possibleProblemName);
        setAllow(true);
      } else {
        setAllow(false);
      }
    });
  }, []);

  return (
    <Box
      display='flex'
      flexDirection='column'
      justifyContent='flex-start'
      alignItems='center'
      textAlign='center'
      paddingTop='20px' // Adjust the padding to your preference
    >
      <Typography variant='h5' gutterBottom>
        {' '}
        {/* gutterBottom adds space below the text */}
        Project pain
      </Typography>
      {allow ? (
        <Card sx={{ backgroundColor: '#3c3c3c', color: 'white' }}>
          <CardHeader title='Problem Details' />
          <CardContent>
            <Typography variant='body2' color='white' component='p'>
              Problem ID: {questionInfo?.questionId}
            </Typography>
            <Typography variant='body2' color='white' component='p'>
              Problem Title: {questionInfo?.title}
            </Typography>
            <Typography variant='body2' color='white' component='p'>
              Likes: {questionInfo?.likes}
            </Typography>
            <Typography variant='body2' color='white' component='p'>
              Dislikes: {questionInfo?.dislikes}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Typography>No</Typography>
      )}
    </Box>
  );
}

export default App;
