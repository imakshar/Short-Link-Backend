import { TempResetToken } from "../models";
const uuid = require("uuid");
const GenrateToken = (source_id, source_type) => {
    return new Promise((resolve, reject) => {
        new TempResetToken({
            source_id,
            source_type,
            token: uuid.v4(),
            valid: true,
        }).save((err, data) => {
            if (err) reject(err);
            resolve({
                token: data.token,
            });
        });
    });
};

const ValidateToken = (source_id, token) => {
    return new Promise((resolve, reject) => {
        TempResetToken.findOne({ source_id, token }, async (err, data) => {
            if (err) reject(err);
            if (data) {
                if (data.token && data.valid) {
                    data.valid = false;
                    await data.save();
                    resolve({
                        isValid: true,
                    });
                } else {
                    reject("Token Expired");
                }
            } else {
                reject("Invalid Request");
            }
        });
    });
};
export { GenrateToken, ValidateToken };
