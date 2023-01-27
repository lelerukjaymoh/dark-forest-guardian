import { Schema, model } from "mongoose";
import { tokenInterface } from "../helpers/types";

const TokenSchema = new Schema<tokenInterface>(
  {
    tokenAddress: { type: String, required: true },
    bought: { type: Boolean, required: true, default: false },
    sold: { type: Boolean, required: true, default: false },
    txHash: { type: String, required: false, unique: false },
  },
  {
    timestamps: true,
  }
);

const TrackedTokens = model<tokenInterface>("TrackedTokens", TokenSchema);

export { TrackedTokens };
