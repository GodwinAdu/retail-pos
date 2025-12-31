import { Model, model, models, Schema } from "mongoose";
import { IStore } from "../types";

const StoreSchema: Schema<IStore> = new Schema({
    name: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: null,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    storeEmail: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    storePhone: {
        type: String,
        default: null,
    },
    storeAddress: {
        type: String,
        default: null,
    },
    numberOfBranches: {
        type: Number,
        default: 0,
    },
    subscriptionPlan: {
        period: {
            name: {
                type: String,
                default: 'Monthly',
            },
            value: {
                type: Number,
                default: 1
            }
        },
        subscriptionExpiry: {
            type: Date,
            default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        },
        paymentStatus: {
            type: String,
            default: 'Free Trial'
        },
        trialEndsAt: {
            type: Date,
            default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days trial
        },
        isBlocked: {
            type: Boolean,
            default: false
        },
        blockedAt: {
            type: Date,
            default: null
        },
    },
    banned: {
        type: Boolean,
        default: false
    },
    branchIds: [{
        type: Schema.Types.ObjectId,
        ref: "Branch",
        default: [],
    }],
    paymentHistory: [{
        reference: { type: String, required: true },
        amount: { type: Number, required: true },
        status: { type: String, required: true },
        paidAt: { type: Date, required: true },
        paymentMethod: { type: String, required: true },
        transactionId: { type: String, required: true }
    }],
}, {
    timestamps: true,
    versionKey: false,
});

type StoreModel = Model<IStore>;
const Store: StoreModel = models.Store || model<IStore>("Store", StoreSchema);

export default Store;