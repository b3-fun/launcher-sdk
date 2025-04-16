import B3WebSDK from '../src';

// Initialize the SDK with your API key
const sdk = new B3WebSDK({
  releaseType: "embedded",
  debug: true, // Enable debug logging,
  overwriteJwt: "{JWT from https://basement.fun/developers/playground}"
});
  
const channelStatus = async () => {
  return await sdk.getChannelStatus();
}

const activity = async () => {
  return await sdk.sendCustomActivity("test label", "test eventid");
}

const setState = async () => {
  return await sdk.setState("sdk-test", {
    test: "test",
    a: [1,2,3]
  });
}

const state = async () => {
  return await sdk.getState("sdk-test");
}

const setScore = async () => {
  return await sdk.setUserScore(100, "123");
}

const getScore = async () => {
  return await sdk.getUserScores(100, 0);
}



// Run examples
async function runExamples() {
  try {
    console.log('--- Channel Status ---');
    const channelStatusRes = await channelStatus();
    console.log(JSON.stringify(channelStatusRes, null, 2));  

    console.log('\n--- Custom Activity ---');
    const activityRes = await activity();
    console.log(JSON.stringify(activityRes, null, 2));

    console.log('\n--- Set State ---');
    const setStateRes = await setState();
    console.log(JSON.stringify(setStateRes, null, 2));

    console.log('\n--- Get State ---');
    const stateRes = await state();
    console.log(JSON.stringify(stateRes, null, 2));

    console.log('\n--- Set User Score ---');
    const setScoreRes = await setScore();
    console.log(JSON.stringify(setScoreRes, null, 2));

    console.log('\n--- Get User Scores ---');
    const getScoreRes = await getScore();
    console.log(JSON.stringify(getScoreRes, null, 2));
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

runExamples(); 