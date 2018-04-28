'use strict'
/**
 * Cluster Threshold
 * @function
 * @param {data} x
 * @param {cluster} cluster
 */

const clusterThreshold = async (x, cluster) => {
    if (x > cluster) {
        return true
    }
}
 

const trinityThreshold = async (x) => {
    if (x >= 3 ) {
        return true
    }
}


module.exports = {

}