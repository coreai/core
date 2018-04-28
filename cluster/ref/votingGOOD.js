const roles = {
    role: {
        name: 'balancer',
        id: 0,
        need: 1,
        apn: 50,
    },
    role: {
        name: 'enforcer',
        id: 1,
        need: 1,
        apn: 5,
    },
    role: {
        name: 'watcher',
        id: 2,
        need: 1,
        apn: 100,
    },

}

const nodes = {
    node: {
        id: 0,
        apn: 5,
        influence: 20,
        actions: 0,
        role: '',
    },
    node: {
        id: 1,
        apn: 100,
        influence: 5,
        actions: 0,
        role: '',
    },
    node: {
        id: 2,
        apn: 500,
        influence: 0,
        actions: 0,
        role: '',
    },
}


// CLUSTER
const balancers = []
const enforcers = []
const watchers = []

// ROLE
const roleNeed = []
const roleCapable = []
const rolePotential = []
const roleBest = []


// CLUSTER FUNCTIONS
function clusterSize (nodes) {
    return Object.keys(nodes).length
}

function clusterGet (nodes) {
    // get each node in the cluster by role
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
}


// ROLE FUNCTIONS
function roleNeed(balancers, watchers, enforcers) {
    // TODO: turn these into id integer for less memory usage
    // must be one of each role
    if (balancers.length == 0) {
        roleNeed.push('balancer') 
    }
    if (enforcers.length == 0 ){
        roleNeed.push('enforcer') 
    }
    if  (watchers.length == 0) {
        roleNeed.push('watcher') 
    }
    // must be more balancers than watchers
    if (balancers.length < watcher.length) {
        roleNeed.push('balancer')
    }
    // must be more enforcers than balancers
    if (enforcer.length < balancer.length) {
        roleNeed.push('enforcer')
    }
}

function roleCapable(nodes, apn) {
    // find capable nodes for a given apn (action per node)
    for (node in nodes) {
        // see if the ndoe is capable...
        if (node.apn >= apn) {
            const capabilityIndex = node.apn - apn // determine how capable...
            roleCapable.push (
                {
                    id: node.id, 
                    pwr: capabilityIndex,
                }
            ) // ...generate capability object!
            console.log('Node: '+ roleCapable.id + 'capable by' + capabilityIndex)
            return true
        } else {
            // .. otherwise the node is not capable
            console.log('Node: '+ roleCapable.id + 'not capable')
            return false
        }
    }
}

function rolePotential (roleCapabale) {
    // find potential nodes out of the capable nodes
    let max = roleCapable[0].pwr;
    
    // find node with max power
    for (let i = 1, len=roleCapable.length; i < len; i++) {
        let v = roleCapable[i].pwr
        max = (v > max) ? v : max
        rolePotential.push(
            {
                id: node.id,
                pwr: max,
            }
        )
    }
    for (node in roleCapable) {
        const distances = []
        let min = distances[0];
        
        // find the distance from each pwr to max pwr...
        distances.push(node.pwr - max)
        
        // the number of potentials is determined by cluster size...
        const numPotential = Math(distances.length - clusterSize + 1) 

        // find potential bests...
        for (i = 0, i < numPotential; i++;) {

            for (let i = 1, len=distances.length; i < len; i++) {
                // get each distance
                let v = distances[i]
                // get min distance
                min = (v > min) ? v : min
                // push min distance to potentials
                rolePotential.push(
                    {
                        id: node.id,
                        pwr: min,
                    }
                )
                // remove min distance from array
                distances.splice(min)
            }
            //.. do this until x potentials are found, where x is numPotentials
        }
    }
}

function roleBest (rolePotential, nodes) {
    // out of our array of potential nodes, pick the best
    const clusterSize = clusterSize()

    for (potential in rolePotential) {
        
        // determine the influence of each node
        for (node in nodes) {
            if(node.id == potential.id) {
                
            // if the distance from the first potential and the second potential is greater than the value of the first potential

            }
        }
    }
    
    if (node.pwr == max) {
        roleBest.push(node.id)
        console.log('Node: '+ node.id + 'is best with pwr' + node.pwr)
    }
}

function roleVote(roleBest) {
    roleNeed(balancers, watchers, enforcers)
    roleCapable(nodes, apn)
    rolePotential(roleCapabale)
    roleBest (rolePotential)

    // randomly select the best node
    const vote = roleBest[Math.floor(Math.random() * roleBest.length)];

    console.log('Voting for: '+ vote)

    return vote
}
