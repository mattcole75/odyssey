# Auth
Node Express MongoDB api for managing user authentication.

## Installation

Use the package manager [npm](https://github.com/mattcole75/auth) to install Auth once you have cloned the repository.

```bash
npm install
```
## Configuration
 - Create a .env file in the root directory
    - Add the following configuration:
        - DB_URI={your mongodb uri} e.g. mongodb://localhost:27017/
        - PORT={the port number you will serve the express app on} e.g. 1337
        - LOG_PATH={the path to your log file} e.g. ./logs/auth.log
- Create your logs Directory as above
- Take a look at the config file in the configuration directory as this information is used in the URL's
- Create a -1 unique index on the email field in the user collection
- Create a text index on the email field in the user collection

## Documentation
documentation on the api (Auth Software Design Specification) is available on request.

## License
[GNU GENERAL PUBLIC LICENSE V3](https://www.gnu.org/licenses/gpl-3.0.en.html)