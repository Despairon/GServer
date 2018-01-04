
class StateMachine
{
    constructor(initialState)
    {
        this.currentState = initialState;
        this.transitions  = new Object();
    }

    addTransition(currentState, event, nextState, action)
    {
        if (this.transitions[currentState] === void(0))
        {
            this.transitions[currentState] = new Object();
        }

        this.transitions[currentState][event] = { nextState: nextState, action: action };
    }

    execute(eventData)
    {
        let event = eventData.event;
        let data  = eventData.eventData;

        if (this.transitions !== void(0))
        {
            if (this.transitions[this.currentState] !== void(0))
            {
                if (this.transitions[this.currentState][event] !== void(0))
                {
                    this.transitions[this.currentState][event].action(data);
                    this.currentState = this.transitions[this.currentState][event].nextState;
                }
                else
                {
                    console.log(`Transition from ${this.currentState} by event ${event} not found!`);
                }
            }
            else
            {
                console.log(`NO transitions found for current state: ${this.currentState}`);
            }
        }
        else
        {
            console.log('Empty state machine!');
        }
    }
}

module.exports = function(initialState)
{
    return new StateMachine(initialState);
};