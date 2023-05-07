export interface body_type {
    id: number,
    first_name: string,
    last_name: string,
    email: string,
    gender: string,
    ip_address: string,
}
export interface response_data<T> {
    message:string,
    code: number,
    data?:T
}