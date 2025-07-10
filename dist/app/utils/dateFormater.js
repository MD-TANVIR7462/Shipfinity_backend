"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFormattedDate = exports.getTodaysDate = void 0;
const getTodaysDate = () => new Date().toISOString().split('T')[0];
exports.getTodaysDate = getTodaysDate;
const getFormattedDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
exports.getFormattedDate = getFormattedDate;
