# COVID-19 Symptom Study

## Table of Contents

- [My Contributions for this task](#my-contributions-for-this-task)

- [About The Project](#about-the-project)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Tests](#tests)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Common Issues](#common-issues)
- [License](#license)
- [Contact](#contact)
- [Acknowledgements](#acknowledgements)

## My Contributions for this task

### Added

- Created a new ContributionsScreen that's linked to from the DrawerMenu
- The ContributionsScreen lists patients in an animated accordion, which shows the number of contributions each patient has made, an the last day they made a contribution.
- The contribution number is a combination of the number of contributions they've made for themselves, plus the number of combinations they've made on behalf of other people. It also shows the last day of a contribution that they made.
- Added a /contributions/ endpoint that returns the user's contributions count for both themselves and the contributions they've made on behalf of others. This data is mocked in `contributions.json`, and looks like this:

```
{
   "00000000-0000-0000-0000-000000000002": {
    "id": "00000000-0000-0000-0000-000000000002",
    "report_count": 3,
    "contribution_for_others_count": 0
  }
}
```

- Added a back button in the form of a link that takes the user back to the previous screen

### Assumptions

The existing patients data returned from the `/patients/` endpoint does not include the number of contributions made by a patient on behalf of someone else.

As the task requires calculating the _total_ number of contributions made(i.e. contributions made by the patient for themselves, and on behalf of someone else), I had to decide on the best place to store this data. I chose to add a new endpoint called `/contributions/` that returns:

- the number of contributions for the patient (`report_count`)
- the number of contributions made by the patient on behalf of someone else (`contribution_for_others_count`)

In reality, this endpoint is not needed, as the field `contribution_for_others_count` could more easily be added to the data returned from the `/patients/` data. However, the task required creating a new endpoint, so I chose to add the `/contributions/` endpoint as a separate endpoint to fulfill this part of the challenge.

### Things I didn't have time to do

- In somes case, a margin has been added in CSS to add space between two Views. Normally, I prefer to use a dedicated `<Spacer>` component to add space, but the codebase doesn't have one, so in the interests of time, I simply adjusted the margin.
- I wrote a daysAgo function without realising there's a `DaysAgo` component. However, this component calculates the days ago value, and wraps some JSX around it. It would be better for this logic from the `DaysAgo` component to be refactored out of the component and into a helper function (in which case, the `DaysAgo` component would be no longer needed).
- I didn't have time to highlight the profiles that don't have symptoms reported for more than a day
- I didn't have time to write any unit tests, but you can see exampes of unit tests I've written on other repos in [my Github account](https://github.com/bundance).

---

## About The Project

<p float="left" align="middle">
  <img src="images/screenshot_1.png" width="180" />
  <img src="images/screenshot_2.png" width="180" />
  <img src="images/screenshot_3.png" width="180" />
</p>

COVID Symptom Study is an open source Android and iOS app whose goal is to stop the spread of COVID-19 disease and help identify people who are at risk sooner.

The COVID Symptom Study was designed by doctors and scientists at King's College London, Guys and St Thomas’ Hospitals working in partnership with ZOE Global Ltd – a health science company.

If you're doing research on COVID-19 and you want to contribute or believe this initiative can help your efforts, please let us know at research@joinzoe.com

### Built With

- [React Native](https://reactnative.dev)
- [Expo](https://expo.io)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- npm
- expo-cli

```sh
npm install npm@latest -g
npm install expo-cli --g
```

### Installation

1. Clone the repo

   ```sh
   git clone git@github.com:zoe/covid-tracker-react-native.git
   ```

2. When you first start your application you should see the IP address in the console (located above the QR code). For example:

   ```sh
   exp://123.456.7.890:19000
   ```

   Copy the host part of the IP address only.

3. Create a `.env` file - please note that `http://` is required otherwise API requests will fail.

   ```sh
   echo "API_URL=http://<ip_address_host_here>:3000" > .env
   ```

   e.g.

   ```sh
   echo "API_URL=http://123.456.7.890:3000" > .env
   ```

4. Run the following command to create `AMPLITUDE_KEY` environment variable:

   ```sh
   echo "AMPLITUDE_KEY=test_key" > .env
   ```

5. Create an empty `./google-services.json` file in the root of the application.

   ```sh
   echo "{}" > google-services.json
   ```

6. Run the following commands

   ```bash
   npm install
   expo start
   ```

7. Run the mock server

   ```bash
   npm run mock-server
   ```

### Git Hooks

The git hook checks can be manually disabled calling git commit and git push with the --no-verify flag if needed.

### Tests

1. Run the standard suite of integration tests

   ```bash
   npm test
   ```

2. Check the i18n strings for a locale are complete

   ```bash
   npm test:i18n sv-SE
   ```

## Roadmap

See the [open issues](https://github.com/zoe/covid-tracker-react-native/issues) for a list of proposed features (and known issues).

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated** - see the [contributing guidelines](CONTRIBUTING.md).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Common Issues

These are some known, common issues and their solutions:

1. Changes to .env don't get picked up.

- Solution: Change some of the source code or restart the expo project running `expo start -c`

## License

Distributed under the Apache 2.0 License. See `LICENSE` for more information.

## Contact

ZOE Engineering - engineering@joinzoe.com

## Acknowledgements

- [Contributor Covenant](https://www.contributor-covenant.org)
