# EtherFund API Documentation

## Base URL

```
http://localhost:3001/api
```

## Endpoints

### Get All Campaigns

**GET** `/campaigns`

Returns a list of all campaigns with blockchain data.

**Response:**
```json
[
  {
    "id": 1,
    "contractAddress": "0x...",
    "creator": "0x...",
    "title": "Campaign Title",
    "description": "Campaign description",
    "goalAmount": "1000000000000000000",
    "deadline": 1704067200,
    "totalRaised": "500000000000000000",
    "goalReached": false,
    "fundsWithdrawn": false,
    "contributorCount": "5",
    "createdAt": 1703980800
  }
]
```

### Get Campaign by ID

**GET** `/campaigns/:id`

Returns detailed information about a specific campaign.

**Response:**
```json
{
  "id": 1,
  "contractAddress": "0x...",
  "creator": "0x...",
  "title": "Campaign Title",
  "description": "Campaign description",
  "goalAmount": "1000000000000000000",
  "deadline": 1704067200,
  "totalRaised": "500000000000000000",
  "goalReached": false,
  "fundsWithdrawn": false,
  "contributorCount": "5",
  "contributions": [...],
  "createdAt": 1703980800,
  "updatedAt": 1703980800
}
```

### Create Campaign

**POST** `/campaigns`

Creates a new campaign record in the database. Note: The smart contract must be deployed first.

**Request Body:**
```json
{
  "title": "Campaign Title",
  "description": "Campaign description",
  "goalAmount": "1000000000000000000",
  "deadline": 1704067200,
  "contractAddress": "0x...",
  "creatorAddress": "0x..."
}
```

**Response:**
```json
{
  "id": 1,
  "contractAddress": "0x...",
  "creator": "0x...",
  "title": "Campaign Title",
  "description": "Campaign description",
  "goalAmount": "1000000000000000000",
  "deadline": 1704067200,
  "createdAt": 1703980800
}
```

### Get Campaign Contributions

**GET** `/campaigns/:id/contributions`

Returns all contributions for a specific campaign.

**Response:**
```json
[
  {
    "id": 1,
    "campaignId": 1,
    "contributorAddress": "0x...",
    "amount": "100000000000000000",
    "transactionHash": "0x...",
    "blockNumber": 12345,
    "createdAt": 1703980800
  }
]
```

### Sync Campaign State

**POST** `/campaigns/:id/sync`

Syncs campaign state from blockchain.

**Request Body:**
```json
{
  "contractAddress": "0x..."
}
```

**Response:**
```json
{
  "contractAddress": "0x...",
  "totalRaised": "500000000000000000",
  "goalReached": false,
  "fundsWithdrawn": false,
  "contributorCount": "5"
}
```

### Get Campaigns by Creator

**GET** `/campaigns/users/:address/campaigns`

Returns all campaigns created by a specific address.

**Response:**
```json
[
  {
    "id": 1,
    "contractAddress": "0x...",
    "creator": "0x...",
    "title": "Campaign Title",
    ...
  }
]
```

### Get Contributions by Contributor

**GET** `/campaigns/users/:address/contributions`

Returns all contributions made by a specific address.

**Response:**
```json
[
  {
    "id": 1,
    "campaignId": 1,
    "contributorAddress": "0x...",
    "amount": "100000000000000000",
    ...
  }
]
```

## Error Responses

All errors follow this format:

```json
{
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE"
  }
}
```

**Status Codes:**
- `400` - Bad Request (validation error)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

