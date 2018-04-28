const capable = []
const best = []

// Hardcoded need ratios
function Need (nodes) {
    
    const need = {
        balancers: 0,
        watchers: 0,
        enforcers: 0,
    }

    
    // determine existing roles
    for (node in nodes) {
        if (node.role == 'balancer') {
            balancers.push(node.id)
        }
        if (node.role == 'enforcer') {
            enforcers.push(node.id)
        }
        if (node.role == 'watcher') {
            watchers.push(node.id)
        }
    }
    // must be one of each role
    if (balancers.length == 0) {
        need.push('balancer') 
    }
    if (enforcers.length == 0 ){
        need.push('enforcer') 
    }
    if  (watchers.length == 0) {
        need.push('watcher') 
    }
    // must be more balancers than watchers
    if (balancers.length < watcher.length) {
        need.push('balancer')
    }
    // must be more enforcers than balancers
    if (enforcer.length < balancer.length) {
        need.push('enforcer')
    }

    return need
}

function Capable (nodes, apn) {
    // find capable nodes for a given apn (action per node)
    for (node in nodes) {
        // see if the node is capable...
        if (node.apn >= apn) {
            const score = node.apn - apn // determine how capable...
            const rating = score - node.influence // rate based on influence...

            capable.push (
                {
                    id: node.id,
                    score: score, 
                    rating: rating,
                }
            ) 
            console.log('CAPABLE: ' + node.id ) 
            console.log('score:' + score)
            console.log('rating: ' + rating)
            return true
        } else {
            // .. otherwise the node is not capable
            console.log('NOT CAPABLE ' + node.id)
            return false
        }
    }
}

function Best (capable) {
    // make sure there are capable nodes
    if (capable.length > 0) {
        // get the highest rated node     
        let max = capable[0].rating;
        for (let i = 1, len=capable.length; i < len; i++) {
            let r = capable[i].rating
            max = (r > max) ? r : max
        }
        // highest rated is the best
        for (node in capable) {
            if (node.rating == max) {
                console.log('BEST: ' + node.id)
                best.push(node.id)
            }
        }
        return true
    } else {
        return false
        console.log('no capable nodes')
    }
}

function Vote (nodes, best) {
    // what do we need?
    Need(nodes)

    

    // make sure there is a best...
    if (best.length > 0) {
        // randomly choose from the best...
        const vote = best[[Math.floor(Math.random() * best.length)]]
        console.log ('VOTE: ' + vote)
        return vote
    } else {
        console.log('NO BEST')
        return false
    }
}
