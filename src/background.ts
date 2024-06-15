chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
    if (request.action === 'fetchQuestionInfo') {
      const { titleSlug, queryQuestionInfo } = request;
  
      fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: queryQuestionInfo,
          variables: { titleSlug },
        }),
      })
        .then(response => response.json())
        .then(data => sendResponse({ success: true, data }))
        .catch(error => sendResponse({ success: false, error: error.message }));
  
      return true; // Will respond asynchronously
    }
  });