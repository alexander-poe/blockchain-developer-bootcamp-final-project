log = console.log.bind(console, " Script.js : ")

window.addEventListener('load', function() {
  
    if (typeof window.ethereum !== 'undefined') {
      console.log('window.ethereum is enabled')
      if (window.ethereum.isMetaMask === true) {
        console.log('MetaMask is active')
        let mmDetected = document.getElementById('mm-detected')
        mmDetected.innerHTML = `MetaMask Is Available!`
  
        // add in web3 here
        var web3 = new Web3(window.ethereum)
  
      } else {
        console.log('MetaMask is not available')
        let mmDetected = document.getElementById('mm-detected')
        mmDetected.innerHTML += 'MetaMask Not Available!'
        // let node = document.createTextNode('<p>MetaMask Not Available!<p>')
        // mmDetected.appendChild(node)
      }
    } else {
      console.log('window.ethereum is not found')
      let mmDetected = document.getElementById('mm-detected')
      mmDetected.innerHTML += '<p>MetaMask Not Available!<p>'
    }
  })

var web3 = new Web3(window.ethereum)
const enable = document.getElementById('mm-connect');

enable.onclick = async () => {
  await ethereum.request({ method: 'eth_requestAccounts'})
  var mmCurrentAccount = document.getElementById('mm-current-account');
  mmCurrentAccount.innerHTML = 'Current Account: ' + ethereum.selectedAddress
  enable.innerHTML = "connected"
  document.getElementById('connect').innerHTML = ``;
}

const gigAgreement = new web3.eth.Contract(abi, address)
gigAgreement.setProvider(window.ethereum)

const submitAgreement = () => {
    let client = document.getElementById('client').value;
    let cost = document.getElementById('cost').value;
    let terms = document.getElementById('terms').value;
    document.getElementById('status').innerHTML = "Agreement Created";
    home();
}

const newAgreement = () => {
    /// new web3.eth.Contract(jsonInterface[, address][, options])
    document.getElementById('module').innerHTML = 
    `
    <div class="input-group flex-nowrap">
        <span class="input-group-text" id="addon-wrapping">@</span>
        <input id="client" type="text" class="form-control" placeholder="Client" aria-label="Username" aria-describedby="addon-wrapping">
        <span class="input-group-text" id="addon-wrapping">Cost</span>
        <input id="cost" type="text" class="form-control" placeholder="Cost" aria-label="Username" aria-describedby="addon-wrapping">
    </div>
    <div class="form-group">
        <label for="exampleFormControlTextarea1">Make Terms</label>
        <textarea id="terms" class="form-control rounded-0" id="exampleFormControlTextarea1" rows="10"></textarea>
    </div>
    <button onClick="submitAgreement()" type="button" class="btn btn-primary">Submit</button>
    <label id="status"></label>
    `
}

const approveTerms = async () => {
    var web3 = new Web3(window.ethereum)
    const gigAgreement = new web3.eth.Contract(abi, address)
    gigAgreement.setProvider(window.ethereum)
    await gigAgreement.methods.approveTerms(true).send({from: ethereum.selectedAddress});
    incomingAgreements()
}

const makeDeposit = async () => {
    var web3 = new Web3(window.ethereum)
    const gigAgreement = new web3.eth.Contract(abi, address)
    let cost = await gigAgreement.methods.cost().call()
    gigAgreement.setProvider(window.ethereum)
    await gigAgreement.methods.deposit().send({from: ethereum.selectedAddress, value: cost});
    let balance = await gigAgreement.methods.balance().call();
    if (cost == balance) {
        console.log('true')
    }
}

const incomingAgreements = async () => {
    var web3 = new Web3(window.ethereum)
    const gigAgreement = new web3.eth.Contract(abi, address)
    var fundedStatus = "0%";
    gigAgreement.setProvider(window.ethereum)
    terms = await gigAgreement.methods.terms().call()
    agreementName = await gigAgreement.methods.agreementName().call()
    owner = await gigAgreement.methods.contractWriter().call()
    cost = await gigAgreement.methods.cost().call()
    termsApproved = await gigAgreement.methods.termsApproved().call()
    agreementFullfilled = await gigAgreement.methods.agreementFullfilled().call()
    balance = await gigAgreement.methods.balance().call();
    if (balance <= cost) {
       var fundedStatus = '100%'
    }
    // for each agreement display cards with resulting actions for agreement
    document.getElementById('module').innerHTML = 
    `
    <style>
    .card { margin: auto; margin-top: 50px; }
    </style>
    <div class="card" style="width: 18rem;">
        <div class="card-body">
            <h5 class="card-title">${agreementName}</h5>
            balance :  
            <div class="progress">
               <div class="progress-bar" role="progressbar" style="width: ${fundedStatus};" aria-valuenow="25" aria-valuemin="0" aria-valuemax=${cost}>${balance + ' wei'}</div>
             </div>
        </div>
        <ul class="list-group list-group-flush">
            <li class="list-group-item">Owner: ${owner}</li>
            <li class="list-group-item">Cost: ${cost}</li>
            <li class="list-group-item">Terms Approved: ${termsApproved ? 
                `<span class="badge bg-success"> Yes
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
                        <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
                    </svg>
                </span>` 
                : 
                `<span class="badge bg-danger"> Not Yet
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-thumbs-down-fill" viewBox="0 0 16 16">
                        <path d="M6.956 14.534c.065.936.952 1.659 1.908 1.42l.261-.065a1.378 1.378 0 0 0 1.012-.965c.22-.816.533-2.512.062-4.51.136.02.285.037.443.051.713.065 1.669.071 2.516-.211.518-.173.994-.68 1.2-1.272a1.896 1.896 0 0 0-.234-1.734c.058-.118.103-.242.138-.362.077-.27.113-.568.113-.856 0-.29-.036-.586-.113-.857a2.094 2.094 0 0 0-.16-.403c.169-.387.107-.82-.003-1.149a3.162 3.162 0 0 0-.488-.9c.054-.153.076-.313.076-.465a1.86 1.86 0 0 0-.253-.912C13.1.757 12.437.28 11.5.28H8c-.605 0-1.07.08-1.466.217a4.823 4.823 0 0 0-.97.485l-.048.029c-.504.308-.999.61-2.068.723C2.682 1.815 2 2.434 2 3.279v4c0 .851.685 1.433 1.357 1.616.849.232 1.574.787 2.132 1.41.56.626.914 1.28 1.039 1.638.199.575.356 1.54.428 2.591z"/>
                    </svg>
                </span>`} </li>
            <li class="list-group-item">Agreement Fullfilled: ${agreementFullfilled ?
                `<span class="badge bg-success"> Yes
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
                        <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
                    </svg>
                 </span>` 
            : 
                `<span class="badge bg-danger"> Not Yet
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-thumbs-down-fill" viewBox="0 0 16 16">
                        <path d="M6.956 14.534c.065.936.952 1.659 1.908 1.42l.261-.065a1.378 1.378 0 0 0 1.012-.965c.22-.816.533-2.512.062-4.51.136.02.285.037.443.051.713.065 1.669.071 2.516-.211.518-.173.994-.68 1.2-1.272a1.896 1.896 0 0 0-.234-1.734c.058-.118.103-.242.138-.362.077-.27.113-.568.113-.856 0-.29-.036-.586-.113-.857a2.094 2.094 0 0 0-.16-.403c.169-.387.107-.82-.003-1.149a3.162 3.162 0 0 0-.488-.9c.054-.153.076-.313.076-.465a1.86 1.86 0 0 0-.253-.912C13.1.757 12.437.28 11.5.28H8c-.605 0-1.07.08-1.466.217a4.823 4.823 0 0 0-.97.485l-.048.029c-.504.308-.999.61-2.068.723C2.682 1.815 2 2.434 2 3.279v4c0 .851.685 1.433 1.357 1.616.849.232 1.574.787 2.132 1.41.56.626.914 1.28 1.039 1.638.199.575.356 1.54.428 2.591z"/>
                    </svg>
                </span>`}
            </li>
        </ul>
        <div class="card-body">
            <p>
                <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                    View Terms
                </button>
                ${ balance > cost ? `` : `<button onclick="makeDeposit()" class="btn btn-primary" type="button">
                Make Deposit
            </button>`} 
                  
            </p>
            <div class="collapse" id="collapseExample">
                <div class="card card-body">
                    ${terms}
                    ${termsApproved ? 
                        `` : 
                        `<button onclick="approveTerms()" class="btn btn-primary" type="button">
                            Approve Terms
                        </button>` }
                </div>
            </div>
        </div>
    </div>
    `
}

const fullfillAgreement = async () => {
    var web3 = new Web3(window.ethereum)
    const gigAgreement = new web3.eth.Contract(abi, address)
    gigAgreement.setProvider(window.ethereum)
    await gigAgreement.methods.fulfillAgreement(true).send({from: ethereum.selectedAddress});
}

const withdraw = async () => {
    var web3 = new Web3(window.ethereum)
    const gigAgreement = new web3.eth.Contract(abi, address)
    gigAgreement.setProvider(window.ethereum)
    await gigAgreement.methods.withdraw().send({from: ethereum.selectedAddress})
}

const outgoingAgreements = async () => {
    var web3 = new Web3(window.ethereum)
    var fundedStatus = "0%"
    const gigAgreement = new web3.eth.Contract(abi, address)
    gigAgreement.setProvider(window.ethereum)
    terms = await gigAgreement.methods.terms().call()
    agreementName = await gigAgreement.methods.agreementName().call()
    owner = await gigAgreement.methods.contractWriter().call()
    cost = await gigAgreement.methods.cost().call()
    balance = await gigAgreement.methods.balance().call();
    termsApproved = await gigAgreement.methods.termsApproved().call()
    agreementFullfilled = await gigAgreement.methods.agreementFullfilled().call()
    if (balance <= cost) {
        var fundedStatus = '100%'
    }
    document.getElementById('module').innerHTML = 
    `
    <style>
    .card { margin: auto; margin-top: 50px; }
    </style>
    <div class="card" style="width: 18rem;">
        <div class="card-body">
            <h5 class="card-title">${agreementName}</h5>
            balance :
            <div class="progress">
               <div class="progress-bar" role="progressbar" style="width: ${fundedStatus};" aria-valuenow="25" aria-valuemin="0" aria-valuemax=${cost}>${balance + ' wei'}</div>
             </div>
        </div>
        <ul class="list-group list-group-flush">
            <li class="list-group-item">Owner: ${owner} </li>
            <li class="list-group-item">Cost: ${cost} </li>
            <li class="list-group-item">Terms Approved: ${termsApproved ? 
                `<span class="badge bg-success"> Yes
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
                        <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
                    </svg>
                </span>` 
                : 
                `<span class="badge bg-danger"> Not Yet
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-thumbs-down-fill" viewBox="0 0 16 16">
                        <path d="M6.956 14.534c.065.936.952 1.659 1.908 1.42l.261-.065a1.378 1.378 0 0 0 1.012-.965c.22-.816.533-2.512.062-4.51.136.02.285.037.443.051.713.065 1.669.071 2.516-.211.518-.173.994-.68 1.2-1.272a1.896 1.896 0 0 0-.234-1.734c.058-.118.103-.242.138-.362.077-.27.113-.568.113-.856 0-.29-.036-.586-.113-.857a2.094 2.094 0 0 0-.16-.403c.169-.387.107-.82-.003-1.149a3.162 3.162 0 0 0-.488-.9c.054-.153.076-.313.076-.465a1.86 1.86 0 0 0-.253-.912C13.1.757 12.437.28 11.5.28H8c-.605 0-1.07.08-1.466.217a4.823 4.823 0 0 0-.97.485l-.048.029c-.504.308-.999.61-2.068.723C2.682 1.815 2 2.434 2 3.279v4c0 .851.685 1.433 1.357 1.616.849.232 1.574.787 2.132 1.41.56.626.914 1.28 1.039 1.638.199.575.356 1.54.428 2.591z"/>
                    </svg>
                </span>`} 
            </li>
            <li class="list-group-item">Agreement Fullfilled:  ${agreementFullfilled ?
                `<span class="badge bg-success"> Yes
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
                        <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
                    </svg>
                 </span>` 
            : 
                `<span class="badge bg-danger"> Not Yet
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-thumbs-down-fill" viewBox="0 0 16 16">
                        <path d="M6.956 14.534c.065.936.952 1.659 1.908 1.42l.261-.065a1.378 1.378 0 0 0 1.012-.965c.22-.816.533-2.512.062-4.51.136.02.285.037.443.051.713.065 1.669.071 2.516-.211.518-.173.994-.68 1.2-1.272a1.896 1.896 0 0 0-.234-1.734c.058-.118.103-.242.138-.362.077-.27.113-.568.113-.856 0-.29-.036-.586-.113-.857a2.094 2.094 0 0 0-.16-.403c.169-.387.107-.82-.003-1.149a3.162 3.162 0 0 0-.488-.9c.054-.153.076-.313.076-.465a1.86 1.86 0 0 0-.253-.912C13.1.757 12.437.28 11.5.28H8c-.605 0-1.07.08-1.466.217a4.823 4.823 0 0 0-.97.485l-.048.029c-.504.308-.999.61-2.068.723C2.682 1.815 2 2.434 2 3.279v4c0 .851.685 1.433 1.357 1.616.849.232 1.574.787 2.132 1.41.56.626.914 1.28 1.039 1.638.199.575.356 1.54.428 2.591z"/>
                    </svg>
                </span>`} 
            </li>
        </ul>
        <div class="card-body">
            <p>
                <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                    Terms
                </button>   
            </p>
            ${termsApproved && !agreementFullfilled? 
            `<button onclick="fullfillAgreement()" class="btn btn-primary" type="button">
                Complete
            </button>` 
            : 
            ``
            }
            ${agreementFullfilled ? 
            `<button onclick="withdraw()" class="btn btn-primary" type="button">
                Withdraw
            </button>`
            :
            ``}
            
            <div class="collapse" id="collapseExample">
                <div class="card card-body">
                    ${terms}
                </div>
            </div>
        </div>
    </div>    
    `
}


const changeState = () => {
    let state = document.getElementById("stateSelect").value;
    if (state == 4) {
        newAgreement()
    }
    if (state == 3) {
        incomingAgreements()
    }
    if (state == 2) {
        outgoingAgreements()
    }
}

const home = () => {
    document.getElementById('app').innerHTML = 
    `
    <style>
        body { background-color: beige; }
    </style>
    <select id="stateSelect" onChange="changeState()" class="form-select" aria-label="Default select example">
        <option selected>Open ..</option>
        <option value="2">OutGoing Agreements</option>
        <option value="3">Incoming Agreements</option>
        <option value="4">New Agreement</option>
    </select>
    <div id="module"></div>`
}

home()