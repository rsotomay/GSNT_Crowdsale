import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { ethers } from "ethers";

//components
import Navigation from "./Navigation";
import Info from "./Info";
import Loading from "./Loading";
import Progress from "./Progress";

//Abis
import TOKEN_ABI from "../abis/Token.json";
import CROWDSALE_ABI from "../abis/Crowdsale.json";

//config
import config from "../config.json";

function App() {
  const [provider, setProvider] = useState(null);
  const [crowdsale, setCrowdsale] = useState(null);

  const [account, setAccount] = useState(null);
  const [accountBalance, setAccountBalance] = useState(0);

  const [price, setPrice] = useState(0);
  const [maxTokens, setMaxTokens] = useState(0);
  const [tokensSold, setTokensSold] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  const loadBlockchainData = async () => {
    //Initiate provider
    const provider = new ethers.BrowserProvider(window.ethereum);
    setProvider(provider);

    //Initiate contracts
    const token = new ethers.Contract(
      config[31337].token.address,
      TOKEN_ABI,
      provider
    );

    const crowdsale = new ethers.Contract(
      config[31337].crowdsale.address,
      CROWDSALE_ABI,
      provider
    );
    setCrowdsale(crowdsale);

    // fetch accounts
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    // Add to state
    const account = ethers.getAddress(accounts[0]);
    setAccount(account);

    //fetch account balance
    const accountBalance = ethers.formatUnits(
      await token.balanceOf(account),
      18
    );
    setAccountBalance(accountBalance);
    // Fetch price
    const price = ethers.formatUnits(await crowdsale.price(), 18);
    setPrice(price);
    // fetch mas tokens
    const maxTokens = ethers.formatUnits(await crowdsale.maxTokens(), 18);
    setMaxTokens(maxTokens);
    // fetch tokens sold
    const tokensSold = ethers.formatUnits(await crowdsale.tokensSold(), 18);
    setTokensSold(tokensSold);

    setIsLoading(false);
  };

  useEffect(() => {
    if (isLoading) {
      loadBlockchainData();
    }
  }, [isLoading]);

  return (
    <Container>
      <Navigation />

      <h1 className="my-4 text-center">Introducing GSNT Token!</h1>

      {isLoading ? (
        <Loading />
      ) : (
        <>
          <p className="text-center">
            <strong>Current Price:</strong> {price} ETH
          </p>
          <Progress maxTokens={maxTokens} tokensSold={tokensSold} />
        </>
      )}
      <hr />
      {account && <Info account={account} accountBalance={accountBalance} />}
    </Container>
  );
}
export default App;
