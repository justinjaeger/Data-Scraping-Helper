const puppeteer = require('puppeteer');
const fs = require('fs');
const { hasUncaughtExceptionCaptureCallback } = require('process');

// Change: made subcategory a default param since you were effectively doing that already
const scrape = (url) => {

  console.log(`Scraping fresh data for ${url}...`);
  
  return new Promise( async (resolve, reject) => {
    // Launch headless browser and await page/DOM load
    const browser = await puppeteer.launch({headless : false});
    const page = await browser.newPage();
    await page.goto(url);
    
    const output = {
      question : {
        qTitle: null, 
        category: null,
        subCategory: null,
        qText: null,
        // unique eight-digit identifier for the question
        qId: null,
        // unique six-digit identifier for the user who asked it
        uId: null,
        // motherfuckers call their dates weird shit but I want this program to be fast so idk how heavily I want to be manipulating date objects each time I collect them 
        dateText: null,
        // change to todays date (format: mmddyy)
        dateCollected: 041421,
      }, 
      answers: [{
        aText: null,
        qId: null,
        uId: null,
        // T/F for whether this answer was the "best" stored as a binary (0 for F 1 for T)
        isBest: 0,
        dateText: null,
      }],
      users: [{
        uId: null,
        uName: null,
        numAns: null,
        percentBest: null,
        level: 0,
        points: null,
      }],
    };

    // Select the question and answer container
    output = await page.$eval('div[id^="qnaContainer"]', (qna, url, output) => {
      // select the array of answers '[class^="AnswersList__container"]'
      const answers = qna.querySelectorAll('[class^="Answer__answer__"]');
      // change the single objects in answers and users to an array of the same size as the array of answers
      output.answers = Array(answers.length).fill(output.answers[0]);
      output.users = Array(answers.length + 1).fill(output.users[0]);
      // select the question 
      console.log('qna: ', qna);
      // select&add the title
      output.question.qTitle = qna.querySelector('[class^="Question__title"]').innerText;
      // select the category and subcategory
      const subtitle = qna.querySelectorAll('[class^="Question__subtitle"] > a');
      // add the category
      output.question.category = subtitle[0].innerText;
      // add the subcategory
      if(subtitle[1]) output.question.subCategory = subtitle[1].innerText;
      // select&add the text
      output.question.qText = qna.querySelector('[class^="Question__contentWrapper"] > div > p').innerText;
      // select & add what it says the date is
      // select & add the user's name to both question & users[currUser]
      const user = qna.querySelector('[class^="UserProfile__userName"]').innerText;
      // if the user's name is '?', leave it null
      if (user !== '?' && user !== "Anonymous") {
        output.users[0].uName = user;
      }
      // mouse over the user profile
      
      // if we don't have their name, see if it shows up now. If it doesn't, add the name as '?'
      // generate&add a qId
      // select & store their number of answers
      // select & store their percent best answers
      // select & store their level (if there is one)
      // select & store their points
      // iterate through the answers array
      for (let i = 0; i < answers.length; i += 1) {
        // check if this is the best answer. change answers[i] to 1 if it is
        if (answers[i].querySelector('[class^="Answer__bestAnswerBadge"]')) {
          output.answers[i].isBest = 1;
          console.log('was best ', output.answers[i].isBest);
        }
        // select & add what it says the date is
        output.answers[i].dateText = answers[i].querySelector('[class^="Answer__subtitle__"]').innerText;
        // select & add the text
        output.answers[i].aText = answers[i].querySelector('[class^="ExpandableContent__content"] > p').innerText;
        // select & add the user's name to both the answer & users[i]
        const user = answers[i].querySelector('[class^="UserProfile__userName__"]').innerText;
        // if the user's name is '?', leave it null
        if (user !== '?' && user !== "Anonymous") {
          output.users[i+1].uName = user;
        }
        // mouse over the user profile
        // if we don't have their name, see if it shows up now. If it doesn't, add the name as '?'
        // select & store their number of answers
        // select & store thxeir percent best answers
        // select & store their level (if there is one)
        // select & store their points
        // add the qId
      }
      return output;
    }, url, output);
    
    console.log(output);
    // browser.close();

    // Store output ((null, 2) argument is for readability purposes)
    fs.writeFile(`outputs/butthole.json`, JSON.stringify(output), err => {
      if(err) reject(err);
      else resolve('Saved Successfully!')
    });
  });
};

// module.exports = scrape;
scrape('https://answers.yahoo.com/question/index?qid=20070220122356AAhiuDH')
