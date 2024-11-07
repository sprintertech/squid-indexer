/*
The Licensed Work is (c) 2024 Sygma
SPDX-License-Identifier: LGPL-3.0-only
*/

const resourceSchema = {
  type: "object",
  nullable: true,
  properties: {
    id: {
      type: "string",
      format: "ObjectId",
      example:
        "0x0000000000000000000000000000000000000000000000000000000000000001",
    },
    type: { type: "string", example: "ERC20" },
  },
};

const domainSchema = {
  type: "object",
  properties: {
    id: { type: "integer", format: "ObjectId", example: "1" },
    name: { type: "string", example: "Ethereum" },
    lastIndexedBlock: { type: "string", example: "12984723" },
  },
};

const feeSchema = {
  type: "object",
  nullable: true,
  properties: {
    id: {
      type: "string",
      format: "ObjectId",
      example: "60f7da143ce83aef2d325dd2",
    },
    amount: { type: "string", example: "10000000000000000" },
    tokenAddress: {
      type: "string",
      example: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    tokenSymbol: { type: "string", example: "DAI" },
    resourceID: {
      type: "string",
      format: "ObjectId",
      example:
        "0x0000000000000000000000000000000000000000000000000000000000000001",
    },
    decimals: { type: "integer", nullable: true, example: 18 },
    transferId: {
      type: "string",
      format: "ObjectId",
      uniqueItems: true,
      example: "60f7da143ce83aef2d325dcd",
    },
  },
};

const transferStatusSchema = {
  status: {
    type: "string",
    enum: ["pending", "executed", "failed"],
  },
};

const accountSchema = {
  type: "object",
  nullable: true,
  properties: {
    id: {
      type: "string",
      format: "ObjectId",
      example: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    },
    addressStatus: { type: "string" },
  },
};

const depositSchema = {
  type: "object",
  nullable: true,
  properties: {
    id: {
      type: "string",
      format: "ObjectId",
      example: "60f7da143ce83aef2d325dd3",
    },
    transferId: {
      type: "string",
      format: "ObjectId",
      uniqueItems: true,
      example: "60f7da143ce83aef2d325dcd",
    },
    type: { type: "string", example: "ERC20" },
    txHash: {
      type: "string",
      example:
        "0x9f464d3b3c85b007aef6950dbccff03e6a450a059f853802d4e7f9d4e4c8c4e2",
    },
    blockNumber: { type: "string", example: "12984756" },
    depositData: { type: "string", example: "0x1234567890abcdef" },
    handlerResponse: {
      type: "string",
      nullable: true,
      example: "0x1234567890abcdef",
    },
    timestamp: {
      type: "string",
      format: "date-time",
      nullable: true,
      example: "2024-04-02T12:00:00Z",
    },
  },
};

const executionSchema = {
  type: "object",
  nullable: true,
  properties: {
    id: {
      type: "string",
      format: "ObjectId",
      example: "60f7da143ce83aef2d325dd4",
    },
    transferId: {
      type: "string",
      format: "ObjectId",
      uniqueItems: true,
      example: "60f7da143ce83aef2d325dcd",
    },
    type: { type: "string", example: "ERC20" },
    txHash: {
      type: "string",
      example:
        "0x6b0c56d1ad5144a4bdaa7a067f8c002a7d2ad4e9f8cc00e4b4d7e6cfe1b7a8a8",
    },
    blockNumber: { type: "string", example: "12984799" },
    timestamp: {
      type: "string",
      format: "date-time",
      nullable: true,
      example: "2024-04-02T12:00:00Z",
    },
  },
};

const transferSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      format: "ObjectId",
      example: "60f7da143ce83aef2d325dcd",
    },
    depositNonce: { type: "integer", uniqueItems: true, example: 1 },
    resourceID: {
      type: "string",
      format: "ObjectId",
      nullable: true,
      example:
        "0x0000000000000000000000000000000000000000000000000000000000000001",
    },
    resource: { ...resourceSchema },
    fromDomainId: { type: "integer", format: "ObjectId", example: "1" },
    fromDomain: { ...domainSchema },
    toDomainId: {
      type: "integer",
      format: "ObjectId",
      nullable: true,
      example: "2",
    },
    toDomain: {
      type: "object",
      nullable: true,
      properties: { ...domainSchema.properties },
    },
    accountId: {
      type: "string",
      format: "ObjectId",
      nullable: true,
      example: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    },
    account: { ...accountSchema },
    destination: {
      type: "string",
      nullable: true,
      example: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    },
    amount: { type: "string", nullable: true, example: "1000000000000000000" },
    message: { type: "string", nullable: true, example: "" },
    usdValue: { type: "number", nullable: true, example: 0 },
    status: { ...transferStatusSchema },
    fee: { ...feeSchema },
    deposit: { ...depositSchema },
    execution: { ...executionSchema },
  },
};

const paginationSchema = {
  page: {
    type: "number",
    default: 1,
  },
  limit: {
    type: "number",
    default: 10,
  },
};

export const transfersSchema = {
  summary: "Get all transfers (ordered by time)",
  querystring: {
    type: "object",
    properties: {
      ...paginationSchema,
      ...transferStatusSchema,
    },
  },
  response: {
    200: {
      description: "List of transfers",
      content: {
        "application/json": {
          schema: {
            type: "array",
            items: {
              ...transferSchema,
            },
          },
        },
      },
    },
  },
};

export const transfersBySenderSchema = {
  summary: "Get all transfers initiated by a specific sender",
  querystring: {
    type: "object",
    properties: {
      ...paginationSchema,
      ...transferStatusSchema,
    },
  },
  params: {
    type: "object",
    properties: {
      senderAddress: { type: "string" },
    },
  },
  response: {
    200: {
      description: "List of transfers",
      content: {
        "application/json": {
          schema: {
            type: "array",
            items: {
              ...transferSchema,
            },
          },
        },
      },
    },
  },
};

export const transferByTxHashAndDomainSchema = {
  summary: "Get a specific transfer by transaction hash",
  querystring: {
    type: "object",
    properties: {
      domainID: { type: "number" },
    },
  },
  params: {
    type: "object",
    properties: {
      txHash: { type: "string" },
    },
  },
  response: {
    200: {
      description: "Transfer",
      content: {
        "application/json": {
          schema: {
            type: "array",
            items: {
              ...transferSchema,
            },
          },
        },
      },
    },
  },
};
