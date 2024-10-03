/*
The Licensed Work is (c) 2024 Sygma
SPDX-License-Identifier: LGPL-3.0-only
*/
import { expect } from "chai"
import sinon from "sinon"
import { ApiPromise, WsProvider } from "@polkadot/api"
import { Domain, getSsmDomainConfig } from "../../src/config"
import { parseDestination } from "../../src/indexer/evmIndexer/utils"
import { Network } from "@buildwithsygma/sygma-sdk-core"
import { DepositType } from "../../src/indexer/evmIndexer/evmTypes"

describe("Destination parser", function () {
    let mockJunction: any; 
    let mockCreateType = sinon.stub()
    beforeEach(() => {     
      const mockApiPromise = {
        createType: mockCreateType,
      }
      sinon.stub(ApiPromise, "create").resolves(mockApiPromise as unknown as ApiPromise)
    })
  
    afterEach(() => {
      sinon.restore()
    })
  
    it("should parse evm destination for GMP deposit log", async function () {
      const hexData =
        "0x000000000000000000000000000000000000000000000000000000000007a1200004a271ced214dee6b4c59e3a0f0088878aeccf849a49031eed30140ae5594f4b6833e488bf6c4c9e94c246d90abfdb0000000000000000000000000000000000000000000000000000018b3d2082f5"
      const domain = {
        id: 2,
        type: Network.EVM,
      } as unknown as Domain
  
      const destination = await parseDestination(hexData, domain, DepositType.PERMISSIONLESS_GENERIC, new Map<number, ApiPromise>())
      expect(destination).to.be.deep.equal("0xdee6b4c59e3a0f0088878aeccf849a49031eed30")
    })
  
    it("should parse evm destination for fungible evm deposit log", async function () {
      const hexData =
        "0x000000000000000000000000000000000000000000000000000000000000006400000000000000000000000000000000000000000000000000000000000000145c1f5961696bad2e73f73417f07ef55c62a2dc5b0102"
      const domain = {
        id: 2,
        type: Network.EVM,
      } as unknown as Domain
  
      const destination = await parseDestination(hexData, domain, DepositType.FUNGIBLE, new Map<number, ApiPromise>())
      expect(destination).to.be.deep.equal("0x5c1f5961696bad2e73f73417f07ef55c62a2dc5b")
    })
    
    it("should parse substrate destination for evm deposit log", async () => {
      sinon.stub(WsProvider.prototype, "connect")
      const substrateRPCs = await getSsmDomainConfig('[{"id": 3, "endpoint": "ws://substrate-pallet:9944"}]')

      const hexData =
        "0x00000000000000000000000000000000000000000000000000005af3107a4000000000000000000000000000000000000000000000000000000000000000002400010100d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d"
      const domain = {
        id: 3,
        type: Network.SUBSTRATE,
      } as unknown as Domain

      mockJunction = {
        isX1: true,
        asX1: {
          isAccountId32: true,
          asAccountId32: {
            id: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
        } 
        }
      }
      mockCreateType.returns( {
        interior: mockJunction,
      })

      const destination = await parseDestination(hexData, domain, DepositType.FUNGIBLE, substrateRPCs)
      expect(destination).to.equal("5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY")
    })
  
    it("should return an empty string when junctions.accountId32 is not present", async () => {
      sinon.stub(WsProvider.prototype, "connect")
      const substrateRPCs = await getSsmDomainConfig('[{"id": 3, "endpoint": "ws://substrate-pallet:9944"}]')

      const hexData = "0x000000"
      const domain = {
        id: 3,
        type: Network.SUBSTRATE,
      } as unknown as Domain
      
      mockJunction = {
        isX1: true,
        asX1: {
          isAccountId32: false,
          asAccountId32: {
            id: ""
          }
        }
      }
      mockCreateType.returns( {
        interior: mockJunction,
      })

      const result = await parseDestination(hexData, domain, DepositType.FUNGIBLE, substrateRPCs)
      expect(result).to.equal("")
    })
  })
  

