'use strict';

const {dialogflow} = require('actions-on-google');
const Scraper = require( './whistlerpeak-scraper.js' );

module.exports = async function (context, req) {
    context.log('ski-status webhook fired');
    context.log('Dialogflow Request headers: ' + JSON.stringify(req.headers));
    context.log('Dialogflow Request body: ' + JSON.stringify(req.body));
    
    const app = dialogflow({debug: true} );

    // Register handlers for Dialogflow intents

    app.intent('Default Welcome Intent', conv => {
        conv.ask('Hi, how is it going?')
        conv.ask(`Here's a picture of a cat`)
        conv.ask(new Image({
        url: 'https://developers.google.com/web/fundamentals/accessibility/semantics-builtin/imgs/160204193356-01-cat-500.jpg',
        alt: 'A cat',
        }))
    })
    
    // Intent in Dialogflow called `Goodbye`
    app.intent('Goodbye', conv => {
        conv.close('See you later!')
    })
    
    app.intent('Default Fallback Intent', conv => {
        conv.ask(`I didn't understand. Can you tell me something else?`)
    })
    
    app.intent('is this run groomed', conv => {
        return checkGrooming(conv);
    })

    function checkGrooming(conv) {
    
        var scraper = new Scraper( console );

        var groomingPromise = scraper.statusQuery( conv.parameters.runName );
    
        groomingPromise.then( (grooming) => {
            console.log( `input RunName: ${conv.parameters.runName}`);
            console.log( `output Grooming: ${grooming.groomedRuns}`);
            console.log(`Number of groomed runs: ${grooming.groomedRuns.length}`);
            
            switch (grooming.groomedRuns.length) {
                case 0 :{
                    conv.add(`No ${conv.parameters.runName} is not groomed today.`);
                    console.log('NO');

                }
                case 1 : {
                    conv.add( `Yes, ${conv.parameters.runName} is groomed today.`);
                    console.log('YES');
                }
                default : {
                    conv.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
                }
            }
        });
    
        
    /**        
            agent.add(new Card({
                title: `Title: this is a card title`,
                imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
                text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
                buttonText: 'This is a button',
                buttonUrl: 'https://assistant.google.com/'
            })
            );
            agent.add(new Suggestion(`Quick Reply`));
            agent.add(new Suggestion(`Suggestion`));
            agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
        });
    */
        //conv.contexts = { name: 'grooming', lifespan: 2, parameters: { runName: `${conv.parameters.runName}` }};
        return groomingPromise;
    }
    
    app( req.body, req.headers );

};