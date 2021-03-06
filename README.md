s# Healthcare-App
This is our project DocFinder for the Brandeis University 2017 JBS program. 

<strong>What is our app?</strong>

DocFinder is a voice-enabled search application that provides a list of doctors specified by your search queries. Search can be done by your insurance provider, the type of doctor you are looking for, the location you like to search from, and languages. The list of doctors is returned in order of distance from your specified location. 

<strong>Known Issues</strong>

-- All searches must be made from the homepage currently, although the dialog system may indicate otherwise. <br>
-- Searches work best in the form 'Find me a [TYPE OF DOCTOR] who takes [INSURANCE NAME] near [ADDRESS]'. If you include a street address, make sure to include a house number and not just the name of the street. <br>
-- Sometimes the dialog system will enter a buggy loop, which is best resolved by fully refreshing the page. <br>
-- The medical database we are using has not yet rolled out a foreign language field, although they promise they will soon. This means that searching for a doctor who speaks a language other than English will not yet work, although it is built into the site.

<strong>How to use our app?</strong>

Run our app using 'meteor run' in the terminal. The DocFinder app will be loaded onto localhost:3000. 
In the home page of the app, click the blue microphone button to speak to the app. You can immediately ask for the kind of doctor you are looking for using an utterance such as "I am looking for a general practitioner" or make a greeting to the app to initiate conversation. 
The microphone button will turn red when listening to your speech and automatically return to blue when you are finished. The app will then direct you to a list of doctors that fit your query. The names of the doctors produce profiles that the user can look at for information such as, a location, biography, phone number, and payments from pharmaceutical companies. 



Other pages of the app are located via the hamburger menu and include an about page, contact page, and user sign-in.

