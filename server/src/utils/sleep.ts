import { resolve } from "node:dns";

export function sleep(ms: number){
    return new Promise(resolve => setTimeout(resolve, ms))
}