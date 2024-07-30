import express from "express"
import mongoose from "mongoose"

const AuthSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

export const AuthModel = mongoose.model("AuthModel", AuthSchema)