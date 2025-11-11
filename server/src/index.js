import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req,res)=> res.json({ ok:true, name:'API Inventario (stub)' }))

// TODO: endpoints /auth /inventory /requests

const PORT = process.env.PORT || 4000
app.listen(PORT, ()=> console.log('API on http://localhost:'+PORT))
