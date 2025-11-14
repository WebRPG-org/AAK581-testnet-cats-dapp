import { createAppKit } from '@reown/appkit/react';
import { WagmiProvider, useReadContract, useWriteContract, useAccount, useAccountEffect } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { scrollSepolia, sepolia, monadTestnet, flowTestnet, moonbaseAlpha } from '@reown/appkit/networks';
import { ThemeProvider, createTheme, Box, Switch } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useMemo, memo } from 'react';
import { usePublicClient } from 'wagmi';
import { createPublicClient, http } from 'viem';
import './App.css';

const moonbasePublicClient = createPublicClient({
  chain: moonbaseAlpha,
  transport: http(),
});

const flowPublicClient = createPublicClient({
  chain: flowTestnet,
  transport: http(),
});

// Setup queryClient
const queryClient = new QueryClient();

// Get projectId
const projectId = import.meta.env.VITE_PROJECT_ID;

// Metadata
const metadata = {
  name: 'GameDApp',
  description: 'Polkadot Cats dApp',
  url: 'https://blokkat-arabicblockchain-developer.vercel.app/',
  icons: ['https://avatars.githubusercontent.com/u/179229932'],
};

// Networks - Moonbase Alpha first (default)
const networks = [moonbaseAlpha, flowTestnet, scrollSepolia, sepolia, monadTestnet];

// Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
});

// Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: { analytics: true },
});

// Contract configuration
const contractAddresses = {
  1287: '0xFee91cdC10A1663d69d6891d8b6621987aACe2EF', // Moonbase Alpha
  545: '0x292Fe1de6ce0ca4917fB6163ECb4C00b395D5804', // Flow
  534351: '0xA45a75B3523334bf4017b0BB9D76d4E06661fba3', // Scroll Sepolia
  11155111: '0xa9C4cd6C657f5110C6966c78962D47c24D27BD57', // Sepolia
  10143: '0x0968F5BF2EdEEEEf0bdB42C304DB24d5CE90B9D7' // Monad
};

const nftAddresses = {
  1287: '0x0968F5BF2EdEEEEf0bdB42C304DB24d5CE90B9D7', // Moonbase Alpha
  545: '0x335777beD22AdA837E46D28AE83ba697eDD09d62' // Flow
};

const erc721Abi = [
  {
    "type": "function",
    "name": "ownerOf",
    "inputs": [{ "name": "tokenId", "type": "uint256" }],
    "outputs": [{ "name": "", "type": "address" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "balanceOf",
    "inputs": [{ "name": "owner", "type": "address" }],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "tokenURI",
    "inputs": [{ "name": "tokenId", "type": "uint256" }],
    "outputs": [{ "name": "", "type": "string" }],
    "stateMutability": "view"
  }
];

const contractAbi = [
  {
    "type": "constructor",
    "inputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "receive",
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "KITTENS_REQUIRED",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "REWARD",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "changeReward",
    "inputs": [
      {
        "name": "newReward",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "dailyRewards",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "fundContract",
    "inputs": [],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "gameAddress",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getKittens",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getTotalKittens",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "lastClaimDay",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "owner",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "renounceOwnership",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "rewardUser",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setGameAddress",
    "inputs": [
      {
        "name": "_gameAddress",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setKittens",
    "inputs": [
      {
        "name": "userAddress",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_value",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "totalKittens",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "transferOwnership",
    "inputs": [
      {
        "name": "newOwner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "userKittens",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "withdrawFunds",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "DonationReceived",
    "inputs": [
      {
        "name": "user",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "KittensUpdated",
    "inputs": [
      {
        "name": "user",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "newValue",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OwnershipTransferred",
    "inputs": [
      {
        "name": "previousOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "newOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "UserRewarded",
    "inputs": [
      {
        "name": "user",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "OwnableInvalidOwner",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "inputs": [{ "name": "user", "type": "address" }],
    "name": "getLifetimeKittens",
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "type": "error",
    "name": "OwnableUnauthorizedAccount",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ]
  }
];

const NFTCard = memo(({ address, chainId }) => {
  const nftContract = nftAddresses[chainId];
  const baseURI = chainId === 1287 
    ? "https://gray-improved-whitefish-326.mypinata.cloud/ipfs/bafybeihnb5z3mf4q437xusfznf7cpegmgvk4bzdxjf22oqd2rbyno2oaai/"
    : "https://gray-improved-whitefish-326.mypinata.cloud/ipfs/bafybeifzsqfm6emnz4pcow62oalmcajyv3e3biz7iro5ljtizm2f3rfzza/";

  const [tokenId, setTokenId] = useState(null);
  const [nftData, setNftData] = useState(null);
  const [searching, setSearching] = useState(true);

  const publicClient = chainId === 1287 ? moonbasePublicClient : flowPublicClient;

  useEffect(() => {
    if (!address) {
      setSearching(false);
      return;
    }

    setSearching(true);
    (async () => {
      for (let id = 1; id <= 10; id++) {
        try {
          const owner = await publicClient.readContract({
            address: nftContract,
            abi: erc721Abi,
            functionName: "ownerOf",
            args: [id],
          });
          console.log(`ownerOf(${id}) = ${owner}`);
          if (owner.toLowerCase() === address.toLowerCase()) {
            console.log(`FOUND: tokenId = ${id}`);
            setTokenId(id);
            break;
          }
        } catch (e) {
          console.log(`tokenId ${id} not minted: ${e.message}`);
          continue;
        }
      }
      setSearching(false);
    })();
  }, [address, chainId]);

  useEffect(() => {
    if (!tokenId) return;
    fetch(`${baseURI}1.json`)
      .then(res => res.json())
      .then(data => setNftData(data))
      .catch(() => setNftData(null));
  }, [tokenId]);

  const explorerUrl = tokenId
    ? chainId === 1287
      ? `https://moonbase.moonscan.io/token/${nftContract}?a=${tokenId}`
      : `https://evm-testnet.flowscan.io/token/${nftContract}/instance/${tokenId}`
    : chainId === 1287
      ? `https://moonbase.moonscan.io/token/${nftContract}`
      : `https://evm-testnet.flowscan.io/token/${nftContract}`;

  if (searching) {
    return (
      <div className="nft-card">
        <div className="nft-image skeleton"></div>
        <p className="nft-name">Searching for NFT...</p>
      </div>
    );
  }

  if (!tokenId) {
    return (
      <div className="nft-card">
        <p className="nft-name">No NFT found</p>
      </div>
    );
  }

  if (!nftData) {
    return (
      <div className="nft-card">
        <div className="nft-image skeleton"></div>
        <p className="nft-name">Loading metadata...</p>
      </div>
    );
  }

  const imageUrl = nftData.image?.startsWith('ipfs://')
    ? `https://gray-improved-whitefish-326.mypinata.cloud/ipfs/${nftData.image.replace('ipfs://', '')}`
    : nftData.image;

  return (
    <div className="nft-card">
      <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="nft-link">
        <img src={imageUrl} alt={nftData.name} className="nft-image" />
      </a>
      <p className="nft-name">{nftData.name}</p>
      <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="nft-link">
        View on {chainId === 1287 ? 'Moonscan' : 'Flowscan'}
      </a>
    </div>
  );
});

// Styled Switch
const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    transition: 'transform 0.3s ease-in-out',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20"><path fill="${encodeURIComponent(
          '#fff'
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#aab4be',
        ...theme.applyStyles('dark', { backgroundColor: '#8796A5' }),
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: '#859db6ff',
    width: 32,
    height: 32,
    transition: 'background-color 0.3s ease-in-out',
    '&::before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20"><path fill="${encodeURIComponent(
        '#fff'
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
    ...theme.applyStyles('dark', { backgroundColor: '#003892' }),
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: '#aab4be',
    borderRadius: 20 / 2,
    transition: 'background-color 0.3s ease-in-out',
    ...theme.applyStyles('dark', { backgroundColor: '#8796A5' }),
  },
}));

// Helper function to get game URL by chain
const getGameUrl = (chainId) => {
  switch(chainId) {
    case 545: return 'https://flow-cats-rpg-game.vercel.app/';
    case 11155111: return 'https://rpg-game-sepolia-cats.vercel.app/';
    case 534351: return 'https://rpg-game-sepolia-cats.vercel.app/';
    case 10143: return 'https://monad-cats-game.vercel.app/';
    case 1287: return 'https://polkadot-cats-game.vercel.app/';
    default: return 'https://polkadot-cats-game.vercel.app/';
  }
};

// Helper function to get network name
const getNetworkName = (chainId) => {
  switch(chainId) {
    case 545: return 'FLOW Cats dApp';
    case 11155111: return 'Sepolia Cats dApp';
    case 534351: return 'Sepolia Cats dApp';
    case 10143: return 'Monad Cats dApp';
    case 1287: return 'Polkadot Cats dApp';
    default: return 'Polkadot Cats dApp';
  }
};

// Helper function to get native currency
const getNativeCurrency = (chainId) => {
  switch(chainId) {
    case 545: return 'FLOW';
    case 11155111: return 'ETH';
    case 534351: return 'ETH';
    case 10143: return 'MON';
    case 1287: return 'DEV';
    default: return 'DEV';
  }
};

// AppKitProvider Component
function AppKitProvider({ mode, setMode }) {
  const {chain} = useAccount();
  const { address, isConnected, isConnecting } = useAccount();

  const contractAddress = contractAddresses[chain?.id] || contractAddresses[1287];

  // Get kittens from contract
  const { data: kittenCount, error: readError, isLoading } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'getKittens',
    account: address,
    chainId: chain?.id,
    enabled: isConnected && !!address,
    refetchInterval: 10000,
  });

  // Get total kittens from contract
  const { data: totalKittens, error: readError1, isLoading1 } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'totalKittens',
    enabled: isConnected,
    refetchInterval: 10000,
  });

  // Get reward
  const { data: REWARD, error: readError2, isLoading2 } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'REWARD',
    enabled: isConnected,
    refetchInterval: 10000,
  });

  // Check NFT minted
  const { data: nftBalance } = useReadContract({
    address: nftAddresses[chain?.id],
    abi: [
      {
        name: 'balanceOf',
        type: 'function',
        inputs: [{ name: 'owner', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
      },
    ],
    functionName: 'balanceOf',
    args: [address],
    enabled: !!address && (chain?.id === 545 || chain?.id === 1287),
  });

  // Get lifetime kittens from contract
  const { data: lifetime } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'getLifetimeKittens',
    args: [address],
    enabled: !!address && (chain?.id === 545 || chain?.id === 1287),
  });

  // Claim rewards from the contract
  const { writeContract, isPending, error: writeError } = useWriteContract();

  const claimRewards = () => {
    writeContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: 'rewardUser',
      gas: 200000,
    });
  };

  // Show loading state until connection state is resolved
  if (isConnecting) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          bgcolor: 'transparent',
          color: 'text.primary',
          p: 3,
          minHeight: '90.9vh',
        }}
      >
        <p>Loading...</p>
      </Box>
    );
  }

  const currentChainId = chain?.id || 1287;
  
  // Debug logging
  console.log('Chain ID:', chain?.id);
  console.log('Current Chain ID:', currentChainId);
  console.log('Chain object:', chain);
  
  const gameUrl = getGameUrl(currentChainId);
  const networkName = getNetworkName(currentChainId);
  const nativeCurrency = getNativeCurrency(currentChainId);

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        bgcolor: 'transparent',
        color: 'text.primary',
        p: 3,
        minHeight: '100vh',
      }}
    >
      <a href={gameUrl} target="_blank" rel="noopener noreferrer">
        <img src="/oiia.png" alt="accessGameImg" className="accessGameImg" />
      </a>
      <p className="pPlay">
        Play the game <a href={gameUrl} target="_blank" rel="noopener noreferrer">here</a>!
      </p>
      <div className="network-window">
        <p className="network-title">Supported Networks:</p>
        <ul className="network-list">
          <li>Polkadot Moonbase Alpha (1287)</li>
          <li>Flow Testnet (545)</li>
          <li>Sepolia (11155111)</li>
          <li>Scroll Sepolia (534351)</li>
          <li>Monad Testnet (10143)</li>
        </ul>
      </div>
      <div className="containerDiv" sx={[
        (theme) => ({
          backgroundColor: '#e1e5e9',
        }),
        (theme) =>
          theme.applyStyles('dark', {
            backgroundColor: theme.palette.secondary.main,
          }),
      ]}>
        <h1 className="app-title">{networkName}</h1>
        <FormGroup>
          <FormControlLabel
            control={
              <MaterialUISwitch
                sx={{ m: 1, position: 'absolute', top: '1rem', right: '1rem' }}
                checked={mode === 'dark'}
                onChange={() => setMode(mode === 'dark' ? 'light' : 'dark')}
              />
            }
          />
        </FormGroup>
        {!isConnected ? (
          <div className="w3div">
            <w3m-button className="connectButton" />
          </div>
        ) : (
          <>
            <p className="app-text">Wallet: {address?.slice(0, 6)}...{address?.slice(-4)}</p>
            <p className="app-text">On-Chain Kittens: {isLoading ? 'Loading...' : kittenCount ? Number(kittenCount) : '0'}</p>
            {(currentChainId === 545 || currentChainId === 1287) && (
              <>
                <p className="app-text">
                  Lifetime Kittens: {lifetime ? Number(lifetime) : 0} / 20 for NFT Eligibility
                </p>

                {lifetime && Number(lifetime) >= 20 && (
                  <p className="app-text milestone-text">Milestone Reached!</p>
                )}

                {nftBalance && Number(nftBalance) > 0 && (
                  <p className="app-text milestone-text">NFT Minted!</p>
                )}

                {/* NFT Card */}
                {nftBalance && Number(nftBalance) > 0 && address && (
                  <NFTCard key={address} address={address} chainId={currentChainId} />
                )}
              </>
            )}
            <p className="app-text">
              Total Kittens Collected By Players: {isLoading1 ? 'Loading...' : !totalKittens ? 0 : Number(totalKittens)}
            </p>
            <p className="app-text">
              Current reward: {isLoading2 ? 'Loading...' : !REWARD ? `0.015 ${nativeCurrency}` : `${Number(REWARD) / 1000000000000000000} ${nativeCurrency}`}
            </p>
            {readError && <p className="app-error">Error: {readError.message}</p>}
            {readError1 && <p className="app-error">Error: {readError1.message}</p>}
            <p className="app-text">Minimum kittens required to claim rewards: 15 kittens</p>
            <button className="app-button" onClick={claimRewards} disabled={isPending}>
              {isPending ? 'Claiming...' : 'Claim Rewards'}
            </button>
            {writeError && <p className="app-error">Error: {writeError.message}</p>}
          </>
        )}
        <p className="app-textRequest">
          If you have Testnet {nativeCurrency} that you don't need, please donate to this address
        </p>
        <p>{contractAddress}</p>
        <b>
          <p className="app-textEligible">
            Donations above {currentChainId === 545 ? '10,000,000 FLOW' : currentChainId === 10143 ? '200 MON' : currentChainId === 11155111 || currentChainId === 534351 ? '200 SETH' : '200 DEV'} will be eligible for advertisement!!
          </p>
        </b>
        <i><p className="disclaimer">No gambling or NSFW advertisements allowed</p></i>
      </div>
      <img 
        className={`app-sepImg ${isConnected ? 'connected' : 'disconnected'}`} 
        src="/sepoliaSuit1.png" 
        useMap="#image-map" 
        alt="Cats Mascot" 
      />
      <footer className="footerName">Made by AAK581</footer>
      <footer className="footerLinks">
        <a href="https://www.linkedin.com/in/adham-ahmed-3849b324b/" target="_blank" rel="noopener noreferrer">LinkedIn</a> - 
        <a href="https://github.com/AAK581/sepolia-cats-dapp" target="_blank" rel="noopener noreferrer"> Github</a>
      </footer>
    </Box>
  );
}

export default function App() {
  const [mode, setMode] = useState('light');
  const theme = createTheme({
    palette: { mode },
    transitions: { duration: { standard: 300 } },
  });

  useEffect(() => {
    const button = document.querySelector('.app-button');
    
    if (mode === 'dark') {
      document.body.style.background = 'linear-gradient(135deg, #2c3e50 0%, #4a5568 100%)';
      if (button) {
        button.style.backgroundColor = '#1976d2';
        button.style.color = 'white';
      }
    } else {
      document.body.style.background = 'linear-gradient(135deg, #83b9b7 0%, #fcc3d5 100%)';
      if (button) {
        button.style.backgroundColor = '#1976d2';
        button.style.color = 'white';
      }
    }
  }, [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <WagmiProvider config={wagmiAdapter.wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <AppKitProvider mode={mode} setMode={setMode} />
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}