import { Elysia, ws } from 'elysia'
import { cors } from '@elysiajs/cors'
import data_json from './data.json';
import { body_type , response_data } from './types'


const app = new Elysia()
    .use(cors())
    .listen(3000)

app.get('/', () => 'Hello Elysia')
    .listen(3000)

app.get('/users', (): body_type[] => data_json)


app.get('/users/:id', ({ params: { id } }): response_data<body_type> =>{ 
    const find_id = data_json.findIndex(data => data.id === Number(id))
    if(find_id === -1 ) return {message:'err',code:404}
    return {message:'ok',data:data_json[find_id] , code:200}
 })

app.post('/users', ({ body }): response_data<body_type[]>  => {
    const body_data : body_type = <body_type> body 
    const find_id = data_json.map(data => data.id)
    data_json.push({ ...body_data, id: Math.max(...find_id, 0) + 1 })
    return {message:'ok',data:data_json ,code:200}
})

app.put('/users', ({ body })  =>{
    const body_data : body_type = <body_type> body 
    const find_id = data_json.findIndex(data => data.id === body_data.id)
    if(find_id === -1) return {message:'err',code:404}
    data_json[find_id] = body_data
    return {message:'ok',code:200,data:data_json}
})


app.delete('/users', ({ body }): response_data<body_type[]>  => {
    const body_data : body_type = <body_type> body 
    const find_id = data_json.findIndex(data => data.id === body_data.id)
    if(find_id === -1) return {message:'err',code:404}
    data_json.splice(find_id, 1)
    return {message:'ok',code:200,data:data_json}
})

app.use(ws())
    .ws('/socket', {
        message(ws, message) {
            ws.send(message)
        }
    })
    .listen(3000)


console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
