
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

        this.transitions[currentState][event] = { nextState: nextState, action: action};
    }

    execute(event, eventData)
    {
        if (this.transitions[this.currentState] !== void(0))
        {
            if (this.transitions[this.currentState][event] !== void(0))
            {
                this.transitions[this.currentState][event].action(event, eventData);
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
}

module.exports = function(initialState)
{
    return new StateMachine(initialState);
}