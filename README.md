# Yahoo scraper
Will scrape Yahoo! pages, pulling the following information from each: 
1. The question
  -its headline (str)
  -Unique 8-char question identifier
  -its text (str)
  [OR would it be more space / time efficient to seperate those elements programatically at some point? The headline could be used for some time efficiencies during searching.]
  -the asker's name (str) [could also be saved ]
  -the date (date -- if there is a sql date obj. Num otherwise.)
  -any tags (saved as an array of strs)
  -# of answers (num)
2. Any answers
  -Unique 8-char question identifier
  -Unique 6-char user profile identifier
  -their text (str)
  -the username (if "?" save as whatever null val uses the least space)
  -whether it was best (binary)
  -how long they were posted after the question in minutes (num)
  [you get your date objs from there]
3. User profiles 
  -Unique 6-char user profile identifier
  -for the askers and answerers
  -If the db contains that user (need to find a unique&consistent yahoo-side identifier), skip
  -Else go through to their profile and log:

And save them in a SQL db partitioned into those three tables (questions, answers, and users). TBD: Scheme for inter-table identifiers

Note: 

-call scripts from main directory -- scripts/script.js -- so it writes files to proper relative location.

-size of a full html-only yahoo answers page is 100 kb. I want to aim for 5 kb
