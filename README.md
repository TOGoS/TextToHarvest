# TextToHarvest

Analyzes a text file to sum up hours you've worked and optionally uploads to Harvest,
including linking to Jira tickets.


## Text file format

```
# Lines starting with '#' are ignored.
# Lines of the form '= yyyy-mm-dd (...)' indicate that the following lines
# are hours for that day.
# Lines of the form 'hh:mm-hh:mm\t<project code>\t<notes>'
# indicate hours worked on whatever project code.

= 2017-01-02 (Blendsday)

08:00-10:30	earthit/log	Entered my hours, woo!
10:30-13:45	some-client/TICKET-123/dev	Did very important work on this ticket.
13:45-14:15	some-client/TICKET-234/code-review	Rejected Jim's terrible pull request
# Bike ride

= 2017-01-03 (Flursday)

01:30-03:45	some-client/TICKET-123/deploy	Deploy to production
# Slept a lot
12:00-13:00	earthit/tech-talk	Learned about bringment of sponges.
# Fell asleep again
```

Project codes are mapped to harvest project/task IDs
(and optionally a prefix for notes and a link) by
```projectCodeToHarvestEntry.js```.
You will probably need to add cases to that function specific to whatever projects/tasks you're working on.


## Harvest API config

Copy ```harvest-api.config.json.example``` to ``harvest-api.config.json```
in the working directory from which you will be calling ```analyze```,
and add your username and password.


## Filtering

You can list a large number of entries in a single text file;
```analyze``` takes ```--start-date=yyyy-mm-dd``` and ```--end-date=yyyy-mm-dd```
(or ```--week-ending=yyyy-mm-dd```) arguments to filter the entries analyzed/uploaded.

```--upload-to-harvest``` tells ```analyze``` to convert entries to harvest entries,
and, if successful, delete all harvest entries for those days and replace them with
the entries from your log file.
