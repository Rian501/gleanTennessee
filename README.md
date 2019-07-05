# Glean Tennessee
Preview [website](https://glean-tennessee.firebaseapp.com/)

This project was created during Nashville's Civic Day of Hacking to allow farmers and other food providers to notify the [Society of St. Andrew](endhunger.org) of food donations available for harvest and pick up.

This is drawn from the [SoSAGleanTN repo](https://github.com/SoSAGleanTNorg/GleanTnWeb).

## Development

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

To start:

```
npm install
npm start
```

Pull requests can be opened into the `dev` branch.

Please fork and create pull requests to respond to issues.

## Firebase Functions
Emails are sent using Sendgrid and firebase functions.
To deploy/ update the function run 

```$ firebase deploy --only functions```

The function code lives in the `functions` dir.


## Contributors:

- Corey Rice
- Jeannie Hunter
- Emily Lemmon
- Kevin Huber
- Shu Sajid
- Andrew Leverette
