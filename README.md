# Movie app frontend
## Installation
1. Install [Docker](https://docs.docker.com/engine/install/) based on your Operation System
2. Make a [The Movie DataBase](https://www.themoviedb.org/signup) account
3. Get your [API key](https://www.themoviedb.org/settings/api) and copy
4. In the src copy and rename the .env_example to .env
5. Paste your api key in the .env
6. Setup the backend proxy in the ```vite.config.js```
7. (optional) If you want to use my [sample backend](https://github.com/SunyiUborka/Movie-backend), you don't need to set up a proxy
8. Run ```docker-compose up```

## Programming Task

* Write a web application based on the following description:
  * Use any programming language(s), frameworks, etc. of your choice
  * The chosen tech stack, its fit, its sustainability, its sheer quality are important aspects of the evaluation of your solution
  * A full-stack, turnkey implementation is expected. We should be able to start using your app without any further questions to you
  * Any fancy additional "features" are appreciated (UX, accessibility, mobile-friendliness, containerization, testing, automation, portability, security, efficiency, scalability, logging, db seeds, etc)
  * Be aware of that the "Partner" module is a fictional 3rd party side, it is not in our hands, it might have some unexpected outages and various issues that should be handled as flawlessly by our side as it could be
  * Unfortunately at this very moment we have only a set of examples as an API of the Partner module. No OpenAPI specification, no test system is provided by the Partner. However the example outputs are stable, will not be changed by the Partner. If any cases are not covered by them just write us an email and we will answer it as we were the Partner
  * In case of any other questions, clarification needs, etc. write us an email
  * Communication between your app and the Partner is over HTTP
* About the features:
  * Currently, we have Hungarian and English speaking users
  * Users want to browse through available cinemas in their home city
  * Users want to browse through upcoming movies in a selected cinema
    * Movie screenings already started or already ended are not relevant for our users
  * Users should be able to reserve a seat for a given cinema and a given screening
    * Seats are reservable by the users only between the start of the week when the screening is on and just 10 minutes before the screening starts
    * Some seats are present but unable to reserve, other seats are generally reservable but already reserved by someone, and other seats are open to reserve
    * If a screening has no reservable seats at all, then the user should notice this at first glance
    * In this task, a reserved seat is never freed, a generally unavailable seat never becomes available again
* About the Partner API
  * We can query the cinema venues, the seating of the cinema rooms and the reservations of a specific screening
  * We can also reserve a seat if the reservation time is in the available slot and the seat is available
  * An already reserved seat is cannot be reserved by others 
  * Requests and responses to Partner API:
		
    `GET partner_root/api/v1/venues`
    ```
    [
      {
        "id": 1,
        "hu": "Corvin Mozi",
        "en": "Corvin Cinema",
        "lon": "19.07117831951774",
        "lat": "47.486200263587946"
      }
    ]
    ```
    * Here, we are expecting that the list is quite big, but we can always get a notification when the partner is changing its contents
    * English names are not always present. Then English users should refer the cinema with its Hungarian name
    * Coordinates and Hungarian names are always present
    * Sometimes additional language versions are present, but we should not do anything with that 
            
    `GET partner_root/api/v1/venue/1/seats`
    ```
    [
      {
        "row": 1,
        "side": "LEFT",
        "seatNo": 10,
        "available": true
      }
    ]
    ```
    * Here, we expect an array of the seats of the selected venue (here it is the Corvin Cinema)
    * All venues have rectangle shaped seating order: rows are numbered from 1 to `n`, seats are from 1 to `m` in the `LEFT` side and from 1 to `m` in the `RIGHT` side. `n` and `m` vary from venue to venue. No duplicates, no missing seats. Or are they?
    * Here, `available` means a generic availability for that seat. It is not supposed to be changed 
             
    `GET partner_root/api/v1/venue/1/screenings`
    ```
    [
      {
         "id": 1,
         "hu": "Különben dühbe jövünk",
         "en": "Watch Out, We're Mad!",
         "startEpochSeconds": 1726840800,
         "lengthMins": 97,
         "reserved":
         [
           "1LEFT10",
           "1LEFT11"
         ]
      }
    ]
    ```
    * As response, we expect an array of screenings with an id (unique for its venue), a mandatory Hungarian and an optional English name
    * The start time and length is given in the units as seen in the example
    * The reserved seats are also given as a string-array where the string follows the `ABC` format, where `A` is the row count, `B` is either `LEFT` or `RIGHT` and `C` is the seat number in the given row and given side
    * The "generally" unavailable seats are not listed here
    * This response is a dynamically variable thing: it contains only the screenings that are announced but not yet over, also the `reserved` array can grow as reservations are done. The other data are constant
            
    `POST partner_root/api/v1/venue/1/screening/1/reserve`
    * With this request body:

    ```
    {
      "partnerId": "Simple",
      "userEmail": "bud@spencer.it",
      "seat": "1LEFT12"
    }
    ```
    * Here, the `partnerId` is the partner according to our partner, so it's us :)
    * The `userEmail` should come from user input (users has no saved user accounts in this task)
    * `seat` follows the same format as introduced before
    * The response body is a number:
      * Status code `200`
        * `0` - everything went well
      * Status code `4xx`
        * `200` - request body format error
        * `300` - either the venue (first number in the path) or the screening (second number) is not found
        * `301` - the seat is not found
        * `302` - the seat is not available (because generally unavailable or already occupied for this screening)
        * `400` - the reservation cannot be done at this moment
      * Status code `5xx`
        * `500` - not detailed internal error in the Partner's system
