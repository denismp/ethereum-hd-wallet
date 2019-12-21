const ethers = require('ethers');

/**
 * Summary  Restore an HD node by given existing mnemonic words.
 * Description  A Hierarchical Deterministic Wallet represents a large tree of private keys, which can be reproduced 
 *              from an initial seed. Each node in the tree is represented by an HDNode which can be branched.
 * @param {string} mnemonic 
 */
function restoreHDNode(mnemonic) {
    return ethers.utils.HDNode.fromMnemonic(mnemonic);
}

/**
 * Summary  Restore a wallet by the given existing mnemonic words.
 * Description  When an ethers.Wallet instance is created from a mnemonic, it actually uses HDNode.fromMnemonic, 
 *              derives once, and from the new HD node, it takes the private key to build the wallet. 
 * @param {string} mnemonic 
 */
function restoreHDWallet(mnemonic) {
    return ethers.Wallet.fromMnemonic(mnemonic);
}

function testApp() {
    let mnemonic = "upset fuel enhance depart portion hope core animal innocent will athlete snack";
    console.log(restoreHDNode(mnemonic));
    console.log(restoreHDWallet(mnemonic));
}

testApp();
