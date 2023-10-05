export const apiKey = process.env.REACT_APP_API_KEY

export const dummyMessages = [
    {
        role: 'user',
        content: 'How are you?'
    },
    {
        role: 'assistant',
        content: 'I\'m fine, how may I help you today?'
    },
    {
        role: 'user',
        content: 'Create an image of a dog playing with a cat'
    },
    {
        role: 'assistant',
        content: 'https://storage.googleapis.com/pai-images/ae74b3002bfe4b538493ca7aedb6a300.jpeg'
    },
]