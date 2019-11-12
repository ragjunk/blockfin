/**
 * Configurations such as API endpoints for Validation nodes. Clients such as wallets, node explorers, etc.
 * get and post to APIs exposed by Validation nodes, which serve as endpoints to STORE network.
 */

let Config = {
    
    // API endpoints.
    API_ENDPOINTS: {
        // General information about STORE blockchain.
        general: {
            INFO: '/v1/general/blockchain_info',   // Version and other details of STORE blockchain.
            VNODE_INFO: '/v1/general/vnode_info',     // Version and other details of Validation node.
            SNODE_INFO: '/v1/general/snode_info'     // Version and other details of Storage node.
        },
        
        // Block details.
        blocks: {
            /* Details about blocks that are already finalized. A block is "finalized" when it receives 2/3+ signatures from 
             * Validation and Storage miners for the finalization phase.
             */
            
            HEIGHT_FINALILIZED: '/v1/blocks/finalized/height',    // The height (number) of the latest finialized block.
            LATEST_FINALIZED: '/v1/blocks/finalized/latest',    // Details of the "latest" finialized block.
            SPECIFIC_FINALIZED: '/v1/blocks/finalized/:height',    // Details of a "specific" finialized block, specified by the height.
            
            /* Details about blocks that are "being" finalized currently.
             * It is possible for multiple blocks in this state. While one block is being finalized at any time, there can be 
             * multiple blocks waiting for finalization. These blocks are past "assembling" phase.
             * A block is "assembled" when it receives 2/3+ signatures from Storage miners signaling that they approve the 
             * assembled block as ready for "finalization".
             */
            
            HEIGHTS_ASSEMBLED: '/v1/blocks/assembled/heights',    // List of zero or more heights of blocks currently being finalized.
            LATEST_ASSEMBLED: '/v1/blocks/assembled/latest',    // Details of the "latest" block currently being finalized.
            SPECIFIC_ASSEMBLED: '/v1/blocks/assembled/:height',    // Details of a "specific" block waiting for finalization.
            
            /* Details about blocks that are "being assembled" currently.
             * It is possible for multiple blocks in this state. Storage miners are still gossiping about these blocks, so their 
             * final "assembled" state may be different from the state being reported here. "Assembling" means transactions are being 
             * added to empty blocks and Storage miners are gossiping to agree on the contents of the blocks being assembled".
             * Note: It is possible for a block to move from "assembling" to "assembled" state by the time specific queries are 
             * requested. 
             */
            
            HEIGHTS_ASSEMBLING: '/v1/blocks/assembling/heights',    // List of zero or more heights of blocks currently being assembled.
            LATEST_ASSEMBLING: '/v1/blocks/assembling/latest',    // Details of the "latest" block currently being assembled.
            SPECIFIC_ASSEMBLING: '/v1/blocks/assembling/:height',    // Details of a "specific" block currently being assembled.
            
            /* Details about empty blocks waiting for assembly.
             * STORE blockchain has a different block creation mechanism compared to traditional "create one block at a time" approach.
             * At genesis, STORE miners create a chain of empty blocks, which contain no transactions. This preserves the authenticity of
             * the chain and avoids applying the "longest/most work done chain" rules. The empty blocks are assembled with transactions
             * (transaction batches, actually) as they arrive. 
             */
            
            HEIGHTS_EMPTY: '/v1/blocks/empty/heights',    // List of zero or more heights of empty blocks. Considering that this could be
                                                          // a long list, only "top N" (say 100) block heights are reported.
            LAST_EMPTY: '/v1/blocks/empty/last',    // Details of the "last" empty block.
            SPECIFIC_EMPTY: '/v1/blocks/empty/:height'   // Details of a "specific" empty block.
                        
        },
        
        // STORE miner details.
        miners: {
            LATEST_MINERS: '/v1/miners/latest',    // List of validation and storage miners who finalized the latest block.
            SPECIFIC_MINERS: '/v1/miners/:height',    // List of validation and storage miners who finalized a specific block.
            MINER_DETAILS: '/v1/miners/:id'    // Details about a specific miner identified by the id.
        },
        
        // Transactions
        transactions: {
            LATEST_FINALIZED: '/v1/txns/finalized/latest',    // List of transactions in the latest finalized block.
            TXNS_ASSEMBLED: '/v1/txns/assembled/all',    // List of all transactions in the assembled blocks. These transactions are 
                                                         // being finalized now.
            TXNS_ASSEMBLING: '/v1/txns/assembling/all',    // List of transactions currently in the process of being assembled into empty blocks.
            TXNS_SPECIFIC: '/v1/txns/:height',    // List of transactions in a specific block, identified with block height.
            TXN_DETAILS: '/v1/txns/:id',    // Details of a transaction identified by transaction id (its hash).
            TXNS_CREATE: '/v1/txns/create'    // Create a new transaction. This is a POST method.
        },
        
        // Accounts.
        accounts: {
            ACC_DETAILS: '/v1/accounts/:id',    // Get account details of the specified account.
            ACC_BALANCE: '/v1/accounts/:id/balance',    // Get account "balance" of the specified account.
            ACC_TXNS: '/v1/accounts/:id/txns',    // List all transactions originating from an account.
            ACC_PENDING_TXNS: '/v1/accounts/:id/txns/pending',    // List all "pending" transactions originating from an account.
            ACC_FINALIZED_TXNS: '/v1/accounts/:id/txns/finalized',    // List all "finalized" transactions originating from an account.
            ACC_SPECIFIC_TXN: '/v1/accounts/:id/txns/:txnid'    // Get the details of a specific transaction originating from specific account.
            
        }
        
    }
}

module.exports = Config;