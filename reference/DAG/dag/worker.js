'use strict';
const debug = require('debug')('app:workr')
const Worker = require('tiny-worker')
const bus = require('./bus')
const {calculateHash, createBlock} = require('../blockchain/block')
const co = require('co')
const store = require('./store')
const {BlockError, TransactionError} = require('../errors')
const config = require('../config')

/**
 * Start Working
 */
function work (contribution) {
  if (! store.working) return;

  co(function* () {
    while (store.working) {
      const block = yield workBlock(store.getTransactionsForNextBlock(), store.lastBlock(), store.difficulty, contribution.public)
      if (! block) {
        // Someone workd block first, started working new one
        continue
      }
      try {
        store.addBlock(block)
        bus.emit('block-added-by-me', block)
        bus.emit('balance-updated', {public: contribution.public, balance: store.getBalanceForAddress(contribution.public)})
      } catch (e) {
        if (! (e instanceof BlockError) && ! (e instanceof TransactionError)) throw e
        console.error(e)
      }
    }
  }).catch(e => console.error(e))
}

/**
 * Work in separate process
 *
 * @param transactions Transactions list to add to the block
 * @param lastBlock Last block in the blockchain
 * @param difficulty Current difficulty
 * @param address Address for reward transaction
 * @return {*}
 */
function workBlock (transactions, lastBlock, difficulty, address) {
  const block = createBlock(transactions, lastBlock, address)
  block.hash = calculateHash(block)

  debug(`Started working block ${block.index}`)

  return new Promise((resolve, reject) => {

      findBlockHash(block, difficulty).then(block => resolve(block))
    
  })
}

/**
 * Find block hash according to difficulty
 *
 * @param block
 * @param difficulty
 * @return {Promise}
 */
function findBlockHash (block, difficulty) {
  return new Promise((resolve, reject) => {
    /*
     * Create worker to find hash in separate process
     */
    const worker = new Worker(function () {
      const util = require(require('path').resolve(__dirname, 'src/blockchain/block'))
      const debug = require('debug')('app:workr')
      self.onmessage = (e) => {
        const {block, difficulty} = e.data
        while (util.getDifficulty(block.hash) >= difficulty) {
          block.nonce++
          block.hash = util.calculateHash(block)
          if (block.nonce % 100000 === 0) debug('100K hashes')
        }
        postMessage({type: 'block', block})
        self.close()
      }
    })
    worker.onmessage = (e) => {
      removeListeners()
      resolve(e.data.block)
    }
    worker.postMessage({block, difficulty})

    /*
     * Handle events to stop working when needed
     */
    const workStop = () => {
      removeListeners()
      resolve(null)
      debug('kill thread')
      worker.terminate()
    }
    // Listeners for stopping working
    const blockAddedListener = b => { if (b.index >= block.index) workStop() }
    const workStopListener = b => workStop
    const removeListeners = () => {
      bus.removeListener('block-added', blockAddedListener)
      bus.removeListener('work-stop', workStopListener)
    }
    // If other process found the same block faster, kill current one
    bus.once('block-added', blockAddedListener)
    bus.once('work-stop', workStopListener)
  })
}

module.exports = {work, workBlock}
