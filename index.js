// General introduction to puppeteer:
// https://www.freecodecamp.org/news/web-scraping-in-javascript-with-puppeteer/

import puppeteer from "puppeteer";
import fs from "fs";

// https://stackoverflow.com/a/77078430
import {setTimeout} from "node:timers/promises";

// https://stackoverflow.com/a/61304202
const waitTillHTMLRendered = async (page, timeout = 30000) => {
  const checkDurationMsecs = 1000;
  const maxChecks = timeout / checkDurationMsecs;
  let lastHTMLSize = 0;
  let checkCounts = 1;
  let countStableSizeIterations = 0;
  const minStableSizeIterations = 3;
  
  while(checkCounts++ <= maxChecks){
    let html = await page.content();
    let currentHTMLSize = html.length; 
    
    let bodyHTMLSize = await page.evaluate(() => document.body.innerHTML.length);
    
    console.log('last: ', lastHTMLSize, ' <> curr: ', currentHTMLSize, " body html size: ", bodyHTMLSize);
    
    if(lastHTMLSize != 0 && currentHTMLSize == lastHTMLSize) 
      countStableSizeIterations++;
    else 
      countStableSizeIterations = 0; //reset the counter
      
      if(countStableSizeIterations >= minStableSizeIterations) {
        console.log("Page rendered fully..");
        break;
      }
      
      lastHTMLSize = currentHTMLSize;
    await setTimeout(checkDurationMsecs);
  }  
};

const getProgram = async (progid) => {
  // Start a Puppeteer session with:
  // - a visible browser (`headless: false` - easier to debug because you'll see the browser in action)
  // - no default viewport (`defaultViewport: null` - website page will be in full width and height)
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
      //      args:['--no-sandbox']
  });
  
  // Open a new page
  const page = await browser.newPage();
  
  // On this new page:
  // - open the "https://catalog.augusta.edu/preview_program.php?poid=10211" website
  // - wait until the dom content is loaded (HTML is ready)
  await page.goto("https://catalog.augusta.edu/preview_program.php?poid=" + progid, {
    waitUntil: "domcontentloaded",
    timeout: 10000,
  });
  
  // We will store the course descriptions in this array.
  const courses = [];
  
  // Get page data
  await page.waitForSelector('.acalog-course > span > a');
  
  // Thank you for this nice loop, https://stackoverflow.com/a/62612102
  // We click on each course, triggering some javascript functions.
  await page.$$eval('.acalog-course > span > a', elHandles => elHandles.forEach(el => el.click()));
  
  // Since most of the edits are made by javascript, we need a "custom" way of making sure the page is done loading:
  await waitTillHTMLRendered(page)
  
  // Now that the page is fully loaded, we can extract from the tables describing each course its content.
  const tables = await page.$$('.td_dark > tbody > tr > td > div:nth-child(2)');
  for (const table of tables)
  {
    // https://github.com/puppeteer/puppeteer/issues/3051#issuecomment-411647065
    const course_details = await page.evaluate(table => table.textContent, table);
    // We push on the courses array
    courses.push(course_details);
  }
  
  // Finally, we write the results to a file.
  await fs.writeFileSync('outputs/' + progid + '.json', JSON.stringify(courses));  

  // Close the browser
  await browser.close();
};

if(process.argv[2] === undefined){
  console.log("Please provide a poid as an argument.")
} else {
  console.log("Now processing program with poid " + process.argv[2]);
  getProgram(process.argv[2]);
}
