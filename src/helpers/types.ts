import { BigNumber } from "ethers";
import { TrackedTokens } from "../database";

export interface TxnData {
    name: string,
    value: BigNumber,
    token: string,
    baseToken: string,
    baseTokenLiquidityAmount: number
}

export interface BuyData {
    path: string[],
    to: string,
    amountIn: BigNumber,
    amountOutMin: BigNumber,
    deadline: number
}

export interface Tokens {
    token: string,
    baseToken: string
}

export interface TokenInterface {
    tokenAddress: string;
    bought: boolean;
    sold: boolean;
    txHash: string;
}

export interface BoughtTokens {
    [key: string]: TokenInterface;
}
