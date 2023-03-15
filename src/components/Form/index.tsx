import React, { FormEvent } from 'react'

const Form: React.FC = () => {
    return (
        <form action='/api/wheater' method='GET' className="w-4/5 flex gap-3 m-auto">
            <input type="text" name="citie_name" className='py-1 px-4 rounded-md w-full' />
            <input type="submit" value="Buscar Cidade" className='py-2 px-4 rounded-md bg-slate-500 text-white' />
        </form>
    )
}

export default Form