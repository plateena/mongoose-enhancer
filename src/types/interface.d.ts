// File: ./src/types/interface.d.ts

import { Request } from 'express'
import { Model } from 'mongoose'

export interface IPagination {
    per_page: number | undefined
    current_page: number | undefined
    last_page: number | undefined
}

export interface ISearch<T> {
    status: string
    _filter?: any[]
    data: Partial<T>[]
    total: number
    pagination?: IPagination
}

// Model interface
export interface IDefaultModel {
    search<T, R>(req: R): Promise<T>
    delete<T>(id: number | string): Promise<T[]>
    deleteAll<T>(): Promise<T>
}
