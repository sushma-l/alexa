'use strict';
var Alexa = require('alexa-sdk');
var APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).
var PouchDB = require('pouchdb');
var remotedb = new PouchDB('https://4b6f4c57-e71e-4121-9517-3754cb89aee0-bluemix:a6bb11af445e8a1b4631979bd4765d2d6db06383f43fc241b8d9fc6afede441c@4b6f4c57-e71e-4121-9517-3754cb89aee0-bluemix.cloudant.com/todos/');
remotedb.post({
  
  "version": "sushma",
  
}, function (err, response)
{
  if(err)
  { return console.log(err); }
})

var languageStrings = {
    "en-GB": {
        "translation": {
            "FACTS": [
                "A year on Mercury is just 88 days long.",
                "Despite being farther from the Sun, Venus experiences higher temperatures than Mercury.",
                "Venus rotates anti-clockwise, possibly because of a collision in the past with an asteroid.",
                "On Mars, the Sun appears about half the size as it does on Earth.",
                "Earth is the only planet not named after a god.",
                "Jupiter has the shortest day of all the planets.",
                "The Milky Way galaxy will collide with the Andromeda Galaxy in about 5 billion years.",
                "The Sun contains 99.86% of the mass in the Solar System.",
                "The Sun is an almost perfect sphere.",
                "A total solar eclipse can happen once every 1 to 2 years. This makes them a rare event.",
                "Saturn radiates two and a half times more energy into space than it receives from the sun.",
                "The temperature inside the Sun can reach 15 million degrees Celsius.",
                "The Moon is moving approximately 3.8 cm away from our planet every year."
            ],
            "SKILL_NAME" : "British Space Facts",
            "GET_FACT_MESSAGE" : "Here's your fact: ",
            "HELP_MESSAGE" : "You can say tell me a space fact, or, you can say exit... What can I help you with?",
            "HELP_REPROMPT" : "What can I help you with?",
            "STOP_MESSAGE" : "Goodbye!"
        }
    },
    "en-US": {
        "translation": {
            "FACTS": [
                "A year on Mercury is just 88 days long.",
                "Despite being farther from the Sun, Venus experiences higher temperatures than Mercury.",
                "Venus rotates counter-clockwise, possibly because of a collision in the past with an asteroid.",
                "On Mars, the Sun appears about half the size as it does on Earth.",
                "Earth is the only planet not named after a god.",
                "Jupiter has the shortest day of all the planets.",
                "The Milky Way galaxy will collide with the Andromeda Galaxy in about 5 billion years.",
                "The Sun contains 99.86% of the mass in the Solar System.",
                "The Sun is an almost perfect sphere.",
                "A total solar eclipse can happen once every 1 to 2 years. This makes them a rare event.",
                "Saturn radiates two and a half times more energy into space than it receives from the sun.",
                "The temperature inside the Sun can reach 15 million degrees Celsius.",
                "The Moon is moving approximately 3.8 cm away from our planet every year."
            ],
            "SKILL_NAME" : "American Space Facts",
            "GET_FACT_MESSAGE" : "Here's your fact: ",
            "HELP_MESSAGE" : "You can say tell me a space fact, or, you can say exit... What can I help you with?",
            "HELP_REPROMPT" : "What can I help you with?",
            "STOP_MESSAGE" : "Goodbye!"
        }
    },
    "de-DE": {
        "translation": {
            "FACTS": [
                "Ein Jahr dauert auf dem Merkur nur 88 Tage.",
                "Die Venus ist zwar weiter von der Sonne entfernt, hat aber höhere Temperaturen als Merkur.",
                "Venus dreht sich entgegen dem Uhrzeigersinn, möglicherweise aufgrund eines früheren Zusammenstoßes mit einem Asteroiden.",
                "Auf dem Mars erscheint die Sonne nur halb so groß wie auf der Erde.",
                "Die Erde ist der einzige Planet, der nicht nach einem Gott benannt ist.",
                "Jupiter hat den kürzesten Tag aller Planeten.",
                "Die Milchstraßengalaxis wird in etwa 5 Milliarden Jahren mit der Andromeda-Galaxis zusammenstoßen.",
                "Die Sonne macht rund 99,86 % der Masse im Sonnensystem aus.",
                "Die Sonne ist eine fast perfekte Kugel.",
                "Eine Sonnenfinsternis kann alle ein bis zwei Jahre eintreten. Sie ist daher ein seltenes Ereignis.",
                "Der Saturn strahlt zweieinhalb mal mehr Energie in den Weltraum aus als er von der Sonne erhält.",
                "Die Temperatur in der Sonne kann 15 Millionen Grad Celsius erreichen.",
                "Der Mond entfernt sich von unserem Planeten etwa 3,8 cm pro Jahr."
            ],
            "SKILL_NAME" : "Weltraumwissen auf Deutsch",
            "GET_FACT_MESSAGE" : "Hier sind deine Fakten: ",
            "HELP_MESSAGE" : "Du kannst sagen, „Nenne mir einen Fakt über den Weltraum“, oder du kannst „Beenden“ sagen... Wie kann ich dir helfen?",
            "HELP_REPROMPT" : "Wie kann ich dir helfen?",
            "STOP_MESSAGE" : "Auf Wiedersehen!"
        }
    }
};

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
	
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    console.log(event.request);
    alexa.registerHandlers(handlers);
    alexa.execute();
};
function AlexaSkill(appId) {
    this._appId = appId;
}
AlexaSkill.prototype.requestHandlers = {
    LaunchRequest: function (event, context, response) {
        this.eventHandlers.onLaunch.call(this, event.request, event.session, response);
        console.log(event.request);
    },

    IntentRequest: function (event, context, response) {
        this.eventHandlers.onIntent.call(this, event.request, event.session, response);
    },

    SessionEndedRequest: function (event, context) {
        this.eventHandlers.onSessionEnded(event.request, event.session);
        context.succeed();
    }
};

var handlers = {
    'LaunchRequest': function () {
    this.emit('GetFact');
		
    },
    'GetNewFactIntent': function () {
        this.emit('GetFact');
    },
    'GetFact': function () {
        // Get a random space fact from the space facts list
        // Use this.t() to get corresponding language data
        var factArr = this.t('FACTS');
        var factIndex = Math.floor(Math.random() * factArr.length);
        var randomFact = factArr[factIndex];

        // Create speech output
        var speechOutput = this.t("GET_FACT_MESSAGE") + randomFact;
          this.emit(':tellWithCard', speechOutput, this.t("SKILL_NAME"), randomFact)
    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = this.t("HELP_MESSAGE");
        var reprompt = this.t("HELP_MESSAGE");
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t("STOP_MESSAGE"));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t("STOP_MESSAGE"));
    }
};