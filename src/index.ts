import { Elysia, ws } from 'elysia'
import { cors } from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'
import data_json from './data.json';
import { body_data } from './types'
const app = new Elysia()
    .use(cors())
    .use(swagger({
        path: '/docs'
    }))
    .listen(3000)

app.get('/', () => 'Hello Elysia')
    .listen(3000)

app.get('/users', () => data_json)


app.get('/users/:id', ({ params: { id } }) =>{ 
    const find_id = data_json.findIndex(data => data.id === +id)
    if(find_id === -1 ) return {message:'err',code:404}
    return {message:'ok',data:data_json[find_id] , code:200}
 })

app.post('/users', ({ body }) => {
    const body_data = body as body_data
    data_json.push({ ...body_data, id: data_json.length + 1 })
    return {message:'ok',data:data_json , code:200}
})

app.put('/users', ({ body }) =>{
    const body_data = body as body_data
    const find_id = data_json.findIndex(data => data.id === body_data.id)
    if(find_id === -1) return {message:'err',code:404}
    data_json[find_id] = body_data
    return {message:'ok',code:200,data:data_json}
})

app.delete('/delete', ({ body }) =>{
    const body_data = body as body_data
    const find_id = data_json.findIndex(data => data.id === body_data.id)
    if(find_id === -1) return {message:'err',code:404}
    data_json.slice(find_id, 1)
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
