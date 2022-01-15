Blockchain-Developer-Bootcamp-Final-Project

# 🎸 GiG Agreement
THe Problem: Preforming artist can encounter problems tracking down payment at the end of a gig. Payment may be unclear and delayed. With Gig agreement terms can be set, client can approve terms, make a deposit and funds can be withdrawn upon agreement fullfillment. 

# Directory Structure

🥁 contracts/front-end: contains all front end HTML, JS and CSS
🎷 /contracts/contracts: Smart contracts that are deployed on Ropsten testnet.
🎹 /contracts/migrations: Migration files for deploying contracts in /contracts/contracts directory.
🎤 /contracts/test: JS file that contrains 6 unit tests for the smart contracts.


### Project Walkthrough
https://youtu.be/gSkA3queFpE
# QUICK START

### Option 1: Use deployed version [here](https://alexpoe22.github.io/blockchain-developer-bootcamp-final-project/)
    - Deployed version has onlyClient modifiers removed so state updates can be demonstrated without client address being specified.
### Option 2: Running Locally with Ganache
    Prerequisites: Node, Git, Truffle

    1. git clone
    2. npm install
    3. truffle compile
    4. Open Ganache and click New Workspace and then click Add a project and select truffle_config.js inside /truffle 
    5. Set Network ID to 5777 and port number 7545 under Settings->Server.
    6. In your terminal, run truffle migrate --network development to deploy contracts to your local blockchain
    7. go to contracts/front_end/index.html and open page in browser.
   
## Running Test
1. Make sure local blockchain is running
2. Run truffle test.



# MVP / Workflow

## MVP
Contract owner can specify terms and cost of gig.
Client can approve of terms and make deposit.
Contract owner can fullfill agreement and withdrawl payment.

## Workflow
Note: In practice contract owner would have clients public key to initialize contract. To test locally, initiate contract and set client to your own address to demo full workflow.

Owner creates terms, gig name, cost and specifies client.

Client can view terms, approve terms and make deposit.

Once terms have been approved and deposit has been made, agreement can be fullfilled by the owner. 

Once agreement is fullfilled, owner can withdraw deposite and complete agreement.

Additional features coming: 
- Use of factory contract to create new agreements
- Replace terms string with link to docusign agreement
- Enable payouts to be split
