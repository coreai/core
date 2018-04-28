function Ratio (roles) {
     
    for (role in roles ) {
        // must be at least one server   
        if (servers == 0) {
            return 'server'
        }
        // must be more balancers than watchers
        if (balancers < watchers) {
            return 'balancer'
        }
        // must be more enforcers than balancers
        if (enforcers < balancers) {
            return 'enforcer'
        }
    }
    // if all ratios are met, return null
    return null
}

function Influence (cluster) {
    return 1 / cluster
}

