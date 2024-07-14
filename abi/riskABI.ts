import { Address } from "viem";

export const riskAddress = '0x087f3Bd95B006e3B1C96552BAaBfD52ce9a639e8' as Address;
export const riskABI =  [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "ECDSAInvalidSignature",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "length",
        "type": "uint256"
      }
    ],
    "name": "ECDSAInvalidSignatureLength",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "s",
        "type": "bytes32"
      }
    ],
    "name": "ECDSAInvalidSignatureS",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidShortString",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "str",
        "type": "string"
      }
    ],
    "name": "StringTooLong",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "gameID",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "euint32",
        "name": "territoryID",
        "type": "uint256"
      }
    ],
    "name": "Artillery",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "gameID",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "euint32",
        "name": "territoryID",
        "type": "uint256"
      }
    ],
    "name": "Bamba",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [],
    "name": "EIP712DomainChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "gameID",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "winner",
        "type": "address"
      }
    ],
    "name": "GameEnded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "gameID",
        "type": "uint256"
      }
    ],
    "name": "GameStarted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "gameID",
        "type": "uint256"
      }
    ],
    "name": "Garrison",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "gameID",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "euint32",
        "name": "territoryID",
        "type": "uint256"
      }
    ],
    "name": "Intel",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "gameID",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "player",
        "type": "address"
      }
    ],
    "name": "TurnEnded",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "gameID",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "fromData",
        "type": "bytes"
      },
      {
        "internalType": "bytes",
        "name": "toData",
        "type": "bytes"
      },
      {
        "internalType": "bytes",
        "name": "amountData",
        "type": "bytes"
      }
    ],
    "name": "attackTroops",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "contractOwner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "createGame",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "gameID",
        "type": "uint256"
      }
    ],
    "name": "declareVictory",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "gameID",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "locationData",
        "type": "bytes"
      },
      {
        "internalType": "bytes",
        "name": "amountData",
        "type": "bytes"
      }
    ],
    "name": "deployTroops",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "eip712Domain",
    "outputs": [
      {
        "internalType": "bytes1",
        "name": "fields",
        "type": "bytes1"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "version",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "chainId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "verifyingContract",
        "type": "address"
      },
      {
        "internalType": "bytes32",
        "name": "salt",
        "type": "bytes32"
      },
      {
        "internalType": "uint256[]",
        "name": "extensions",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "gameID",
        "type": "uint256"
      }
    ],
    "name": "endGame",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "gameID",
        "type": "uint256"
      }
    ],
    "name": "endTurn",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "gameCounter",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "games",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "gameID",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "currentTurn",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "active",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "gameID",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "getPlayer",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "gameID",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "isUserTurn",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "gameID",
        "type": "uint256"
      }
    ],
    "name": "joinGame",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "gameID",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "fromData",
        "type": "bytes"
      },
      {
        "internalType": "bytes",
        "name": "toData",
        "type": "bytes"
      },
      {
        "internalType": "bytes",
        "name": "amountData",
        "type": "bytes"
      }
    ],
    "name": "moveTroops",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "gameID",
        "type": "uint256"
      },
      {
        "internalType": "euint32",
        "name": "territoryID",
        "type": "uint256"
      },
      {
        "internalType": "euint32",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "placeTroops",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "playerWins",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "gameID",
        "type": "uint256"
      },
      {
        "internalType": "euint32",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "purchaseTroops",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "returnUserGames",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "gameID",
        "type": "uint256"
      }
    ],
    "name": "startGame",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "gameID",
        "type": "uint256"
      },
      {
        "internalType": "uint32",
        "name": "cardToUse",
        "type": "uint32"
      },
      {
        "internalType": "bytes",
        "name": "territoryData",
        "type": "bytes"
      }
    ],
    "name": "useCard",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "userGames",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "gameID",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "publicKey",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "signature",
        "type": "bytes"
      }
    ],
    "name": "viewBalance",
    "outputs": [
      {
        "internalType": "bytes",
        "name": "balance",
        "type": "bytes"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "gameID",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "card",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "publicKey",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "signature",
        "type": "bytes"
      }
    ],
    "name": "viewCardCount",
    "outputs": [
      {
        "internalType": "bytes",
        "name": "balance",
        "type": "bytes"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "gameID",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "territoryID",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "publicKey",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "signature",
        "type": "bytes"
      }
    ],
    "name": "viewTerritory",
    "outputs": [
      {
        "internalType": "bytes",
        "name": "troopsHere",
        "type": "bytes"
      },
      {
        "internalType": "bytes",
        "name": "owner",
        "type": "bytes"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "gameID",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "publicKey",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "signature",
        "type": "bytes"
      }
    ],
    "name": "viewTotalSoldiers",
    "outputs": [
      {
        "internalType": "bytes",
        "name": "balance",
        "type": "bytes"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;