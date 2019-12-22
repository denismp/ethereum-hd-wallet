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

function generateMnemonic() {
    let randomEntropyBytes = ethers.utils.randomBytes(16);
    return ethers.utils.HDNode.entropyToMnemonic(randomEntropyBytes);
}

/**
 * Summary  Generate a random HD node.
 * Description  Generates a random HD node from the ethers library.
 */
function generateRandomHDNode() {
    let mnemonic = generateMnemonic();
    return ethers.utils.HDNode.fromMnemonic(mnemonic);
}

/**
 * Summary  Generate a random HD wallet.
 * Description  Generate a random HD wallet from the ethers library.
 */
function generateRandomHDWallet() {
    return ethers.Wallet.createRandom();
}

/**
 * Summary  Save a wallet.
 * Description  Save the given wallet.
 * @param {*} wallet 
 * @param {string} password 
 */
async function saveWalletAsJson(wallet, password) {
    return wallet.encrypt(password);
}

/**
* Summary  Encrypt and save given HD node to a JSON document by password.
* Description   To save the HD Wallet in an encrypted JSON format, you need the Wallet to 
                include the mnemonic phrase. The mnemonic is encrypted in the "x-ethers" part of the json.
*/
(async () => {
    let wallet = ethers.Wallet.createRandom();
    let password = "p@$$word";
    let json = await saveWalletAsJson(wallet, password);
    console.log('Save WalletAsJson=' + json);
})();

/**
 * Summary  Decrypt json wallet.
 * Description  Using the given json and password, decryt as a wallet.
 * @param {string} json 
 * @param {string} password 
 */
async function decryptWallet(json, password) {
    return ethers.Wallet.fromEncryptedJson(json, password);
}

/**
 * Summary  Load HD Wallet from JSON.
 * Description  Decrypt and load an HD node from a JSON document using a password. 
 */
(async () => {
    let wallet = ethers.Wallet.createRandom();
    let password = "p@$$word";
    let json = await saveWalletAsJson(wallet, password);

    let walletDecrypted = await decryptWallet(json, password);
    console.log('WalletDecrypted:')
    console.log(walletDecrypted);
})();

/**
 * Summary  Derive Keys from HD Wallet.
 * Description  Derive keys (and their associated addresses) from HD Wallet by given derivation path.
 * @param {*} mnemonic 
 * @param {*} derivationPath 
 */
function deriveFiveWalletsFromHdNode(mnemonic, derivationPath) {
    let wallets = [];

    for (let i = 0; i < 5; i++) {
        let hdNode = ethers.utils.HDNode.fromMnemonic(mnemonic).derivePath(derivationPath + "/" + i);
        console.log(hdNode);
        let wallet = new ethers.Wallet(hdNode.privateKey);
        wallets.push(wallet);
    }
    return wallets;
}

/**
 * Summary  Sign a Transaction.
 * Description  Sign a transaction with a given recipient address and ether value.
 * @param {*} wallet 
 * @param {string} toAddress 
 * @param {string} value 
 */
async function signTransaction(wallet, toAddress, value) {
    let transaction = {
        nonce: 0,
        gasLimit: 21000,
        gasPrice: ethers.utils.bigNumberify("2000000000"),
        to: toAddress,
        value: ethers.utils.parseEther(value),
        data: "0x"
    };
    return wallet.sign(transaction);

}

/**
 * Summary  Sign My transction.
 * Description  Sign a transaction in the given wallet, with the toAddress, and value.
 * @param {*} wallet 
 * @param {string} toAddress 
 * @param {string} value 
 */
async function signMyTransaction(wallet, toAddress, value) {
    try {
        let signedTransaction = await signTransaction(wallet, toAddress, value);
        console.log("Signed Transaction:\n" + signedTransaction);   
    } catch(e) {
        console.log('Error: ', e.message);
    }
 
}

function testApp() {
    let mnemonic = "upset fuel enhance depart portion hope core animal innocent will athlete snack";
    console.log('Restore HDNode:');
    console.log(restoreHDNode(mnemonic));
    console.log('Restore HDWallet:');
    console.log(restoreHDWallet(mnemonic));
    console.log('RandomHDNode:');
    console.log(generateRandomHDNode());
    console.log('Generate RandomHDWallet:');
    console.log(generateRandomHDWallet());

    let derivationPath = "m/44'/60'/0'/0";
    console.log('DeriveFiveWalletsFromHdNode() results:')
    let wallets = deriveFiveWalletsFromHdNode(mnemonic, derivationPath);
    console.log(wallets);

    /**
     * Take the second of the derived wallets and sign a transaction with a given recipient address and ether value. 
     */
    let recipient = "0x933b946c4fec43372c5580096408d25b3c7936c5"; let value = "1.0";
    let signedTransaction = signMyTransaction(wallets[1], recipient, value);
    console.log("Signed Transaction:\n" + signedTransaction);

}

testApp();
