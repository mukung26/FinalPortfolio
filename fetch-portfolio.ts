import fs from 'fs';

async function fetchFile() {
  try {
    const res = await fetch('https://raw.githubusercontent.com/mukung26/OnlinePortfolio/main/index.html');
    const text = await res.text();
    fs.writeFileSync('downloaded_index.html', text);
    console.log('Successfully downloaded index.html!');
  } catch (err) {
    console.error('Error downloading:', err);
  }
}

fetchFile();
