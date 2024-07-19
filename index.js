const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.get('/api/pin', async (req, res) => {
  const username = 'SaiSrujanReddyP';
  const repo = 'OnlineCTF-Writeups';

  // Fetch repository data from GitHub API
  const repoData = await axios.get(`https://api.github.com/repos/${username}/${repo}`)
    .then(response => response.data)
    .catch(error => null);

  // Default description if the repository description is null
  const defaultDescription = [
    "This repository contains solutions to the CTFs I have participated in and found intriguing.",
    "Each write-up is meticulously documented, detailing the tools used, the vulnerabilities identified,",
    "and the learning experiences and key takeaways, along with the problem statements.",
    "Feel free to explore the content and don't forget to ⭐ star the repository if you find it helpful! 🚀🔍📚"
  ].join(' ');

  if (!repoData) {
    return res.status(404).send('Repository not found');
  }

  const description = repoData.description || defaultDescription;

  // Wrap the description text with a maximum of 50 characters per line
  const wrappedDescription = description.match(/.{1,50}(\s|$)|\S+?(\s|$)/g).map((line, index) => `
    <text x="20" y="${65 + index * 20}" class="description">${line.trim()}</text>
  `).join('');

  // Calculate the height of the SVG based on the number of lines
  const numberOfLines = wrappedDescription.split('</text>').length;
  const svgHeight = 100 + numberOfLines * 20;

  // Create SVG content
  const svgContent = `
    <svg width="400" height="${svgHeight}" viewBox="0 0 400 ${svgHeight}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="descId">
      <title id="titleId">${repoData.full_name}</title>
      <desc id="descId">${description}</desc>
      <style>
        .header { font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif; fill: #fe428e; }
        .description { font: 400 13px 'Segoe UI', Ubuntu, Sans-Serif; fill: #a9fef7 }
        .gray { font: 400 12px 'Segoe UI', Ubuntu, Sans-Serif; fill: #a9fef7 }
        .icon { fill: #f8d847 }
        .badge { font: 600 11px 'Segoe UI', Ubuntu, Sans-Serif; }
        .badge rect { opacity: 0.2 }
      </style>
      <rect data-testid="card-bg" x="0.5" y="0.5" rx="4.5" height="99%" stroke="#e4e2e2" width="399" fill="#141321" stroke-opacity="1"/>
      <text x="20" y="35" class="header">${repoData.name}</text>
      ${wrappedDescription}
      <text x="20" y="${65 + numberOfLines * 20}" class="gray">Stars: ${repoData.stargazers_count} Forks: ${repoData.forks_count}</text>
    </svg>
  `;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(svgContent);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
