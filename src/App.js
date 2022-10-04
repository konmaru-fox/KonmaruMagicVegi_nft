import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import React, { useEffect } from "react";

const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = 'https://twitter.com/${TWITTER_HANDLE}';
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;

const App = () => {
    const checkIfWalletIsConnected = () => {
        const { ethereum } = window;

        if (!ethereum) {
            console.log("Make sure you have matamask!");
            return;
        } else {
            console.log("We have the ethereum object", ethereum);
        }
    }

    const renderNotConnectedContainer = () => (
        <button className="cta-button connect-wallet-button">
            Connect to Wallet
        </button>
    );
    
    useEffect(() => {
        checkIfWalletIsConnected();
    }, [])

    return (
        <div className="App">
            <div className="container">
                <div className="header-container">
                    <p className="header gradient-text">KonmaruMagicVegi NFT Collection</p>
                    <p className="sub-text">
                        Each mindset. Each way to go. Discover your Magical Vegi today.
                    </p>
                    {renderNotConnectedContainer()}
                </div>
                <div className="footer-container">
                    <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
                    <a
                        className="footer-text"
                        href={TWITTER_LINK}
                        target="_blank"
                        rel="noreferrer"
                    >{`built on @${TWITTER_HANDLE}`}</a>
                </div>
            </div>
        </div>
    );
};

export default App;