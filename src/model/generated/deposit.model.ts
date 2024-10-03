/*
The Licensed Work is (c) 2024 Sygma
SPDX-License-Identifier: LGPL-3.0-only
*/
import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToOne as OneToOne_, StringColumn as StringColumn_, DateTimeColumn as DateTimeColumn_} from "@subsquid/typeorm-store"
import {Transfer} from "./transfer.model"

@Entity_()
export class Deposit {
    constructor(props?: Partial<Deposit>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @OneToOne_(() => Transfer, e => e.deposit)
    transfer!: Transfer | undefined | null

    @StringColumn_({nullable: false})
    type!: string

    @StringColumn_({nullable: false})
    txHash!: string

    @StringColumn_({nullable: false})
    blockNumber!: string

    @StringColumn_({nullable: false})
    depositData!: string

    @DateTimeColumn_({nullable: true})
    timestamp!: Date | undefined | null

    @StringColumn_({nullable: false})
    handlerResponse!: string
}
