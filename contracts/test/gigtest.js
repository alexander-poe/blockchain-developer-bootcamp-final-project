
const gig = artifacts.require("gig");

contract("Gig", function (accounts) {
  it("should assert true", async function () {
    await gig.deployed();
    return assert.isTrue(true);
  });
  it("should start with zero balance", async function() {
    const instance = await gig.deployed();
    const balance = await instance.balance.call()
    return assert.equal(balance, 0, `Initial balance should be zero`)
  })
  it("should have an owner", async function() {
    const instance = await gig.deployed();
    const owner = await instance.owner.call()
    return assert.equal(owner, accounts[0], `Initial auction state should have owner`)
  })
  it("should make terms", async function() {
    const instance = await gig.deployed();
    const newTerms = await instance.makeTerms("100 per hours for 5 hours on 11/16/22", "Labor Rate", 500, accounts[1])
    const terms = await instance.terms.call();
    return assert.equal(terms, "100 per hours for 5 hours on 11/16/22", `It should create new terms`)
  })
  it("should allow client to approve terms", async function() {
    const instance = await gig.deployed();
    await instance.makeTerms("100 per hours for 5 hours on 11/16/22", "Labor Rate", 500, accounts[0])
    await instance.approveTerms(true)
    const termsApproved = await instance.termsApproved.call();
    return assert.isTrue(termsApproved);
  })
  it("should allow client to make deposit", async function() {
    const instance = await gig.deployed();
    await instance.makeTerms("100 per hours for 5 hours on 11/16/22", "Labor Rate", 500, accounts[0])
    await instance.approveTerms(true)
    await instance.termsApproved.call();
    await instance.deposit({from: accounts[0], value: 500});
    const balance = await instance.balance.call();
    return assert.equal(balance, 500, `It should allow client to deposit funds`)
  })
});
