date: 20-01-2025

Fixed the socket not connecting issue.
Now if the user

date:23-01-2025

Got to know about sessionStorage on client side.
Problem: When I refresh the page the value stored on global context are shared across the tabs and the same user is then logged in to all the tabs.
Solution: Use sessionStroage and tab id so that each tab reperesents unique user

date24-01-2025

Used session storage to set userId and then used that id in global context to serve the whole application.
Problem:

- rejected the usage of tabId as it looks redundant.
- No auth checker in front end
- can't send messages to the user via front-end yet

Fixed :

- Fixed auth checker on the main page
