import React from "react"
import { Link } from 'react-router-dom'

export const Error = () => {
    return <>
    <h1 style={{textAlign:"center"}}>Invalid url</h1>
    <Link to='/' className='button-xlarge pure-button'>
        Back Home
    </Link>
    </>
};