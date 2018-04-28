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

const need = {
    servers: 0,
    clients: 0,
    agents: 0,
}



function Need (nodes) {
    // update the need weights for each agent or role
}

function clusterSize (nodes) {
    return Object.keys(nodes).length
}


