// Voting
// all decisions are democratic...

// each node is presented with a decision and options.

// each node determines the best option... that is their vote

// each node receives votes from every other nodes...

// each node tallies the votes...

// the option with the most votes becomes their new best, the node votes again.

// the nodes continue to vote and update the best until the majority agree.

// voting stops when all nodes have reached a decision.


// decision has option objects:
// option{id:<id>, votes:<id>, from: <id>} 

const threshold = .51 // percent
const best = null

function Best (decision) {
    // if there are no votes node determines 'best' 
    if (decision.length == 0) {
        const best = best
        return best
    } else {
    // if there are votes, 'best' is the option with most votes

    }
    return false
}

function Vote (decision, best) {
    // vote for the best option
    for (option in decision) {
        if (option.id == best) {
            return option.votes + 1 
        }
    }
}

function Tally (decision) {
    // total votes...
    

    // count votes... 
    for (option in decision) {
        option.votes
    }
}

function Decide (decision, threshold) {
    for (vote in votes) {
        if (vote > threshold) {
            return true;
        } else {
            return false;
        }
    }

}
