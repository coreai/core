// THEORY: https://web.csulb.edu/~msaintg/ppa696/696stsig.htm

// Libraries: 
const ss = require('simple-statistics') 

// using simple statistics because it is fastest at calculating mean

// Variables: 
const tails = 2 // 1 = test just positive significance, 2 = test positive and negative
const dof = null // degree of freedom
const power = .80 // probability of obersving the expected result 

const significance = 0.05

const data = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    2, 2, 2, 2, 2, 2, 2, 2, 2,
    3, 3, 3, 3
]; 
const sample = 5

// Significant
// determine the significance factor
function Signficant (data, sample) {
    
    const mean = ss.mean(data)
    const standardDeviation = ss.standardDeviation(data)
    const standardScore = ss.zScore ( sample, mean, standardDeviation)

    console.log(standardScore)
}


Signficant(data, sample);




// Consistent
function Consistent (x,y, alpha, dof) {
    
}
// Strange
function Strange (data, significance) {
    
    // comparing oberseved distribution vs statistical distributions
    
    const poisson = ss.chiSquaredGoodnessOfFit(data, ss.poissonDistribution, significance)
    console.log ('poisson: ' + poisson)

    const bernoulli = ss.chiSquaredGoodnessOfFit(data, ss.bernoulliDistribution, significance)
    console.log ('bernoulli: ' + bernoulli)
    
    const binomial = ss.chiSquaredGoodnessOfFit(data, ss.binomialDistribution, significance)
    console.log ('binomial: ' + binomial)
    
    const ttest = ss.chiSquaredGoodnessOfFit(data, ss.tTest, significance)
    console.log ('tTest: ' + ttest)
    
    const cumlative = ss.chiSquaredGoodnessOfFit(data, ss.cumulativeStdNormalProbability, significance)
    console.log('cumulativeNormal: ' + cumlative)


}
 Strange(data, significance)