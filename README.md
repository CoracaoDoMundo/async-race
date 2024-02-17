## Async race app

Study project with RS_School 07/2023, 2nd stage

Deploy: [link](https://coracaodomundo.github.io/async-race/)

This app is simulating the balloons race. The race button initial the series of server requests for each balloon, which are moving (or not) according to the information from the server (velocity, distance and possible errors). The balloon with the fastest speed wins and its data records to the winners table.

If after successful start of the engine next request ends with the error instead of velocity data, the error displayed in text form in the web developer tools console and the balloon stops.

There is also a one balloon flying mode (control by the buttons in each race line), but in this case you can't run the race with the winner result until all the balloons will return on the start position.

### App usage

To experience the app functionality please download the special [API](https://github.com/mikhama/async-race-api) and run it first according to the instruction in the API repository.

__NB!__ Each restart of the API will reset the hangar and race results content.

Enjoy the racing process and let me know if you'll like it!

### Stack:
- Webpack
- TypeScript
- Eslint (airbnb config)
- Prettier
- SCSS
- Implementation on classes, module structure

### Features:
1. Responsive layout (min-width: 500px), design
2. SPA with two different views (hangar and winners table)
3. Pagination for both views
4. Different types of animation
5. Communication with a server (fetch, REST API)
6. Async coding / Promises
7. Server error handling
8. Sort of results in winners table by time and amount of wins