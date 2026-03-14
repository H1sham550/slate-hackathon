const { YoutubeTranscript } = require('youtube-transcript');

async function test() {
  try {
    const videoId = 'dQw4w9WgXcQ'; // Rick Astley
    console.log(`Fetching transcript for ${videoId}...`);
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    console.log('Success! Chunks found:', transcript.length);
    console.log('First chunk:', transcript[0]);
  } catch (err) {
    console.error('Error fetching transcript:', err);
  }
}

test();
