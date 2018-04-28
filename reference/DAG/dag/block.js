'use strict';
const {BlockError} = require('../errors')
const CryptoJS = require('crypto-js')
const Joi = require('joi')
const {checkTransactions, createRewardTransaction} = require('./transaction')

const blockSchema = Joi.object().keys({
  index: Joi.number(),
  prevHash: Joi.string().hex().length(64),
  time: Joi.number(),
  transactions: Joi.array(),
  nonce: Joi.number(),
  hash: Joi.string().hex().length(64),
})

/**
 * Validate block data
 *
 * @param block
 * @return {*}
 */
function isDataValid (block) {
  return Joi.validate(block, blockSchema).error === null
}

/**
 * Verify block
 *
 * @param previousBlock
 * @param block
 * @param difficulty
 * @param unspent
 */
function checkBlock (branches, previousBlock, block, difficulty, unspent) {
  if (! isDataValid(block)) throw new BlockError('Invalid block data')
  const blockDifficulty = getDifficulty(block.hash)
  if (branches !== block.branches) throw new BlockError('Invalid block branches')
  if (previousBlock.index + 1 !== block.index) throw new BlockError('Invalid block index')
  if (previousBlock.hash !== block.prevHash) throw new BlockError('Invalid block prevhash')
  if (calculateHash(block) !== block.hash) throw new BlockError('Invalid block hash')
  if (blockDifficulty > difficulty) throw new BlockError('Invalid block difficulty')
  checkTransactions(block.transactions, unspent)
}

/**
 * Generate hash
 *
 * @param block
 * @param branch
 */
function calculateHash ({index, prevHash, time, transactions, nonce}) {
  return CryptoJS.SHA256(JSON.stringify({index, prevHashes, time, transactions, nonce})).toString()
}

/**
 * Create genesis block
 *
 * @return {{index: number, prevHash: string, time: number, transactions: Array, nonce: number}}
 */
function makeGenesisBlock () {
  const block = {
    index: 0,
    prevHashes: ['0', '0'],
    time: '1505759228',
    transactions: ['0'],
    nonce: 0,
  }
  block.hash = calculateHash(block)

  return block
}

/**
 * Create new block
 *
 * @param transactions {array}
 * @param lastBlock {object}
 * @param address {string}
 * @return {{index: *, prevHash, time: number, transactions: *, nonce: number}}
 */
function createBlock (branches, transactions, lastBlock, address) {
  transactions = transactions.slice()
  transactions.push(createRewardTransaction(address))
  const block = {
    index: lastBlock.index + 1,
    prevHash: lastBlock.hash,
    time: Math.floor(new Date().getTime() / 1000),
    transactions,
    nonce: 0,
  }
  block.hash = calculateHash(block)

  return block
}

/**
 * Create new branch
 *
 * @param from {string}
 * @param to {string}
 * @return {{to *, from: *, nonce: number}}
 */
function createBranch (from, to) {
  const branch = {
    from: from.hash,
    to: to.hash,
    nonce: 0,
  }
  branch.hash = calculateHash(branch)

  return branch
}

/**
 * Get hash difficulty
 *
 * @param hash
 * @return {Number}
 */
function getDifficulty (hash) {
  return parseInt(hash.substring(0, 8), 16)
}

module.exports = {checkBlock, calculateHash, makeGenesisBlock, createBlock, getDifficulty}
