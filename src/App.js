import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import myEpicNft from './utils/MyEpicNFT.json';

const TWITTER_HANDLE = 'konmaru_fox';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const TOTAL_MINT_COUNT = 100;

const CONTRACT_ADDRESS = "0xb8540d08964c090d750f4eD73B43029bFC181F3C";

const App = () => {
    
    const [currentAccount, setCurrentAccount] = useState("");

    const checkIfWalletIsConnected = async () => {
        const { ethereum } = window;

        if (!ethereum) {
            console.log("Make sure you have matamask!");
            return;
        } else {
            console.log("We have the ethereum object", ethereum);
        }

        const accounts = await ethereum.request({ method: 'eth_accounts' });

        if (accounts.length !== 0) {
            const account = accounts[0];
            console.log("Found an authorized account:", account);
            setCurrentAccount(account);
            setupEventListener()
        } else {
            console.log("No authorized account found");
        }
    }

    const getTotalNFTsMintedSofar = async () => {
        try {
            const { ethereum } = window;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);
                let nft = await connectedContract.getTotalNFTsMintedSoFar();
                return nft;
            }   else {
                    console.log("Ethereum object doesn't exist!");
                }
            } catch (error) {
                console.log(error)
            }
    }

    const connectWallet = async () => {
        try {
            const { ethereum } = window;

            if(!ethereum) {
                alert("Get MetaMask!");
                return;
            }

            const accounts = await ethereum.request({ method: "eth_requestAccounts"});
            let chainId = await ethereum.request({ method: 'eth_chainId' });
            const goerliChainId = "0x5";

            console.log("Connected to chain " + chainId, accounts[0]);
            if (chainId !== goerliChainId) {
                alert("You are not connected to the Goerli Test Network!");
            } else {
                setCurrentAccount(accounts[0]);
            }

            setupEventListener()
        } catch (error) {
            console.log(error)
        }
    }

    const setupEventListener = async () => {
        try {
            const { ethereum } =window;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

                connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
                    console.log(from, tokenId.toNumber())
                    alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
                });

                console.log("Setup event listener!")

            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error)
        }
    }

    const askContractToMintNft = async () => {
        try {
            const { ethereum } = window;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

                console.log("Going to pop wallet now to pay gas...")
                let nftTxn = await connectedContract.makeAnEpicNFT();

                console.log("Minting...please wait.")
                await nftTxn.wait();
                console.log(nftTxn);
                console.log(`Mined, see transaction: https://goerli.etherscan.io/tx/${nftTxn.hash}`);
            
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
    }, [])

    const renderNotConnectedContainer = () => (
        <button onClick={connectWallet} className="cta-button connect-wallet-button">
            Connect to Wallet
        </button>
    );

    const renderMintUI = () => (
        <button onClick={askContractToMintNft} className="cta-button mint-button">
            Mint NFT
        </button>
    )

    return (
        <div className="App">
            <div className="container">
                <div className="header-container">
                    <p className="header gradient-text">KonmaruMagicVegi NFT Collection</p>
                    <p className="sub-text">
                        Each mindset. Each way. Discover your Magical Vegi today.
                    </p>
                    <button onclick="window.location.href='https://testnets.opensea.io/collection/konmarumagicvegi-nft-1';" className="cta-button connect-wallet-button">
                        View Collection on OpenSea
                    </button>
                    <p className="sub-text">
                        {getTotalNFTsMintedSofar}/{TOTAL_MINT_COUNT} NFTs minted so far.
                    </p>
                    {currentAccount === "" ? renderNotConnectedContainer() : renderMintUI()}
                </div>
                <div className="footer-container">
                    <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
                    <p className="footer-text">
                        built by <a
                            className="footer-text"  
                            href={TWITTER_LINK}
                            target="_blank"
                            rel="noreferrer"
                        >{`@${TWITTER_HANDLE}`}</a>, with <a
                            className="footer-text"
                            href="https://twitter.com/_buildspace"
                            target="_blank"
                            rel="noreferrer"
                        >@_buildspace</a> community
                    </p>             
                </div>
            </div>
        </div>
    );
};

export default App;