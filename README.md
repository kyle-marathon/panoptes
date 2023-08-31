```
npm install
npm start
```

```
npm run deploy
```

To use mock data (for slightly faster development), set the isOnlineState atom.
Warning: this will mess up the database if you submit data

Nice to have features

- Substacks can be reordered
- Little graphs showing progress
- - Graph showing progress in sprint
- - Graphs inline with progress tasks
- - Show progress relative to progress in sprint like in Linear
- Shiny pokemon
- - Can be done with new sprites, or "custom shinys" by rotating hues
- - Hue-rotate(180) + invert = dark pokemon

Performance

- New Item Input forces all of App to reload when you type
- Memoize Team

Battle System

- Maybe points give you access to battles, or new battle areas
- - Winner battles lets you unlock things
- - Something like FE Heroes timing mechanic
- - - You want to play every day, but not more than ~15 minutes a day
- Other things to unlock
- - Moves for pokemon
- - New pokemon "packs"
- - - Like in Yu-Gi-Oh Eternal Duelist Soul
- Battle frinds online
- - Maybe this just happens at the end of each arc

Pokemon System

- Party management, only 6 active at a time
- Drag and Drop to reorder
- Pokemon have movesets
- More refined Pkd per task completion mechanics
- - Frequency tasks: count as subtasks until you've completed the last one of the arc
- - Repeat tasks: count as subtasks until you've completed them all
- - Requirement tasks: Once enough subtasks are complete, main task is automatically completed

Open questions

- How to keep game interesting?
- - Fill out pokedex
- - - You catch a new pokemon about once every 2 days
- - - - But realy hard to catch rare pokemon
- - New pokemon have to be worth using
- - - But shouldn't feel like your team is constantly getting replaced
- - - Would be good if pokemon were more situational and tactical
- - Maybe you enter new "regions" and have to soft restart
- - Continuously ramping up all numbers eventually just feels ridiculous

New Features

- More fleshed out sprint
- - Sprints have cool names (maybe named after pokemon)
- - At the end of the sprint
- - - Tasks get carried over or deleted
- - - - Maybe you can mark tasks as always getting carried over
- - - Review and catalogue results
- - - Set start date to previous end date, and pick new end date
- - - - Default is based on previous interval

- A lightway way to track data
- - Add a "datatable" to a task
- - E.g.
- - - Track your energy levels day to day
- - - Track your run times or lifts
- - - Takes notes on the books you liked
- - Basically all of this is just a datable with numbers or strings
- - - And "numbers" can really be ratings
- - Generate little graphs or export data as cvs, or open in Google Sheets
- Happiness/Energy tracking Example
- - Automatically creates a new row each day
- - Cols are date, feeling, and notes

- Spaced reptition
- - Not used for remembering info, used for the actual tasks
- - https://guzey.com/things/software/anki/
- - E.g.
- - - When I get in bed at night, I start reading a book
- - - When I wake up in the morning, I complete Japanese flash cards
- - "Completion" is based on whether or not you actually subsequently complete the task

Not required

- Don't write to db when offline
- Tasks are slightly off center

Naming

- isEditor => Type
- title => content

  Todo

- Move task menu into buttons that appear on hover [DONE]
- Reordering icons only appear on hover [DONE]
- When a new subtask is created set focus to the new subtask input field [DONE]
- New item input field should match style of new items [DONE]
- Remove editor toolbar border [DONE]
- Loading screen never ends if tasks is empty [DONE]
- Editor can be dragged and dropped [DONE]
- Editor mysterious adds new lines [DONE]
- Dragging editors is weird [DONE]
- When created, editor bolds first line [DONE]
- Editors can be deleted [DONE]
- Editor <> Task conversion [DONE]
- Subtasks can be text editors [DONE]
- Interactions between Required/Times/Frequency [DONE]
- - If subitems are completed, main task should be marked complete
- - Then main task cannot be marked "uncompleted"
- - In general, main task cannot be marked complete or incomplete if it has the requirements field
- Items get crossed out on completion [DONE]
